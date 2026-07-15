import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  BiSearch,
  BiFilterAlt,
  BiShareAlt,
  BiDetail,
  BiShieldQuarter,
  BiReset,
  BiDownload,
  BiNetworkChart
} from 'react-icons/bi';

// ============================================================================
// STYLED CUSTOM NODE TYPES (Using Tailwind classes for modern look)
// ============================================================================
const NODE_STYLE_CLASSES = {
  Accused: 'bg-red-50 border-red-500 text-red-900 ring-red-100 shadow-red-100',
  Victim: 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-emerald-100 shadow-emerald-100',
  FinancialAccount: 'bg-blue-50 border-blue-500 text-blue-900 ring-blue-100 shadow-blue-100',
  MobileNumber: 'bg-purple-50 border-purple-500 text-purple-900 ring-purple-100 shadow-purple-100',
  Vehicle: 'bg-amber-50 border-amber-500 text-amber-900 ring-amber-100 shadow-amber-100',
  Location: 'bg-slate-50 border-slate-500 text-slate-900 ring-slate-100 shadow-slate-100',
};

const NODE_LABELS = {
  Accused: 'Suspect / Accused',
  Victim: 'Victim / Compl.',
  FinancialAccount: 'Bank / Wallet',
  MobileNumber: 'CDR / Phone',
  Vehicle: 'Vehicle Node',
  Location: 'Cell Tower / Loc',
};

// ============================================================================
// INITIAL NETWORK TOPOLOGY (Target Syndicate "Kolar-East Hub")
// ============================================================================
const INITIAL_NODES = [
  // Accused / Suspects
  { id: 'acc-1', type: 'default', position: { x: 250, y: 150 }, data: { label: 'Ramesh Kumar (Syndicate Head)', category: 'Accused', risk: 'Critical', idCode: 'SUS-882' } },
  { id: 'acc-2', type: 'default', position: { x: 450, y: 50 }, data: { label: 'Vikram Singh (Mule Recruiter)', category: 'Accused', risk: 'High', idCode: 'SUS-401' } },
  
  // Victims
  { id: 'vic-1', type: 'default', position: { x: 50, y: 100 }, data: { label: 'Ananya S. (Complainant)', category: 'Victim', risk: 'Low', idCode: 'VIC-109' } },

  // Financial Accounts
  { id: 'fin-1', type: 'default', position: { x: 100, y: 300 }, data: { label: 'SBI Acct ***4892 (Mule)', category: 'FinancialAccount', risk: 'High', idCode: 'ACC-012' } },
  { id: 'fin-2', type: 'default', position: { x: 400, y: 320 }, data: { label: 'HDFC Acct ***1105', category: 'FinancialAccount', risk: 'Medium', idCode: 'ACC-544' } },

  // Mobile Numbers
  { id: 'mob-1', type: 'default', position: { x: 550, y: 200 }, data: { label: '+91 98845 22104', category: 'MobileNumber', risk: 'High', idCode: 'TEL-604' } },
  { id: 'mob-2', type: 'default', position: { x: 280, y: -20 }, data: { label: '+91 80556 99012', category: 'MobileNumber', risk: 'Medium', idCode: 'TEL-118' } },

  // Vehicles
  { id: 'veh-1', type: 'default', position: { x: 700, y: 100 }, data: { label: 'KA-03-MY-8840 (SUV)', category: 'Vehicle', risk: 'Medium', idCode: 'VEH-929' } },

  // Locations
  { id: 'loc-1', type: 'default', position: { x: 650, y: 300 }, data: { label: 'Whitefield BTS Tower 4', category: 'Location', risk: 'Low', idCode: 'LOC-771' } }
];

const INITIAL_EDGES = [
  { id: 'e-vic-fin', source: 'vic-1', target: 'fin-1', label: 'Transferred ₹4,50,000', animated: true, style: { stroke: '#ef4444' } },
  { id: 'e-acc-fin1', source: 'acc-1', target: 'fin-1', label: 'Controls Mule Account', style: { stroke: '#3b82f6' } },
  { id: 'e-acc-fin2', source: 'acc-2', target: 'fin-2', label: 'Withdraws Cash', style: { stroke: '#3b82f6' } },
  { id: 'e-fin1-fin2', source: 'fin-1', target: 'fin-2', label: 'Shell Routing (Layering)', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-acc1-mob2', source: 'acc-1', target: 'mob-2', label: 'Registered IMEI Link', style: { stroke: '#a855f7' } },
  { id: 'e-acc2-mob1', source: 'acc-2', target: 'mob-1', label: 'Active Call Record (CDR)', style: { stroke: '#a855f7' } },
  { id: 'e-mob1-veh1', source: 'mob-1', target: 'veh-1', label: 'Associated GPS Log', style: { stroke: '#f59e0b' } },
  { id: 'e-mob1-loc1', source: 'mob-1', target: 'loc-1', label: 'Tower Triangulation', style: { stroke: '#64748b' } }
];

export default function NetworkAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [activeDossier, setActiveDossier] = useState(null);

  // Nodes and Edges State
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  // Filtered dataset mapping
  const visibleNodeIds = useMemo(() => {
    return INITIAL_NODES.filter(node => {
      const matchesSearch = node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.data.idCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || node.data.category === selectedCategory;
      const matchesRisk = selectedRisk === 'All' || node.data.risk === selectedRisk;
      return matchesSearch && matchesCategory && matchesRisk;
    }).map(n => n.id);
  }, [searchQuery, selectedCategory, selectedRisk]);

  // Compute standard dynamic node representations
  const processedNodes = useMemo(() => {
    return INITIAL_NODES.map((node) => {
      const isVisible = visibleNodeIds.includes(node.id);
      const styleClass = NODE_STYLE_CLASSES[node.data.category] || '';
      const isSelected = activeDossier?.id === node.id;

      return {
        ...node,
        style: {
          opacity: isVisible ? 1 : 0.15,
          pointerEvents: isVisible ? 'auto' : 'none',
        },
        data: {
          ...node.data,
          label: (
            <div 
              onClick={() => isVisible && setActiveDossier(node)}
              className={`p-3 rounded-lg border-2 text-left cursor-pointer transition-all duration-200 ring-2 ring-transparent ${styleClass} ${
                isSelected ? 'ring-blue-600 scale-105 shadow-md' : 'shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-mono font-bold tracking-wider opacity-70">
                  {node.data.idCode}
                </span>
                <span className={`text-[7px] font-bold px-1 rounded ${
                  node.data.risk === 'Critical' ? 'bg-red-600 text-white' :
                  node.data.risk === 'High' ? 'bg-amber-600 text-white' :
                  node.data.risk === 'Medium' ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {node.data.risk.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] font-bold truncate max-w-[150px]">{node.data.label}</div>
              <div className="text-[8px] mt-1 font-mono uppercase tracking-wider opacity-60">
                {NODE_LABELS[node.data.category]}
              </div>
            </div>
          )
        }
      };
    });
  }, [visibleNodeIds, activeDossier]);

  // Filter edges where both source and target are fully visible
  const processedEdges = useMemo(() => {
    return INITIAL_EDGES.map((edge) => {
      const isVisible = visibleNodeIds.includes(edge.source) && visibleNodeIds.includes(edge.target);
      return {
        ...edge,
        animated: isVisible ? edge.animated : false,
        style: {
          ...edge.style,
          opacity: isVisible ? 1 : 0.05,
        },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#ffffff', color: '#1e293b', fillOpacity: isVisible ? 0.9 : 0.05 },
        labelStyle: { fontSize: 8, fontWeight: 600, fill: '#475569', opacity: isVisible ? 1 : 0.05 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: edge.style?.stroke || '#cbd5e1',
        },
      };
    });
  }, [visibleNodeIds]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRisk('All');
    setActiveDossier(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:pl-64 pt-16">
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Graph Workspace Controllers */}
        <div className="w-full xl:w-96 shrink-0 flex flex-col gap-5 h-auto xl:h-[calc(100vh-8.5rem)]">
          
          {/* Node Filter Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BiFilterAlt className="text-blue-500 text-sm" />
              Syndicate Filter Parameters
            </h3>

            {/* Entity Search Bar */}
            <div className="relative">
              <BiSearch className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Node ID, Target, Identity..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-600"
                >
                  <option value="All">All Categories</option>
                  <option value="Accused">Suspect / Accused</option>
                  <option value="Victim">Victim</option>
                  <option value="FinancialAccount">Financial Acct</option>
                  <option value="MobileNumber">Mobile Number</option>
                  <option value="Vehicle">Vehicle Node</option>
                  <option value="Location">Location Block</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Threat Risk</label>
                <select 
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-600"
                >
                  <option value="All">All Risks</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
            >
              <BiReset />
              <span>Reset Working Filters</span>
            </button>
          </div>

          {/* Node Category Legend Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Graph Class Legends
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              {Object.keys(NODE_STYLE_CLASSES).map((cat) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded border block shrink-0 ${NODE_STYLE_CLASSES[cat].split(' ')[0]} ${NODE_STYLE_CLASSES[cat].split(' ')[1]}`}></span>
                  <span className="text-slate-600 truncate">{NODE_LABELS[cat]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Dossier Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-grow flex flex-col justify-between overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
              <BiDetail className="text-blue-500 text-sm" />
              Intelligence Node dossier
            </h3>

            {activeDossier ? (
              <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[9px] font-mono font-bold text-blue-600">{activeDossier.data.idCode}</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">{activeDossier.data.label}</h4>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase">
                      {NODE_LABELS[activeDossier.data.category]}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      activeDossier.data.risk === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                      activeDossier.data.risk === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      RISK: {activeDossier.data.risk.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Node Cluster Sync</span>
                    <span className="font-mono text-emerald-600 font-bold">Active Ledger Connected</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Database Entry</span>
                    <span className="font-mono text-slate-700">12 Jul 2026, 09:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Linked Relationships</span>
                    <span className="font-mono text-slate-700 font-bold">
                      {processedEdges.filter(e => e.source === activeDossier.id || e.target === activeDossier.id).length} Connected Paths
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center border border-dashed border-slate-200 rounded-lg p-6 text-center">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select any visible target node in the network map workspace to load secure intelligence telemetry.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Live Interactive Network Graph Area */}
        <div className="flex-grow bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[500px] xl:h-[calc(100vh-8.5rem)] flex flex-col relative">
          
          {/* Graph Screen Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <BiShareAlt className="text-blue-500 text-xl animate-pulse" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Multi-Domain Network Topology Graph</h3>
                <p className="text-[9px] font-mono text-slate-400">COGNITIVE CORRELATION LINK VERIFICATION LAYER</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded text-[10px] font-mono border border-slate-700 text-slate-300">
              <BiShieldQuarter className="text-blue-400 text-sm" />
              <span>SYNDICATE: KOLAR-EAST CELL</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-grow w-full h-full relative z-10">
            <ReactFlow
              nodes={processedNodes}
              edges={processedEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
              className="bg-slate-50/40"
            >
              <Background color="#cbd5e1" gap={16} size={1} />
              <Controls className="!bg-white !border-slate-200 !shadow-sm" />
              <MiniMap 
                zoomable 
                pannable 
                nodeColor="#f8fafc"
                nodeStrokeColor="#cbd5e1"
                maskColor="rgba(241, 245, 249, 0.6)"
              />
            </ReactFlow>
          </div>
        </div>

      </div>
    </div>
  );
}