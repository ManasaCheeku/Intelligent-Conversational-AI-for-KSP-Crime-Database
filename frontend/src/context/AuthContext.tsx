import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../services/tokenStorage";
import type { LoginCredentials, RegistrationPayload, User, UserRole } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (payload: RegistrationPayload) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const restoreSession = async () => {
      if (!tokenStorage.getAccessToken()) { setIsLoading(false); return; }
      try { const currentUser = await authService.getCurrentUser(); tokenStorage.saveUser(currentUser); setUser(currentUser); }
      catch { tokenStorage.clear(); setUser(null); }
      finally { setIsLoading(false); }
    };
    void restoreSession();
    const expire = () => setUser(null);
    window.addEventListener("ksp-auth-expired", expire);
    return () => window.removeEventListener("ksp-auth-expired", expire);
  }, []);
  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await authService.login(credentials); tokenStorage.save(session); setUser(session.user); return session.user;
  }, []);
  const register = useCallback((payload: RegistrationPayload) => authService.register(payload), []);
  const logout = useCallback(async () => { await authService.logout(); setUser(null); }, []);
  const value = useMemo(() => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout, hasRole: (roles: UserRole[]) => !!user && roles.includes(user.role) }), [user, isLoading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
