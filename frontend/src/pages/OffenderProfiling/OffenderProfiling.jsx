import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Users, 
  FileText, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  Share2, 
  Activity,
  Calendar,
  MapPin,
  Flame
} from 'lucide-react';

// Mock Data for a Sample Offender Profile
const initialOffenderData = {
  id: "CR-2026-8849",
  firstName: "Marcus",
  lastName: "Vance",
  alias: "Viper",
  dob: "1988-11-14",
  age: 37,
  status: "Active / Under Surveillance",
  riskScore: 84, // Out of 100
  riskLevel: "High",
  repeatOffender: true,
  totalArrests: 14,
  convictions: 9,
  primaryClassification: "Organized Property Crime & Grand Theft",
  
  caseSummary: "Subject operates primarily as a high-tier coordinator for localized luxury vehicle theft rings and commercial burglaries. Exhibits advanced knowledge of security bypass techniques, operational counter-surveillance, and rapid fencing networks. Typically acts within a 48-hour planning window post-reconnaissance.",
  
  behaviorAnalysis: {
    modusOperandi: "Utilizes signal-jamming equipment for high-end electronic ignition systems. Targets commercial hubs during secondary shifts (02:00 - 04:30 AM). Rarely carries firearms but consistently utilizes high-horsepower getaway vehicles.",
    escalationPattern: "Transitioned from opportunistic petty theft (2018) to structured syndication (2022). Recent data points to increased financial volatility, driving higher frequency operations.",
    psychologicalTraits: ["Methodical planner", "Low impulse control under financial stress", "Highly adaptive to perimeter changes"],
    threatTriggers: "Increased pressure from active debts, disruption of established fencing routes."
  },

  crimeTimeline: [
    { id: 1, date: "2026-02-12", incident: "Grand Theft Auto (Attempted)", location: "Downtown District", status: "Bail / Awaiting Trial", severity: "High" },
    { id: 2, date: "2025-09-05", incident: "Commercial Burglary", location: "Industrial Park East", status: "Convicted / Paroled", severity: "High" },
    { id: 3, date: "2024-11-18", incident: "Possession of Burglary Tools", location: "North Suburbs", status: "Convicted", severity: "Medium" },
    { id: 4, date: "2023-05-30", incident: "Grand Theft Auto", location: "Financial Center", status: "Convicted", severity: "High" },
    { id: 5, date: "2021-08-14", incident: "Receiving Stolen Property", location: "Metro Area", status: "Dismissed", severity: "Medium" }
  ],

  aiRecommendations: [
    { id: 1, type: "Surveillance Strategy", text: "Increase automated plate reader queries along the Western Corridor route during early morning hours.", priority: "Critical" },
    { id: 2, type: "Interrogation Tactic", text: "Leverage recent structural disruption of the 'Kincaid network' to induce cooperation; subject shows high self-preservation markers.", priority: "High" },
    { id: 3, type: "Risk Mitigation", text: "Flag related commercial storage hubs within a 5-mile radius of current known address for proactive patrol visibility.", priority: "Medium" }
  ],

  similarOffenders: [
    { id: "CR-2024-1102", name: "Julian Kincaid", matchPercentage: 88, status: "Incarcerated", relationship: "Former Associate" },
    { id: "CR-2025-9931", name: "Elena Rostova", matchPercentage: 74, status: "Active", relationship: "Shared Fence Network" },
    { id: "CR-2026-0412", name: "Darnell Owens", matchPercentage: 69, status: "Parole", relationship: "Similar MO / Toolkit" }
  ]
};

export default function OffenderProfiling() {
  const [offender, setOffender] = useState(initialOffenderData);
  const [searchQuery, setSearchQuery] = useState("");

  // Simple color coordinator for Risk Levels
  const getRiskColor = (score) => {
    if (score >= 75) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500" };
    if (score >= 40) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-500" };
    return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" };
  };

  const colors = getRiskColor(offender.riskScore);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Top Navigation / Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Shield className="w-3.5 h-3.5" /> Intelligence & Profiling Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Offender Tactical Dossier</h1>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search offender database by ID, name, alias..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-800">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Identity & Quick Stats */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Photo Placeholder Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="relative aspect-[4/5] bg-slate-950 flex flex-col items-center justify-center p-6 border-b border-slate-800 group">
              {/* Monochromatic tactical photo placeholder grid */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              
              <div className="w-32 h-32 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500 relative z-10 shadow-inner group-hover:border-indigo-500 transition-colors">
                <User className="w-16 h-16 stroke-[1.25]" />
              </div>
              
              <div className="mt-4 text-center relative z-10">
                <h2 className="text-xl font-bold text-white tracking-tight">{offender.firstName} {offender.lastName}</h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">Alias: <span className="text-indigo-400 font-mono">"{offender.alias}"</span></p>
              </div>

              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {offender.id}
                </span>
              </div>
            </div>

            {/* Core Metadata */}
            <div className="p-4 bg-slate-900/50 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">D.O.B / Age</span>
                <span className="font-medium text-slate-200">{offender.dob} ({offender.age})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Status</span>
                <span className="font-medium text-indigo-400">{offender.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classification</span>
                <span className="font-medium text-slate-200 text-right max-w-[160px] truncate">{offender.primaryClassification}</span>
              </div>
            </div>
          </div>

          {/* Repeat Offender Badge & Arrest Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Offense Metric</h3>
              </div>
              {offender.repeatOffender && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
                  <Flame className="w-3 h-3" /> Repeat Offender
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center">
                <span className="text-xs text-slate-500 block mb-0.5">Total Arrests</span>
                <span className="text-2xl font-bold text-white font-mono">{offender.totalArrests}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center">
                <span className="text-xs text-slate-500 block mb-0.5">Convictions</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">{offender.convictions}</span>
              </div>
            </div>
          </div>

          {/* Risk Score Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Recidivism Risk Score</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                {offender.riskLevel}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-white">{offender.riskScore}<span className="text-xs text-slate-500 font-normal">/100</span></span>
                <span className="text-xs text-slate-400">High Aggravation Index</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                  style={{ width: `${offender.riskScore}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE / RIGHT COLUMNS: Deep Behavioral Data & Case Logs */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Case Summary Panel */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-200">Executive Case Summary</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors bg-slate-950 border border-slate-800 rounded-md">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors bg-slate-950 border border-slate-800 rounded-md">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-850 font-medium">
              {offender.caseSummary}
            </p>
          </section>

          {/* Behavioral Analysis & AI Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Behavioral Profile */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-slate-200">Behavioral Analysis & MO</h3>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Modus Operandi</h4>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-850/60 text-xs leading-relaxed">{offender.behaviorAnalysis.modusOperandi}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Escalation Vector</h4>
                    <p className="text-slate-300 text-xs">{offender.behaviorAnalysis.escalationPattern}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Identified Psychological Traits</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {offender.behaviorAnalysis.psychologicalTraits.map((trait, index) => (
                        <span key={index} className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-2 py-1 rounded">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10">
                <span className="font-semibold">Active Operational Triggers:</span>
                <span className="text-right max-w-[200px] truncate">{offender.behaviorAnalysis.threatTriggers}</span>
              </div>
            </section>

            {/* AI Predictive Recommendations */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-200">AI Predictive Recommendations</h3>
              </div>

              <div className="space-y-3">
                {offender.aiRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg flex gap-3 items-start">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${
                      rec.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      rec.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {rec.priority}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-indigo-400 block">{rec.type}</span>
                      <p className="text-xs text-slate-300 leading-normal">{rec.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Crime History Timeline */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-slate-200">Crime History Timeline</h3>
            </div>

            <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6">
              {offender.crimeTimeline.map((crime) => (
                <div key={crime.id} className="relative group">
                  {/* Timeline node node indicator */}
                  <span className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 transition-colors ${
                    crime.severity === 'High' ? 'border-red-500 group-hover:bg-red-500' : 'border-amber-500 group-hover:bg-amber-500'
                  }`} />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 bg-slate-950/40 border border-slate-850/60 hover:border-slate-800 p-3 rounded-lg transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{crime.incident}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-md font-mono">{crime.status}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {crime.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {crime.location}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 self-end sm:self-center hidden sm:block group-hover:text-slate-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Similar Offenders & Network Affiliates */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-slate-200">Behaviorally Similar Offenders & Network</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offender.similarOffenders.map((sim) => (
                <div key={sim.id} className="bg-slate-950 border border-slate-850 hover:border-slate-800 p-4 rounded-lg flex flex-col justify-between group transition-colors">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-500">{sim.id}</span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
                        {sim.matchPercentage}% Match
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{sim.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">Relationship: <span className="text-slate-300 font-medium">{sim.relationship}</span></p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status</span>
                    <span className={`font-semibold ${sim.status === 'Active' ? 'text-red-400' : 'text-slate-400'}`}>{sim.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}