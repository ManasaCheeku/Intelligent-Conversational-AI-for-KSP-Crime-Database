import React, { useState } from 'react';
import {
  BiBell,
  BiChevronDown,
  BiGlobe,
  BiLogOut,
  BiShieldQuarter,
  BiUserCircle,
  BiCog,
  BiRadioCircleMarked
} from 'react-icons/bi';

export default function Navbar({
  userRole = "Senior Superintendent",
  officerName = "Dr. Sharanappa, IPS",
  district = "CID Bengaluru"
}) {
  const [lang, setLang] = useState('EN'); // EN or KN (Kannada)
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Sample real-time notifications for active operational triage
  const notifications = [
    { id: 1, message: "New AI Threat Analysis Flagged - Mysore Sector", time: "2m ago", unread: true },
    { id: 2, message: "Compliance Audit Signature Required", time: "1h ago", unread: false },
    { id: 3, message: "System node sync: Node 08-CID online", time: "4h ago", unread: false }
  ];

  const toggleLanguage = () => {
    setLang(prev => prev === 'EN' ? 'KN' : 'EN');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 shadow-md select-none">

      {/* Brand Section */}
      <div className="flex items-center gap-3">
        {/* KSP Insignia Placeholder/Shield Vector */}
        <div className="bg-blue-600 p-2 rounded text-white flex items-center justify-center shadow-md shadow-blue-900/40">
          <BiShieldQuarter className="h-5 w-5 text-amber-300 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm sm:text-md font-bold tracking-wide flex items-center gap-2">
            <span>KSP INTELLICRIME AI</span>
            <span className="hidden sm:inline-block bg-red-900 text-red-100 text-[9px] font-bold px-2 py-0.5 rounded border border-red-700 uppercase tracking-widest">
              SECURE Node-CID
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight">
            {lang === 'EN'
              ? 'Karnataka State Police // Crime Intelligence Division'
              : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ // ಅಪರಾಧ ಗುಪ್ತದಳ ವಿಭಾಗ'}
          </p>
        </div>
      </div>

      {/* Control Actions & User System */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Language Switch Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs font-semibold font-mono text-slate-300 hover:text-white"
          title={lang === 'EN' ? "Switch to Kannada" : "Switch to English"}
        >
          <BiGlobe className="text-blue-400 text-sm" />
          <span>{lang === 'EN' ? 'ಕನ್ನಡ' : 'ENG'}</span>
        </button>

        {/* System Monitoring Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-950/80 rounded border border-slate-800 font-mono text-[10px] text-slate-400">
          <BiRadioCircleMarked className="text-emerald-500 animate-ping text-sm" />
          <span>SYS STATUS: COMPLIANT</span>
        </div>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className={`p-2 rounded-full relative transition-colors ${notifOpen ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BiBell className="h-5 w-5" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-slate-900"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-1.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span className="font-bold">SYSTEM BROADCASTS</span>
                <span className="text-[10px] font-mono text-blue-400">SECURE CHANNEL</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-900/60 hover:bg-slate-900/60 cursor-pointer transition-colors ${n.unread ? 'bg-blue-950/20' : ''}`}>
                    <p className="text-xs text-slate-200">{n.message}</p>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Workspace Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-blue-500 flex items-center justify-center text-xs font-bold font-mono text-blue-300">
              IP
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold leading-none text-slate-200">{officerName}</p>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">{userRole}</span>
            </div>
            <BiChevronDown className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-lg shadow-xl py-1.5 z-50 font-sans">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-slate-200">{officerName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{district}</p>
              </div>

              <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
                <BiUserCircle className="text-base text-slate-500" />
                <span>Officer Profile Dossier</span>
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
                <BiCog className="text-base text-slate-500" />
                <span>Platform Settings</span>
              </button>

              <div className="border-t border-slate-800 my-1"></div>

              <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors">
                <BiLogOut className="text-base" />
                <span>Secure Session Terminate</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}