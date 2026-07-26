import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Technology } from '../components/Technology';
import { About } from '../components/About';
import { Footer } from '../components/Footer';
import KarnatakaHeatmap from '../pages/KarnatakaHeatmap';
import LoginPage from '../pages/LoginPage';

const PageLayout: React.FC = () => {
  const location = useLocation();
  const isFullPage = location.pathname === '/heatmap' || location.pathname === '/login';

  return (
    <div className="bg-gray-900 text-white">
      {!isFullPage && <Navbar />}
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Features />
            <Technology />
            <About />
          </main>
        } />
        <Route path="/heatmap" element={<KarnatakaHeatmap />} />
        <Route path="/login" element={<LoginPage />} />
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