import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { DashboardPreview } from '../components/landing/DashboardPreview';

export function LandingPage() {
  return (
    <div className="bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        {/* Other sections like Technology, About, Footer can be added here */}
      </main>
    </div>
  );
}
