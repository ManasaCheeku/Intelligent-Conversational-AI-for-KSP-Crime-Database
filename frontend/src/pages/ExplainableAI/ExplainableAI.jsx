import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  GitBranch,
  FileText,
  Database,
  Eye,
  Sliders,
  TrendingUp,
  Search,
  HelpCircle,
  ExternalLink,
  Layers,
  Activity
} from 'lucide-react';

// Mock high-fidelity diagnostic data for an AI Threat Classification model
const mockDecisionFlow = {
  id: "XAI-DEC-9942",
  targetModel: "ThreatRiskPredictor-V4.2",
  entityName: "Red-Sector Automated Telemetry Incident",
  timestamp: "2026-07-15 20:45:12 UTC",
  verdict: "High Threat Risk Index",
  confidenceScore: 88,
  
  // Executive reasoning narrative
  reasoningNarrative: "The model flagged this incident primarily due to a cascade of overlapping anomalies: an unauthorized ingress origin (VPN exit node mapped to suspicious commercial infrastructure), occurring during off-peak hours (02:14:00 local time), paired with an immediate rapid modification signature targeting high-value corporate storage directories. Traditional threshold triggers did not fire independently, but the unified vector correlation crossed the 85% high-threat frontier path.",

  // Decision Path - Step-by-Step sequence
  decisionPath: [
    { step: 1, name: "Spatio-Temporal Analysis", details: "Evaluates action timestamps against normal administrative activity clusters.", status: "Passed Threshold", contribution: "+14%" },
    { step: 2, name: "Network Infrastructure Validation", details: "Resolves ingress IP space against dynamic commercial blocklists.", status: "Anomaly Detected", contribution: "+38%" },
    { step: 3, name: "Cryptographic Integrity Probe", details: "Checks session validation and digital security certificates.", status: "Verified / Secure", contribution: "-4%" },
    { step: 4, name: "Action Signature Correlation", details: "Compares file system write/edit behaviors with known malicious patterns.", status: "Critical Match", contribution: "+40%" }
  ],

  // Core feature weights influencing the prediction
  features: [
    { name: "Ingress Anomaly Index", weight: 38, type: "Network", impact: "positive" },
    { name: "File System Write Velocity", weight: 31, type: "Payload Behavior", impact: "positive" },
    { name: "User Account Privilege Level", weight: 19, type: "Identity", impact: "positive" },
    { name: "Cryptographic Certificate Match", weight: -4, type: "Authentication", impact: "negative" },
    { name: "Historical Activity Baseline Delta", weight: 16, type: "Anomaly Pattern", impact: "positive" }
  ],

  // Evidence Sources & References Used by the Model
  evidenceSources: [
    { id: "REF-001", source: "SANS Threat Intelligence Registry", type: "External Feed", reliability: "98%", details: "Active campaign logs detailing malicious infrastructure matching the ingress subnets." },
    { id: "REF-002", source: "Active Directory Audit Logs (Last 90 Days)", type: "Internal Telemetry", reliability: "100%", details: "Baseline metrics establishing standard user operation schedules and directory access limits." },
    { id: "REF-003", source: "Host-Based Intrusion Detection Vectors", type: "Runtime Security", reliability: "92%", details: "Telemetry capturing execution commands similar to known administrative bypass frameworks." }
  ]
};

export default function ExplainableAI() {
  const [activeDecision, setActiveDecision] = useState(mockDecisionFlow);
  const [selectedFeature, setSelectedFeature] = useState(mockDecisionFlow.features[0]);

  // Assist color coordination relative to prediction status
  const getConfidenceLevel = (score) => {
    if (score >= 80) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500" };
    if (score >= 50) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-500" };
    return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" };
  };

  const currentColors = getConfidenceLevel(activeDecision.confidenceScore);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-purple-500/30">
      
      {/* Top Navigation & Header */}
      <header className="mb-8 border-b border-slate-800 pb-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Cpu className="w-3.5 h-3.5" /> Explainable Inference & Diagnostics Console
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Algorithmic Decision Transparency</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span>Target Pipeline: <span className="text-slate-200 font-mono">{activeDecision.targetModel}</span></span>
            <span className="text-slate-700">•</span>
            <span>Ref Event: <span className="text-slate-200 font-mono">{activeDecision.id}</span></span>
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2.5 text-xs text-slate-400 font-mono">
            <span>Audit Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Transparent
            </span>
          </div>
        </div>
      </header>

      {/* Main Multi-Column Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT & CENTER COLUMNS: Executive Diagnostics & Decision Pathway */}
        <div className="xl:col-span-2 space-y-6">

          {/* AI Executive Reasoning Narrative */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">AI Reasoning Synthesis</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">{activeDecision.timestamp}</span>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg text-sm text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-slate-400 block mb-1">Algorithmic Assertion:</span>
              {activeDecision.reasoningNarrative}
            </div>
          </section>

          {/* Step-by-Step Decision Pathway Trace */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Internal Decision Execution Path</h2>
            </div>

            <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6">
              {activeDecision.decisionPath.map((node) => (
                <div key={node.step} className="relative group">
                  {/* Step Axis Indicator Node */}
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-purple-500 bg-slate-950 group-hover:bg-purple-400 transition-colors" />
                  
                  <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 group-hover:border-slate-800 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-400 font-semibold">Step {node.step}</span>
                        <h3 className="text-sm font-bold text-slate-200">{node.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">{node.details}</p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-900">
                        {node.status}
                      </span>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        node.contribution.startsWith("-") ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                      }`}>
                        {node.contribution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Explainability Cards & Feature Importance Spectrum */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Feature Attribution Analysis</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Proportional weight impact (SHAP value alignment) toward final decision trajectory.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature Impact List */}
              <div className="space-y-3">
                {activeDecision.features.map((feat, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedFeature(feat)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      selectedFeature.name === feat.name 
                        ? 'bg-slate-950 border-purple-500' 
                        : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{feat.name}</span>
                      <span className="text-[10px] uppercase font-mono text-slate-500">{feat.type}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-850">
                        <div 
                          className={`h-full rounded-full ${feat.impact === 'negative' ? 'bg-emerald-500' : 'bg-purple-500'}`}
                          style={{ width: `${Math.abs(feat.weight) * 2}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold shrink-0 ${feat.impact === 'negative' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {feat.impact === 'negative' ? '-' : '+'}{Math.abs(feat.weight)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Feature Explainability Card Details */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> Attribution Detail Card
                  </div>
                  
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{selectedFeature.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 mt-1.5 text-[10px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Module Category: {selectedFeature.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    This component evaluates dynamic shifts against established baselines. For current execution, the calculated feature weight contributed <span className="text-white font-bold">{selectedFeature.weight}%</span> to the classification boundary direction, acting as a <span className={selectedFeature.impact === 'negative' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{selectedFeature.impact === 'negative' ? 'inhibitive / neutralizing' : 'aggravating / accelerating'}</span> coefficient.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Model weight coefficient</span>
                  <span className="font-mono font-bold text-slate-300">SHAP Val Ref: F-{selectedFeature.weight > 0 ? 'P' : 'N'}{Math.abs(selectedFeature.weight)}</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: CONFIDENCE, SOURCES, AND TRANSPARENCY STATS */}
        <div className="xl:col-span-1 space-y-6">

          {/* Model Confidence Meter Card */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Model Path Integrity</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentColors.bg} ${currentColors.text}`}>
                {activeDecision.verdict}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-white">
                  {activeDecision.confidenceScore}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </span>
                <span className="text-xs text-slate-400 font-semibold">Classification Score Threshold</span>
              </div>
              
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${currentColors.bar}`}
                  style={{ width: `${activeDecision.confidenceScore}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-850">
              The classification margin is <span className="text-white font-bold">13%</span> above the critical high-threat delta parameter. Decision parameters remain within safe deviation curves.
            </div>
          </section>

          {/* Evidence Sources & References Used */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ground Truth & Data References</h2>
            </div>

            <div className="space-y-3">
              {activeDecision.evidenceSources.map((source) => (
                <div key={source.id} className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">{source.id}</span>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">
                      {source.reliability} Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{source.source}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{source.details}</p>
                  <div className="pt-1.5 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Source Type: <span className="text-slate-400">{source.type}</span></span>
                    <ExternalLink className="w-3 h-3 hover:text-slate-300 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Model Transparency Audit Panel */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Model Metadata Log</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-500">Training Cutoff Date</span>
                <span className="font-semibold text-slate-300">April 2026</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-500">Validation Framework</span>
                <span className="font-semibold text-slate-300">K-Fold Cross-validation</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-500">Explainability Algorithm</span>
                <span className="font-semibold text-purple-400 font-mono">KernelSHAP Engine</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Audit Compliance</span>
                <span className="font-semibold text-emerald-400">EU AI Act (Tier 1 Compliance)</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}