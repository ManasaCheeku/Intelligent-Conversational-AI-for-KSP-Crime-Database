import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { 
  CrimeStatsGrid, 
  HeatmapPreviewCard, 
  CriminalNetworkCard, 
  InvestigationDossierCard, 
  CrimeTrendChartContainer, 
  RiskScoreCard, 
  AIChatWindow, 
  SystemAuditLogCard 
} from './DashboardComponents'; // Assuming sub-components are exported from this sibling file

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <Navbar 
        userRole="Senior Superintendent" 
        officerName="Dr. Sharanappa, IPS" 
        district="CID Bengaluru" 
      />
      
      {/* Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Execution Workspace */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
          
          {/* Dashboard Operational Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                KSP Crime Control Command
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                State Intelligence Workspace
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm self-start sm:self-center">
              SECURE SESSION AUTH: <span className="text-blue-600 font-bold">SECRET//NOFORN</span>
            </div>
          </div>

          {/* Tab Conditional Rendering Strategy */}
          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* Row 1: Key Performance Statistical Cards */}
              <CrimeStatsGrid />

              {/* Row 2: Live Heatmap Density & Social Network Mapping */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <HeatmapPreviewCard />
                </div>
                <div>
                  <CriminalNetworkCard />
                </div>
              </div>

              {/* Row 3: Active Dossier Management System & Risk Profiler */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <InvestigationDossierCard />
                </div>
                <div>
                  <RiskScoreCard targetName="Target Node-82 (Bengaluru East)" baseScore={87} />
                </div>
              </div>

              {/* Row 4: Forensic Financial and Demographic Trends */}
              <CrimeTrendChartContainer />

              {/* Row 5: AI Assist Cognitive Console & Immutable Compliance Ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <AIChatWindow />
                </div>
                <div className="lg:col-span-2">
                  <SystemAuditLogCard />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sub-module Under Construction</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                The "{activeTab.toUpperCase()}" workspace module is currently synced with CID headquarters. Secure data schemas are being loaded.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}