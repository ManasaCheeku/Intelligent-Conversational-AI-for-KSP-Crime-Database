import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext hook

/**
 * RoleRoute Component (React Router DOM v7 compatible)
 * restructures route access based on user authorization roles.
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles permitted to access this route
 */
const RoleRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show a Tailwind CSS loading spinner while verifying auth/role status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to /login and save the intended location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but the user's role is not explicitly authorized
  const hasRequiredRole = allowedRoles.includes(user?.role);
  if (allowedRoles.length > 0 && !hasRequiredRole) {
    // Redirect to dashboard with unauthorized state flag so dashboard can display a warning
    return <Navigate to="/dashboard" state={{ unauthorizedAttempt: true }} replace />;
  }

  // If authorized, render the nested child elements
  return <Outlet />;
};

export default RoleRoute;