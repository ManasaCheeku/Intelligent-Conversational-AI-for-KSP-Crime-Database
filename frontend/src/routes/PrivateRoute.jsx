import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext hook

/**
 * PrivateRoute Component (React Router DOM v7 compatible)
 * Protects routes requiring authentication and handles JWT token verification/expiration.
 */
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show a Tailwind CSS loading spinner while verifying authentication status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to /login preserving the requested URL location in state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render nested route elements
  return <Outlet />;
};

export default PrivateRoute;