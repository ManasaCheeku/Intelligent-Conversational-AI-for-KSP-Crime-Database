import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages (Placeholder imports - adjust paths according to your structure)
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AIAssistant from '../pages/AIAssistant';
import CrimeAnalytics from '../pages/CrimeAnalytics';
import CrimeMap from '../pages/CrimeMap';
import NetworkAnalysis from '../pages/NetworkAnalysis';
import OffenderProfiling from '../pages/OffenderProfiling';
import InvestigatorSupport from '../pages/InvestigatorSupport';
import FinancialCrime from '../pages/FinancialCrime';
import CrimeForecast from '../pages/CrimeForecast';
import ExplainableAI from '../pages/ExplainableAI';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Mock Auth Hook (Replace with your actual Auth Context hook, e.g., useAuth())
const useAuth = () => {
  // Example return: { isAuthenticated: true, user: { role: 'investigator' } }
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    isAuthenticated: !!token,
    user: user,
  };
};

/**
 * ProtectedRoute Component
 * Restricts access to authenticated users.
 * Optionally restricts access to specific user roles.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect authenticated but unauthorized users to dashboard or unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root Route Redirect */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* General Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Standard Analyst/Investigator Protected Routes */}
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator', 'analyst']}>
            <AIAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crime-analytics"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator', 'analyst']}>
            <CrimeAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crime-map"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator', 'analyst']}>
            <CrimeMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crime-forecast"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator', 'analyst']}>
            <CrimeForecast />
          </ProtectedRoute>
        }
      />

      {/* Advanced Specialized Investigator Protected Routes */}
      <Route
        path="/network-analysis"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator']}>
            <NetworkAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/offender-profiling"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator']}>
            <OffenderProfiling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investigator-support"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator']}>
            <InvestigatorSupport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-crime"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator']}>
            <FinancialCrime />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explainable-ai"
        element={
          <ProtectedRoute allowedRoles={['admin', 'investigator']}>
            <ExplainableAI />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;