import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Paperclip,
  Shield,
  AlertTriangle,
  Brain,
  FileText,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  Cpu,
  Layers,
  Database,
  Lock,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export interface EvidenceTag {
  id: string;
  title: string;
  type: 'FIR' | 'CCTV' | 'Forensic' | 'CDR' | 'Financial';
  confidence: number;
  summary: string;
}

export interface ReasoningStep {
  step: number;
  description: string;
  evidenceRef: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  reasoningSteps?: ReasoningStep[];
  evidenceTags?: EvidenceTag[];
  IPCSections?: { section: string; title: string; relevantClause: string }[];
  suggestedActions?: string[];
  isThinking?: boolean;
}

const PRESET_CASES = [
  { id: 'KSP-2026-0891', title: 'Cyber Fraud & ATM Skimming - Mysuru Central' },
  { id: 'KSP-2026-1142', title: 'Illegal Trade Syndicate - Mangaluru Port' },
  { id: 'KSP-2026-0405', title: 'Vehicle Theft Ring - Bengaluru North' },
];

export const AICrimeInvestigationAssistant: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>('KSP-2026-0891');
  const [input, setInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'evidence' | 'reasoning'>('chat');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'system',
      timestamp: '10:14:02 AM',
      text: 'Case File KSP-2026-0891 loaded into Neural Engine. 14 Digital Evidence items parsed.',
    },
    {
      id: 'msg-2',
      sender: 'user',
      timestamp: '10:15:30 AM',
      text: 'Analyze CDR records for suspect Rakesh Gowda around Hebbal Lake between 22:00 and 01:00 on July 14, 2026.',
    },
    {
      id: 'msg-3',
      sender: 'assistant',
      timestamp: '10:15:34 AM',
      text: 'Correlating Tower Dump Data with CDR records for Suspect Rakesh Gowda (MSISDN: +91 98860 12345). A critical location overlap was identified at Hebbal Main Signal Tower #4.',
      reasoningSteps: [
        {
          step: 1,
          description: 'Cross-matched cell tower logs at Hebbal Signal #4 with suspect device IMEI 864201928374102.',
          evidenceRef: ['CDR-891-A', 'TOWER-HEBBAL-04']
        },
        {
          step: 2,
          description: 'Identified 4 minutes encrypted voice transmission to known co-conspirator Vinay K. at 23:14 IST.',
          evidenceRef: ['CDR-891-B']
        },
        {
          step: 3,
          description: 'Matched concurrent automated toll gate entry timestamp at Hebbal Flyover Plaza with CCTV Frame #8841.',
          evidenceRef: ['CCTV-CAM-12']
        }
      ],
      evidenceTags: [
        { id: 'CDR-891-A', title: 'Tower Log Hebbal-04', type: 'CDR', confidence: 98.4, summary: 'Signal lock for 42 minutes' },
        { id: 'CCTV-CAM-12', title: 'Flyover Gate #2 Feed', type: 'CCTV', confidence: 91.2, summary: 'License KA-04-MJ-8819 matched' }
      ],
      IPCSections: [
        { section: 'Section 303 (BNS 2023)', title: 'Theft / Criminal Breach of Trust', relevantClause: 'Unauthorized electronic fund interception' },
        { section: 'Section 66D IT Act', title: 'Cheating by Personation', relevantClause: 'Using computer resource to impersonate' }
      ],
      suggestedActions: [
        'Issue Warrant Notice to Mobile Operator for IPDR Data',
        'Cross-reference CCTV Frame #8841 with Transport Dept Registry',
        'Generate Suspect Geofence Movement Timeline'
      ]
    },
  ]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsProcessing(true);

    // Simulate AI Crime Reasoning
    setTimeout(() => {
      const assistantResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `Cross-analysis complete for query: "${query}". System retrieved 3 related crime files from Crime and Criminal Tracking Network & Systems (CCTNS) database.`,
        reasoningSteps: [
          {
            step: 1,
            description: 'Queries executed across Karnataka CCTNS & CyberCrime Incident Portal.',
            evidenceRef: ['CCTNS-DB-2026', 'CYBER-PORTAL-IN']
          },
          {
            step: 2,
            description: 'Semantic vector similarity match score: 0.94 against modus operandi pattern MO-ATM-SKIM-BLR.',
            evidenceRef: ['MODUS-OPERANDI-PATTERNS']
          }
        ],
        evidenceTags: [
          { id: 'FIN-STATEMENT-99', title: 'Mule Account Ledger #88', type: 'Financial', confidence: 95.8, summary: 'Immediate fund transfer of ₹4.5L post-incident' }
        ],
        IPCSections: [
          { section: 'Section 318 BNS', title: 'Cheating', relevantClause: 'Dishonest inducement of property delivery' }
        ],
        suggestedActions: [
          'Initiate Bank Account Freeze Request via 1930 Cyber Helpline Interface',
          'Export Forensic Hash Certificate for Court Admissibility'
        ]
      };

      setMessages((prev) => [...prev, assistantResponse]);
      setIsProcessing(false);
    }, 1800);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-sans">
      {/* Top Tactical Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-wide text-amber-400 uppercase text-sm">KSP IntelliCrime AI Core</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400">Karnataka State Police Datathon 2026 Engine</p>
          </div>
        </div>

        {/* Case Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            Active Case:
          </label>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
          >
            {PRESET_CASES.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.id}] {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 overflow-hidden">
        {/* Left Column: Chat Console */}
        <div className="lg:col-span-3 flex flex-col border-r border-slate-800 bg-slate-950/50">
          {/* Active Mode Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/40 px-4 pt-2 gap-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 border-t border-x transition-all ${
                activeTab === 'chat'
                  ? 'bg-slate-950 border-amber-500/50 text-amber-400 border-b-transparent'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Interactive Reasoning Console
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 border-t border-x transition-all ${
                activeTab === 'evidence'
                  ? 'bg-slate-950 border-amber-500/50 text-amber-400 border-b-transparent'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Parsed Evidence Stream
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${
                  msg.sender === 'user'
                    ? 'items-end'
                    : msg.sender === 'system'
                    ? 'items-center'
                    : 'items-start'
                }`}
              >
                {msg.sender === 'system' && (
                  <div className="my-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2 font-sans">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>{msg.text}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                )}

                {msg.sender !== 'system' && (
                  <div
                    className={`max-w-3xl rounded-xl p-4 border transition-all ${
                      msg.sender === 'user'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-100 rounded-tr-none'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-slate-800/80 font-sans text-xs">
                      <div className="flex items-center gap-2">
                        {msg.sender === 'user' ? (
                          <>
                            <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-amber-300">Investigating Officer</span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-cyan-300">KSP IntelliCrime Agent</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-slate-300 p-1 rounded"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Main Content */}
                    <p className="font-sans leading-relaxed text-sm text-slate-200 mb-3">{msg.text}</p>

                    {/* AI Reasoning Chain Dropdown / Block */}
                    {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                      <div className="mt-3 bg-slate-950/70 border border-cyan-900/40 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-400 font-sans uppercase tracking-wider">
                          <Brain className="w-3.5 h-3.5" /> AI Chain of Thought Reasoning
                        </div>
                        <div className="space-y-2 text-xs">
                          {msg.reasoningSteps.map((step) => (
                            <div key={step.step} className="flex gap-2.5 items-start bg-slate-900/60 p-2 rounded border border-slate-800/60">
                              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700 flex items-center justify-center text-[10px] font-bold">
                                {step.step}
                              </span>
                              <div className="flex-1">
                                <p className="text-slate-300 font-sans">{step.description}</p>
                                <div className="flex gap-1.5 mt-1">
                                  {step.evidenceRef.map((ref) => (
                                    <span key={ref} className="bg-slate-800 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                      #{ref}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* IPC & Bharatiya Nyaya Sanhita Legal Recommendations */}
                    {msg.IPCSections && msg.IPCSections.length > 0 && (
                      <div className="mt-3 bg-amber-950/10 border border-amber-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-400 font-sans uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5" /> Legal Mapping (BNS / IT Act)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
                          {msg.IPCSections.map((sec, idx) => (
                            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-2 rounded">
                              <span className="font-mono text-amber-300 font-bold block">{sec.section}</span>
                              <span className="text-slate-200 font-medium block">{sec.title}</span>
                              <span className="text-slate-400 text-[11px] block mt-0.5">{sec.relevantClause}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Tactical Actions */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 font-sans">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                          Recommended Investigative Actions:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestedActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(`Execute action: ${action}`)}
                              className="text-xs bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-left"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>{action}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span>KSP IntelliCrime Neural Engine running cross-vector database match...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="p-4 bg-slate-900/80 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-colors"
                title="Attach Case File / Digital Artifact"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask intelligence questions (e.g., 'Extract suspect associations from call logs')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
              >
                <span>Analyze</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1 font-mono">
              <span>Secure Connection: TLS 1.3 / AES-256 Encrypted</span>
              <span>KSP Datathon 2026 Core v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Column: Case Artifact Intelligence Context */}
        <div className="lg:col-span-1 bg-slate-900/30 p-4 border-l border-slate-800 flex flex-col gap-4 overflow-y-auto font-sans">
          {/* Active Case Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider">Case Snapshot</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">{selectedCase}</h3>
            <p className="text-xs text-slate-400 mt-1">Investigating Agency: CID Cyber Crime Division, Bengaluru</p>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block text-[10px]">EVIDENCE ITEMS</span>
                <span className="font-bold text-slate-200">14 Files</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block text-[10px]">RISK SCORE</span>
                <span className="font-bold text-rose-400">HIGH (8.4/10)</span>
              </div>
            </div>
          </div>

          {/* Parsed Artifacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Key Linked Evidence
            </h4>

            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              {[
                { id: 'CDR-891-A', title: 'Tower Dump Hebbal #4', type: 'CDR', confidence: 98.4 },
                { id: 'CCTV-CAM-12', title: 'Hebbal Flyover Gate #2', type: 'CCTV', confidence: 91.2 },
                { id: 'FIN-STATEMENT-99', title: 'Mule Account Ledger', type: 'Financial', confidence: 95.8 },
                { id: 'FORENSIC-DISK-01', title: 'Cloned Hard Drive Hash', type: 'Forensic', confidence: 99.1 },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-amber-400 group-hover:text-amber-300">{item.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{item.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Match Reliability</span>
                    <span className="text-emerald-400 font-mono font-bold">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <span>View Full Evidence Locker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICrimeInvestigationAssistant;