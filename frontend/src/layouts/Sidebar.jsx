import React from 'react';
import {
  BiGridAlt,
  BiMessageSquareDetail,
  BiBarChartSquare,
  BiGitBranch,
  BiMapAlt,
  BiUserPin,
  BiBriefcase,
  BiCoinStack,
  BiLineChart,
  BiGlasses,
  BiShieldQuarter,
  BiCheckShield,
  BiCog,
  BiChevronLeft,
  BiInfoCircle
} from 'react-icons/bi';

export default function Sidebar({
  activeTab = 'dashboard',
  setActiveTab,
  sidebarOpen = true,
  setSidebarOpen
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BiGridAlt },
    { id: 'chat-ai', label: 'Conversational AI', icon: BiMessageSquareDetail, badge: 'AI' },
    { id: 'analytics', label: 'Crime Analytics', icon: BiBarChartSquare },
    { id: 'network', label: 'Criminal Network', icon: BiGitBranch },
    { id: 'heatmap', label: 'Crime Heatmap', icon: BiMapAlt },
    { id: 'profiling', label: 'Offender Profiling', icon: BiUserPin },
    { id: 'investigator', label: 'Investigator Support', icon: BiBriefcase },
    { id: 'financial', label: 'Financial Crime', icon: BiCoinStack },
    { id: 'forecast', label: 'Crime Forecast', icon: BiLineChart },
    { id: 'xai', label: 'Explainable AI', icon: BiGlasses },
    { id: 'audit', label: 'Audit Logs', icon: BiCheckShield },
    { id: 'settings', label: 'Settings', icon: BiCog }
  ];

  return (
    <aside className={`bg-slate-950 border-r border-slate-900 text-slate-400 fixed top-16 bottom-0 left-0 z-40 transition-all duration-300 flex flex-col justify-between p-4 ${sidebarOpen ? 'w-64' : 'w-20'
      }`}>

      {/* Top Menu Section */}
      <div className="space-y-4 overflow-y-auto no-scrollbar flex-grow">

        {/* Section Heading */}
        <div className="flex items-center justify-between px-2">
          {sidebarOpen && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              INTELLIGENCE ENGINE
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all ml-auto"
            title={sidebarOpen ? "Collapse Menu" : "Expand Menu"}
          >
            <BiChevronLeft className={`h-4 w-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-md text-xs font-medium transition-all group ${sidebarOpen ? 'px-3 py-2.5 gap-3' : 'p-3 justify-center'
                  } ${isActive
                    ? 'bg-blue-950/80 border-l-2 border-blue-500 text-blue-200 font-semibold shadow-inner'
                    : 'hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {sidebarOpen && (
                  <span className="truncate flex-grow text-left">{item.label}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="bg-blue-900/80 text-blue-200 text-[9px] font-bold px-1.5 py-0.2 rounded border border-blue-700 tracking-wider font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compliance Box */}
      {sidebarOpen ? (
        <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-900/80 font-mono text-[11px] mt-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
            <BiShieldQuarter className="text-amber-500 text-xs shrink-0" />
            <span>KSP SECURITY CLEARANCE</span>
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px]">
            <span className="text-slate-500">LEVEL:</span>
            <span className="text-blue-400 font-bold font-mono">LEVEL-4 (CID)</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-1.5">
            <div className="bg-blue-600 h-1 rounded-full w-4/5"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-slate-600 hover:text-slate-400 transition-colors p-2 cursor-help" title="Security Status Level 4 Checked">
          <BiShieldQuarter className="h-5 w-5 text-amber-500 animate-pulse" />
        </div>
      )}
    </aside>
  );
}