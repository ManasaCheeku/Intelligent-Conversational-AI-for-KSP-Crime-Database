import axios from 'axios';

// Safely resolve the environment URL with fallback for development environments
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Guard state to prevent infinite refresh loops and queue pending requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor
 * Dynamically injects the active JWT token into the Authorization headers
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ksp_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles intercepting 401 Unauthorized exceptions to silenty refresh 
 * the access token using the system's refresh token token securely.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to an expired token (401 Unauthorized) and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while waiting for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('ksp_refresh_token');
      
      if (!refreshToken) {
        // No refresh token available, force user re-authentication
        handleSessionExpired();
        return Promise.reject(error);
      }

      try {
        // Call backend token refresh endpoint (using the same raw instance to avoid interceptors loops)
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = refreshResponse.data;

        localStorage.setItem('ksp_access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('ksp_refresh_token', newRefreshToken);
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    // Format global API errors to feed client components structured reports
    const formattedError = {
      message: error.response?.data?.detail || error.message || 'An unexpected error occurred.',
      status: error.response?.status || null,
      data: error.response?.data || null,
    };

    return Promise.reject(formattedError);
  }
);

/**
 * Handle structural session expiration cleanly (clears storage and triggers login routing)
 */
const handleSessionExpired = () => {
  localStorage.removeItem('ksp_access_token');
  localStorage.removeItem('ksp_refresh_token');
  localStorage.removeItem('ksp_user_profile');
  
  // Custom event so React components can listen and redirect appropriately
  window.dispatchEvent(new Event('ksp-auth-session-expired'));
};

export default apiClient;