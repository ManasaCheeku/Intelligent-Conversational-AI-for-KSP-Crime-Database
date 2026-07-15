import React, { useState, useRef, useEffect } from 'react';
import { 
  BiMessageSquareDetail, 
  BiMicrophone, 
  BiMicrophoneOff, 
  BiDownload, 
  BiGlobe, 
  BiSend, 
  BiHistory, 
  BiShieldCheck, 
  BiEraser, 
  BiInfoCircle, 
  BiCheckCircle, 
  BiHelpCircle 
} from 'react-icons/bi';

export default function AIAssistant() {
  const [lang, setLang] = useState('EN'); // EN or KN (Kannada)
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCase, setSelectedCase] = useState('CASE-2026-A9');
  
  // Conversation History List
  const [history] = useState([
    { id: 'h1', title: 'Case #2026-A9 Transaction Flag', date: 'Today, 10:42 AM' },
    { id: 'h2', title: 'CDR Analysis - Mysore Tower Dump', date: 'Yesterday' },
    { id: 'h3', title: 'Vehicle Telemetry Cross-Match', date: '12 Jul 2026' },
    { id: 'h4', title: 'Syndicate Operational Pattern', date: '08 Jul 2026' }
  ]);

  // Current Active Messages
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: "Intelligence Systems initialized. Secure workspace connection established with KSP State database node. How can I assist you with operational analytics or case synthesis today?", 
      time: "10:42 AM",
      xai: null
    },
    { 
      id: 2, 
      sender: 'user', 
      text: "Run an evaluation on Case #2026-A9. Highlight the core anomalous routing indicators from the latest bank ledger.", 
      time: "10:44 AM",
      xai: null
    },
    { 
      id: 3, 
      sender: 'ai', 
      text: "Analysis completed. Based on transaction record logs for Case #2026-A9, I detected 3 multi-hop routing paths passing through offshore entities. These actions directly resemble recognized syndication patterns where velocity parameters exceed conventional baseline averages.", 
      time: "10:45 AM",
      xai: {
        confidence: "94.2%",
        rulesApplied: "Rule-Base: Financial Velocity (F-22), Shell Routing Multi-Hops (S-08)",
        dataSources: "KSP Central Financial Database, Reserve Bank of India Cross-Border Feed"
      }
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: userMsgTime,
      xai: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate secure AI response
    setTimeout(() => {
      const aiMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: lang === 'EN' 
          ? "System generated safe prediction vector. Data verified across state registries. Ready to compile into full investigation dossier."
          : "ಸಿಸ್ಟಮ್ ಸುರಕ್ಷಿತ ಭವಿಷ್ಯಸೂಚಕ ವೆಕ್ಟರ್ ಅನ್ನು ರಚಿಸಿದೆ. ರಾಜ್ಯ ನೋಂದಾವಣೆಗಳಾದ್ಯಂತ ಡೇಟಾವನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
        time: aiMsgTime,
        xai: {
          confidence: "89.7%",
          rulesApplied: "Dynamic Threat Metric Correlation (DT-19)",
          dataSources: "Karnataka State Registry Records V2"
        }
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate speaking/receiving input
    if (!isListening) {
      setTimeout(() => {
        setInputValue("Identify suspicious asset correlation near Bengaluru District.");
        setIsListening(false);
      }, 3000);
    }
  };

  const handleExportPDF = () => {
    alert("System Action: Generating cryptographically secure PDF audit artifact of this dialogue window.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:pl-64 pt-16">
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex-grow flex flex-col lg:flex-row gap-6">
        
        {/* Left Hand: Chat Window Column */}
        <div className="flex-grow flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[calc(100vh-8.5rem)]">
          
          {/* Top Panel: Control Controls */}
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded text-white">
                <BiMessageSquareDetail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {lang === 'EN' ? 'Cognitive Intelligence Console' : 'ಕಾಗ್ನಿಟಿವ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಕನ್ಸೋಲ್'}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">TAC-AI SECURED NODE-08</p>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Language Selector */}
              <button 
                onClick={() => setLang(prev => prev === 'EN' ? 'KN' : 'EN')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs font-semibold font-mono text-slate-300"
                title="Toggle Language"
              >
                <BiGlobe className="text-blue-400 text-sm" />
                <span>{lang === 'EN' ? 'ಕನ್ನಡ' : 'ENG'}</span>
              </button>

              {/* PDF Export Action */}
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-xs font-semibold text-white shadow-sm"
                title="Export Dialogue PDF"
              >
                <BiDownload className="text-sm" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>

          {/* Dialogue Feed Wrapper */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-4 shadow-sm text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}>
                  
                  {/* Inside Message Text Content */}
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Explainable AI Decision Layer */}
                  {msg.xai && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600 font-sans">
                      <div className="flex items-center gap-1 font-bold text-emerald-600 font-mono text-[10px] tracking-wider uppercase">
                        <BiShieldCheck className="text-sm" />
                        <span>Explainable Logic Log</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200/60 font-mono text-[10px] space-y-1 text-slate-500">
                        <div><strong className="text-slate-700">Confidence Metric:</strong> {msg.xai.confidence}</div>
                        <div><strong className="text-slate-700">Dynamic Policy Code:</strong> {msg.xai.rulesApplied}</div>
                        <div><strong className="text-slate-700">Verified Registries:</strong> {msg.xai.dataSources}</div>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            {/* Voice Input Mic Trigger */}
            <button 
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-lg border transition-all ${
                isListening 
                  ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isListening ? "Listening... Click to cancel" : "Secure Voice Input"}
            >
              {isListening ? <BiMicrophoneOff className="h-5 w-5" /> : <BiMicrophone className="h-5 w-5" />}
            </button>

            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={lang === 'EN' ? "Input query or search requirements..." : "ಪ್ರಶ್ನೆ ಅಥವಾ ಹುಡುಕಾಟದ ಅವಶ್ಯಕತೆಗಳನ್ನು ನಮೂದಿಸಿ..."}
              className="flex-grow border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />

            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>SEND</span>
              <BiSend className="text-sm" />
            </button>
          </form>
        </div>

        {/* Right Hand: Context and History Panels */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-auto lg:h-[calc(100vh-8.5rem)] overflow-y-auto">
          
          {/* Active Work Context Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BiInfoCircle className="text-blue-500 text-base" />
              Active System Context
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Bound File dossier</label>
                <select 
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                >
                  <option value="CASE-2026-A9">CASE-2026-A9 (Dark Liquidity)</option>
                  <option value="CASE-2026-M2">CASE-2026-M2 (Mysore Tower Dump)</option>
                  <option value="CASE-2026-G7">CASE-2026-G7 (Gulbarga Hub Scan)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/60 font-mono text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Node Sync:</span> <span className="font-bold text-emerald-600">CONNECTED</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Jurisdiction:</span> <span className="font-bold text-slate-700">KSP - CID Desk</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Data Cleared:</span> <span className="font-bold text-slate-700">LEVEL 4 Auth</span></div>
              </div>
            </div>
          </div>

          {/* Conversation History Index */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-grow flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BiHistory className="text-slate-500 text-base" />
              Dossier Dialogue History
            </h3>
            
            <div className="space-y-2 overflow-y-auto flex-grow max-h-60 lg:max-h-none">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/60 transition-colors cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-600 font-mono">
                    {item.title}
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block font-mono">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}