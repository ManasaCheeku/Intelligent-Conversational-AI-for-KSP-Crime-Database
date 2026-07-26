import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { LandingPage } from '../pages/LandingPage';
import Footer from '../components/layout/Footer';
import KarnatakaHeatmap from '../components/ui/KarnatakaHeatmap';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import { UnauthorizedPage, NotFoundPage } from '../pages/SimplePages';

const PageLayout: React.FC = () => {
  const location = useLocation();
  const isFullPage = ['/heatmap', '/login', '/forgot-password', '/reset-password'].some(path => location.pathname.startsWith(path));

  return (
    <div className="bg-gray-900 text-white">
      {!isFullPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/heatmap" element={<KarnatakaHeatmap />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isFullPage && <Footer />}
    </div>
  );
};

export const AppRoutes: React.FC = () => (
  <Router>
    <PageLayout />
  </Router>
);