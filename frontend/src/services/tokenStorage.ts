import type { TokenResponse, User } from "../types/auth";

const ACCESS_TOKEN_KEY = "ksp_access_token";
const REFRESH_TOKEN_KEY = "ksp_refresh_token";
const USER_KEY = "ksp_user";

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: (): User | null => {
    const value = localStorage.getItem(USER_KEY);
    if (!value) return null;
    try { return JSON.parse(value) as User; } catch { return null; }
  },
  save: ({ access_token, refresh_token, user }: TokenResponse): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  saveUser: (user: User): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
