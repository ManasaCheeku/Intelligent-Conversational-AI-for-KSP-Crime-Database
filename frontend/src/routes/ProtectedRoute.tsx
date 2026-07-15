import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="screen-loader">Verifying your secure session…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
