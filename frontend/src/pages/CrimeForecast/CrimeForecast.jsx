import React, { useState } from 'react';
import {
    TrendingUp,
    AlertTriangle,
    Map,
    Calendar,
    Cpu,
    ShieldAlert,
    BarChart3,
    Zap,
    Layers,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Sliders,
    Search,
    Info,
    Clock
} from 'lucide-react';

// Mock high-fidelity forecast data
const initialForecastSummary = {
    overallRiskTrend: "Escalating",
    globalConfidenceScore: 89,
    activeAlertsCount: 4,
    lastModelRun: "2026-07-15 18:00 UTC",
    primaryDriver: "Seasonal transition & upcoming city-wide outdoor festival series",
};

const earlyWarningAlerts = [
    {
        id: 1,
        severity: "Critical",
        type: "Surge Warning: Commercial Burglary",
        location: "Downtown Retail Sector (Zone 3)",
        timeframe: "Next 48 Hours (Optimal window: 01:00 - 04:00)",
        confidence: 93,
        trigger: "Telemetry shows sudden drop in localized night-patrol coverage combined with historically vulnerable security architectures during regional holidays."
    },
    {
        id: 2,
        severity: "High",
        type: "Opportunistic Vehicle Theft Cluster",
        location: "Westside Transit Hubs & Overflow Lots",
        timeframe: "July 17 - July 20",
        confidence: 86,
        trigger: "Algorithmic correlation with a 15% surge in multi-day parking occupancy rates due to transit schedule modifications."
    },
    {
        id: 3,
        severity: "Medium",
        type: "Street-Level Disturbance Spike",
        location: "Arts District / Entertainment Corridor",
        timeframe: "This Weekend (Night shift)",
        confidence: 74,
        trigger: "Micro-climate model forecasts temperatures exceeding 32°C (90°F) coupled with high weekend venue capacity metrics."
    }
];

const districtForecasts = [
    { id: "D1", name: "Downtown Core", riskLevel: "High", riskScore: 88, predictedTrend: "Upward", primaryThreat: "Larceny / Commercial Theft", confidence: 91, incidentVolumeIndex: 124 },
    { id: "D2", name: "Industrial Harbor", riskLevel: "Medium", riskScore: 54, predictedTrend: "Stable", primaryThreat: "Cargo / Fuel Pilferage", confidence: 82, incidentVolumeIndex: 68 },
    { id: "D3", name: "Westside Suburbs", riskLevel: "Low", riskScore: 29, predictedTrend: "Downward", primaryThreat: "Residential Trespassing", confidence: 79, incidentVolumeIndex: 31 },
    { id: "D4", name: "Uptown Corridor", riskLevel: "High", riskScore: 76, predictedTrend: "Upward", primaryThreat: "Automobile Theft", confidence: 87, incidentVolumeIndex: 94 },
    { id: "D5", name: "Arts & Entertainment District", riskLevel: "Medium", riskScore: 61, predictedTrend: "Upward", primaryThreat: "Nuisance / Disturbance", confidence: 85, incidentVolumeIndex: 102 }
];

const seasonalTrends = [
    { season: "Q1 - Winter", trend: "Consistent baseline", primaryIncidents: "Residential Burglary (Indoor shifts)", variance: "-12% vs annual average" },
    { season: "Q2 - Spring", trend: "Gradual escalation", primaryIncidents: "Vehicle Theft & Vandalism", variance: "+4% vs annual average" },
    { season: "Q3 - Summer (Current)", trend: "Peak volumetric velocity", primaryIncidents: "Street Disturbance, Larceny, Night Intrusion", variance: "+22% vs annual average" },
    { season: "Q4 - Autumn", trend: "Sharp normalization", primaryIncidents: "Commercial Cargo/Shipping Diversions", variance: "-2% vs annual average" }
];

export default function CrimeForecast() {
    const [selectedDistrict, setSelectedDistrict] = useState(districtForecasts[0]);
    const [forecastHorizon, setForecastHorizon] = useState("7d"); // 24h, 7d, 30d
    const [searchQuery, setSearchQuery] = useState("");

    const getRiskColor = (score) => {
        if (score >= 75) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500" };
        if (score >= 45) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-500" };
        return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" };
    };

    const currentRiskColors = getRiskColor(selectedDistrict.riskScore);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-indigo-500/30">

            {/* Top Professional Header */}
            <header className="mb-8 border-b border-slate-800 pb-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                        <Cpu className="w-3.5 h-3.5" /> AI Predictive Policing Division
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Strategic Crime & Hotspot Forecast</h1>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Operational Engine Model Last Compiled: <span className="text-slate-200 font-mono">{initialForecastSummary.lastModelRun}</span></span>
                    </p>
                </div>

                {/* Global Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex gap-1">
                        <button
                            onClick={() => setForecastHorizon("24h")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${forecastHorizon === '24h' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            24-Hour Pulse
                        </button>
                        <button
                            onClick={() => setForecastHorizon("7d")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${forecastHorizon === '7d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            7-Day Horizon
                        </button>
                        <button
                            onClick={() => setForecastHorizon("30d")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${forecastHorizon === '30d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            30-Day Trend
                        </button>
                    </div>
                </div>
            </header>

            {/* Primary KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div>
                        <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">Active Model Drift</span>
                        <span className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                            {initialForecastSummary.overallRiskTrend}
                            <ArrowUpRight className="w-5 h-5 text-red-500" />
                        </span>
                    </div>
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div>
                        <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">Composite Confidence</span>
                        <span className="text-xl font-bold text-indigo-400 font-mono tracking-tight">{initialForecastSummary.globalConfidenceScore}%</span>
                    </div>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                        <Cpu className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div>
                        <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">Early Warning Alerts</span>
                        <span className="text-xl font-bold text-red-400 font-mono tracking-tight">{initialForecastSummary.activeAlertsCount} Sectors</span>
                    </div>
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div>
                        <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">Dominant Climate Vector</span>
                        <span className="text-sm font-bold text-slate-200 truncate block max-w-[180px]">{initialForecastSummary.primaryDriver}</span>
                    </div>
                    <div className="p-3 bg-slate-950 text-slate-400 rounded-lg border border-slate-850">
                        <Sliders className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Grid Architecture */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT TWO COLUMNS: EARLY WARNING ALERTS & DISTRICT FORECAST TABLES */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Component: Early Warning Alerts */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                                <h2 className="text-base font-bold text-white tracking-tight">Tactical Early Warning Alerts</h2>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">Predictive Horizon: {forecastHorizon === '24h' ? '24 Hours' : forecastHorizon === '7d' ? '7 Days' : '30 Days'}</span>
                        </div>

                        <div className="space-y-4">
                            {earlyWarningAlerts.map((alert) => (
                                <div key={alert.id} className="bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors p-4 rounded-lg space-y-3 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    alert.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-slate-900 text-slate-400 border-slate-800'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                            <h3 className="text-sm font-bold text-white">{alert.type}</h3>
                                        </div>
                                        <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/10">
                                            {alert.confidence}% Confidence
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        <span className="text-slate-500">Trigger:</span> {alert.trigger}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 border-t border-slate-900 pt-2 font-mono">
                                        <span>Target Sector: <span className="text-slate-300 font-sans font-medium">{alert.location}</span></span>
                                        <span className="text-slate-800">•</span>
                                        <span>Threat Timeframe: <span className="text-slate-300 font-sans font-medium">{alert.timeframe}</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Component: District Forecast Table */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Regional District Forecast</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Tactical forecasting matrix broken down by active surveillance zones.</p>
                            </div>

                            {/* Simple filter/search */}
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Filter district metrics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-850 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pl-2">District / Zone</th>
                                        <th className="pb-3">Forecasted Risk</th>
                                        <th className="pb-3">Trend</th>
                                        <th className="pb-3">Primary Expected Vector</th>
                                        <th className="pb-3 text-right pr-2">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-850/40 text-xs">
                                    {districtForecasts
                                        .filter(dist => dist.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((dist) => {
                                            const riskColor = getRiskColor(dist.riskScore);
                                            return (
                                                <tr
                                                    key={dist.id}
                                                    onClick={() => setSelectedDistrict(dist)}
                                                    className={`hover:bg-slate-950/60 cursor-pointer transition-colors group ${selectedDistrict.id === dist.id ? 'bg-slate-950' : ''
                                                        }`}
                                                >
                                                    <td className="py-3.5 pl-2 font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                                        {dist.name} <span className="text-[10px] text-slate-600 font-mono ml-1 font-normal">{dist.id}</span>
                                                    </td>
                                                    <td className="py-3.5">
                                                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded ${riskColor.bg} ${riskColor.text}`}>
                                                            {dist.riskLevel} ({dist.riskScore})
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 font-medium">
                                                        {dist.predictedTrend === "Upward" ? (
                                                            <span className="text-red-400 flex items-center gap-1 font-mono"><ArrowUpRight className="w-3.5 h-3.5" /> Surge</span>
                                                        ) : dist.predictedTrend === "Downward" ? (
                                                            <span className="text-emerald-400 flex items-center gap-1 font-mono"><ArrowDownRight className="w-3.5 h-3.5" /> Decline</span>
                                                        ) : (
                                                            <span className="text-slate-400 flex items-center gap-1 font-mono">Stable</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 text-slate-300 font-medium">{dist.primaryThreat}</td>
                                                    <td className="py-3.5 text-right pr-2 font-mono font-bold text-slate-400">{dist.confidence}%</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>

                {/* RIGHT COLUMN: HOTSPOT HIGHLIGHTS & SEASONAL PATTERNS */}
                <div className="xl:col-span-1 space-y-6">

                    {/* Component: Selected District Deep Dive & Confidence */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Map className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Hotspot Analysis</h2>
                            </div>
                            <span className="text-xs font-bold text-indigo-400 font-mono">{selectedDistrict.id}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Currently Analyzing</span>
                                <h3 className="text-xl font-black text-white tracking-tight">{selectedDistrict.name}</h3>
                            </div>

                            {/* Score Display */}
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-slate-500 font-semibold uppercase">Surge Probability Index</span>
                                    <span className={`text-2xl font-black font-mono ${currentRiskColors.text}`}>{selectedDistrict.riskScore}<span className="text-xs text-slate-500 font-normal">/100</span></span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                                    <div className={`h-full rounded-full transition-all duration-500 ${currentRiskColors.bar}`} style={{ width: `${selectedDistrict.riskScore}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-2 border-b border-slate-850">
                                    <span className="text-slate-500">Volume Index</span>
                                    <span className="font-bold text-slate-200">{selectedDistrict.incidentVolumeIndex} Forecasted Incidents</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-850">
                                    <span className="text-slate-500">Primary Vector Threat</span>
                                    <span className="font-bold text-slate-200">{selectedDistrict.primaryThreat}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-slate-500">AI Model Predictability</span>
                                    <span className="font-bold text-indigo-400 font-mono">{selectedDistrict.confidence}% Confidence</span>
                                </div>
                            </div>

                            <div className="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-lg flex gap-2 items-start text-xs text-slate-300">
                                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">
                                    Strategic patrol placement recommended at major corridors in <span className="text-white font-bold">{selectedDistrict.name}</span> to preemptively suppress the projected <span className="text-white font-semibold">{selectedDistrict.primaryThreat}</span> trajectory.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Component: Seasonal Trends */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Macro Seasonal Projections</h2>
                        </div>

                        <div className="space-y-3">
                            {seasonalTrends.map((st, i) => (
                                <div key={i} className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-200">{st.season}</span>
                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${st.variance.startsWith("+") ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {st.variance}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium">Pattern: <span className="text-slate-300">{st.trend}</span></p>
                                    <p className="text-[11px] text-slate-500">Dominant: {st.primaryIncidents}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
}