import api from "./api";
import { tokenStorage } from "./tokenStorage";
import type { LoginCredentials, RegistrationPayload, TokenResponse, User } from "../types/auth";

export const authService = {
  register: async (payload: RegistrationPayload): Promise<User> => (await api.post<User>("/auth/register", payload)).data,
  login: async (payload: LoginCredentials): Promise<TokenResponse> => (await api.post<TokenResponse>("/auth/login", payload)).data,
  getCurrentUser: async (): Promise<User> => (await api.get<User>("/users/me")).data,
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    try { if (refreshToken) await api.post("/auth/logout", { refresh_token: refreshToken }); }
    finally { tokenStorage.clear(); }
  },
};
