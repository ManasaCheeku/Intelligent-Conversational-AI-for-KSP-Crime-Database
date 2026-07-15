import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

// Create the Context
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps your app and makes auth state
 * available to any child component that calls useAuth().
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize state when user logs out or session expires from Axios interceptors
  const handleSignOutCleanup = useCallback(() => {
    setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initialize & verify local persistent session on mount
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Attempt to populate user profile from local cache first for instant load
          const cachedUser = authService.getCurrentUser();
          if (cachedUser) {
            setUser(cachedUser);
          }

          // Fetch fresh database state in background to sync roles/status
          const freshUser = await authService.refreshUserProfile();
          setUser(freshUser);
        }
      } catch (error) {
        console.error("Session verification failed. Invalid or expired token:", error);
        // Clean up invalid session
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to custom interceptor events from api.js & authService.js
    window.addEventListener('ksp-auth-session-expired', handleSignOutCleanup);
    window.addEventListener('ksp-auth-logout', handleSignOutCleanup);

    return () => {
      window.removeEventListener('ksp-auth-session-expired', handleSignOutCleanup);
      window.removeEventListener('ksp-auth-logout', handleSignOutCleanup);
    };
  }, [handleSignOutCleanup]);

  /**
   * Performs investigator authentication
   */
  const login = async (badgeNumber, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(badgeNumber, password);
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers global token blacklisting and storage cleanup
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  /**
   * Helper utility to evaluate hierarchical permissions
   * @param {string[] | string} requiredRoles 
   */
  const hasRole = useCallback((requiredRoles) => {
    if (!user || !user.role) return false;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role);
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume the Auth Context easily
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Route protection wrapper incorporating state protection and Role-Based Access Control (RBAC).
 * 
 * @param {React.ReactNode} children - Component to render if checks pass
 * @param {string[]} [allowedRoles] - Optional list of authorized roles allowed to view the route
 * @param {string} [fallbackPath="/login"] - Redirect destination if unauthenticated
 */
export function ProtectedRoute({ children, allowedRoles, fallbackPath = "/login" }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in page if no active authenticated session
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if role requirements are met (RBAC)
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}