import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";
import type { TokenResponse } from "../types/auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const api = axios.create({ baseURL, headers: { "Content-Type": "application/json" }, timeout: 15_000 });
const bareApi = axios.create({ baseURL, headers: { "Content-Type": "application/json" }, timeout: 15_000 });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status !== 401 || !request || request._retry || request.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return Promise.reject(error);
    request._retry = true;
    refreshPromise ??= bareApi.post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
      .then(({ data }) => { tokenStorage.save(data); return data.access_token; })
      .finally(() => { refreshPromise = null; });
    try {
      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch (refreshError) {
      tokenStorage.clear();
      window.dispatchEvent(new Event("ksp-auth-expired"));
      return Promise.reject(refreshError);
    }
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((item) => item.msg).join(" ");
  }
  return "Something went wrong. Please try again.";
}

export default api;
