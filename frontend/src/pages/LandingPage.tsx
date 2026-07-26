import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { DashboardPreview } from '../components/landing/DashboardPreview';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-slate-950">
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        {/* Other sections like Technology, About, Footer can be added here */}
      </main>
    </div>
  );
}
