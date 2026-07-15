import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BiFilterAlt, 
  BiCalendar, 
  BiMap, 
  BiTrendingUp, 
  BiPieChartAlt2, 
  BiTimeFive, 
  BiStats, 
  BiDownload, 
  BiRefresh 
} from 'react-icons/bi';

// ============================================================================
// STATIC ANALYTICAL DATASETS (Mocked for Karnataka Jurisdiction)
// ============================================================================
const CRIME_TRENDS_DATA = [
  { month: 'Jan', Violent: 120, Property: 240, Financial: 95, Cyber: 150 },
  { month: 'Feb', Violent: 115, Property: 220, Financial: 110, Cyber: 180 },
  { month: 'Mar', Violent: 140, Property: 280, Financial: 130, Cyber: 210 },
  { month: 'Apr', Violent: 135, Property: 265, Financial: 125, Cyber: 245 },
  { month: 'May', Violent: 160, Property: 310, Financial: 145, Cyber: 290 },
  { month: 'Jun', Violent: 155, Property: 295, Financial: 160, Cyber: 320 },
  { month: 'Jul', Violent: 175, Property: 340, Financial: 185, Cyber: 380 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Cyber Crime', value: 35, color: '#2563eb' },
  { name: 'Property Offenses', value: 25, color: '#3b82f6' },
  { name: 'Financial Fraud', value: 20, color: '#60a5fa' },
  { name: 'Violent Crimes', value: 15, color: '#f59e0b' },
  { name: 'Narcotics & Others', value: 5, color: '#ef4444' }
];

const TEMPORAL_PATTERNS = [
  { interval: '00:00 - 04:00', load: 45 },
  { interval: '04:00 - 08:00', load: 20 },
  { interval: '08:00 - 12:00', load: 75 },
  { interval: '12:00 - 16:00', load: 90 },
  { interval: '16:00 - 20:00', load: 110 },
  { interval: '20:00 - 00:00', load: 135 }
];

const HOTSPOT_METRICS = [
  { district: 'Bengaluru Core', criticalHotspots: 14, responseTimeMin: 7.2, riskIndex: 9.2 },
  { district: 'Mysuru Urban', criticalHotspots: 5, responseTimeMin: 9.5, riskIndex: 6.4 },
  { district: 'Mangaluru Port Sector', criticalHotspots: 8, responseTimeMin: 8.1, riskIndex: 7.8 },
  { district: 'Hubballi-Dharwad', criticalHotspots: 6, responseTimeMin: 11.2, riskIndex: 7.1 },
  { district: 'Belagavi Division', criticalHotspots: 3, responseTimeMin: 12.8, riskIndex: 5.2 }
];

const DISTRICT_OPTIONS = [
  "All Jurisdictions",
  "Bengaluru City",
  "Mysuru District",
  "Mangaluru Division",
  "Belagavi Zone",
  "Kalaburagi Division"
];

export default function CrimeAnalytics() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Jurisdictions');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-07-15');

  const handleExportData = () => {
    alert("Exporting secure CSV operational schema containing selected analytical parameters.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:pl-64 pt-16">
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* Dynamic Parameter Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <BiFilterAlt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Triage Filters</h3>
              <p className="text-[10px] text-slate-400">Configure parameters for active rendering workspace</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* District Selector Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <BiMap className="text-slate-400 text-sm" />
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                {DISTRICT_OPTIONS.map((dist, idx) => (
                  <option key={idx} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Date Range Start Input */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs font-mono font-medium text-slate-700 outline-none"
              />
            </div>

            <span className="text-slate-400 text-xs font-mono font-medium">TO</span>

            {/* Date Range End Input */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs font-mono font-medium text-slate-700 outline-none"
              />
            </div>

            {/* Export and Refresh Utilities */}
            <div className="flex gap-1.5 pl-2 border-l border-slate-200">
              <button 
                onClick={handleExportData}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Export Selected Data"
              >
                <BiDownload className="text-sm" />
              </button>
              <button 
                onClick={() => { setSelectedDistrict('All Jurisdictions'); setStartDate('2026-01-01'); }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Reset Filters"
              >
                <BiRefresh className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Data Row: Trend Area Chart and Category Pie Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Crime Trend Charts Container */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BiTrendingUp className="text-blue-600 text-lg" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Multi-Vector Incident Timeline Trends</h3>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                MONTH-OVER-MONTH VIEW
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CRIME_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontClassName="font-mono" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Cyber" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCyber)" />
                  <Area type="monotone" dataKey="Property" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorProperty)" />
                  <Area type="monotone" dataKey="Financial" stroke="#60a5fa" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="Violent" stroke="#f59e0b" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crime Category Distribution (Pie Chart) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiPieChartAlt2 className="text-blue-600 text-lg" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Category Distribution Density</h3>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="block text-xl font-bold font-mono text-slate-800">100%</span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Total Classified</span>
              </div>
            </div>

            {/* Legend Labels Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm block shrink-0" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-600 truncate">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Secondary Data Row: Time Series load and Hotspot table list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Hour of Day Temporal Load Curve */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiTimeFive className="text-blue-600 text-lg" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Hourly Temporal Activity Load</h3>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TEMPORAL_PATTERNS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="interval" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="load" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {TEMPORAL_PATTERNS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.load > 100 ? '#ef4444' : '#2563eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hotspot Statistics Table Index */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BiStats className="text-blue-600 text-lg" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Sub-Jurisdictional Hotspot Metrics</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">NODE SYNC: ACTIVE</span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono font-semibold">
                    <th className="p-3">JURISDICTION ZONE</th>
                    <th className="p-3 text-center">ACTIVE CLUSTERS</th>
                    <th className="p-3 text-center">RESPONSE MEDIAN</th>
                    <th className="p-3 text-right">RISK FACTOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {HOTSPOT_METRICS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-700">{row.district}</td>
                      <td className="p-3 text-center text-slate-500">{row.criticalHotspots} Sector Nodes</td>
                      <td className="p-3 text-center text-slate-500">{row.responseTimeMin} mins</td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold border ${
                          row.riskIndex >= 8.0 ? 'bg-red-50 text-red-700 border-red-200' :
                          row.riskIndex >= 6.0 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {row.riskIndex} / 10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}