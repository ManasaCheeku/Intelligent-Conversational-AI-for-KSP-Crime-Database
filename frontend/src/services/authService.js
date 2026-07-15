import apiClient from './api';

const AUTH_ACCESS_KEY = 'ksp_access_token';
const AUTH_REFRESH_KEY = 'ksp_refresh_token';
const USER_PROFILE_KEY = 'ksp_user_profile';

const authService = {
  /**
   * Submits investigator credentials to retrieve valid JWT access & refresh pairs
   * @param {string} badgeNumber 
   * @param {string} password 
   */
  login: async (badgeNumber, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        badge_number: badgeNumber,
        password: password
      });

      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem(AUTH_ACCESS_KEY, access_token);
      localStorage.setItem(AUTH_REFRESH_KEY, refresh_token);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Invalidates active tokens with the server and clears browser storage
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem(AUTH_REFRESH_KEY);
      if (refreshToken) {
        // Notify backend to blacklist the current refresh token
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (error) {
      // Proceed with local storage clearance even if API logout handshake fails
      console.warn('Backend logout handshake timed out. Cleared local session.');
    } finally {
      localStorage.removeItem(AUTH_ACCESS_KEY);
      localStorage.removeItem(AUTH_REFRESH_KEY);
      localStorage.removeItem(USER_PROFILE_KEY);
      window.dispatchEvent(new Event('ksp-auth-logout'));
    }
  },

  /**
   * Retrieves the logged-in user state cached locally in local storage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_PROFILE_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Fetches fresh user data from the backend server to sync system roles
   */
  refreshUserProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data;
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirms the presence of local credentials
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_ACCESS_KEY);
  }
};

export default authService;