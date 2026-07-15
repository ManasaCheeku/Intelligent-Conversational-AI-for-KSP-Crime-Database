import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  BiSearch, 
  BiFilterAlt, 
  BiLayer, 
  BiMapPin, 
  BiRadioCircleMarked, 
  BiListUl,
  BiShieldQuarter,
  BiInfoCircle
} from 'react-icons/bi';

// Fix Leaflet Default Marker Icon Issue in Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// ============================================================================
// STATIC GEOSPATIAL DATASETS (Bengaluru Metro Area Center Coordinates)
// ============================================================================
const BENGALURU_CENTER = [12.9716, 77.5946];

const CRIME_INCIDENTS = [
  { id: 'INC-2026-001', type: 'Cyber', title: 'Phishing Nodes Detected', severity: 'Medium', lat: 12.9782, lng: 77.6415, date: '2026-07-14', details: 'Illegal micro-call center routing detected.' },
  { id: 'INC-2026-002', type: 'Financial', title: 'High-Value Card Skimming', severity: 'High', lat: 12.9345, lng: 77.6101, date: '2026-07-12', details: 'POS terminal manipulation targeting retail shoppers.' },
  { id: 'INC-2026-003', type: 'Property', title: 'Commercial Intrusion', severity: 'Low', lat: 12.9592, lng: 77.5734, date: '2026-07-10', details: 'Forced lock entry at warehouse district.' },
  { id: 'INC-2026-004', type: 'Violent', title: 'Street Level Altercation', severity: 'Critical', lat: 12.9810, lng: 77.5970, date: '2026-07-13', details: 'Armed altercation resolved by local patrol unit.' },
  { id: 'INC-2026-005', type: 'Property', title: 'Transit Freight Theft', severity: 'Medium', lat: 13.0285, lng: 77.5412, date: '2026-07-11', details: 'Pilferage of shipping units along transit highway.' }
];

// Active Crime Hotspot Radii (Used for Circle & Heatmap Simulation)
const CRIME_HOTSPOTS = [
  { id: 'HS-01', name: 'Indiranagar Tech Sector', lat: 12.9782, lng: 77.6415, radius: 450, density: 'High (34 Incidents)', color: '#ef4444' },
  { id: 'HS-02', name: 'Koramangala Outer Grid', lat: 12.9345, lng: 77.6101, radius: 600, density: 'Critical (52 Incidents)', color: '#b91c1c' },
  { id: 'HS-03', name: 'Peenya Logistics Hub', lat: 13.0285, lng: 77.5412, radius: 800, density: 'Medium (18 Incidents)', color: '#f59e0b' }
];

// Mock District Boundary Polygon Coordinates (Central Bengaluru Zone Grid)
const DISTRICT_BOUNDARIES = [
  [12.995, 77.550],
  [13.010, 77.620],
  [12.960, 77.660],
  [12.920, 77.630],
  [12.915, 77.570],
  [12.950, 77.540]
];

export default function CrimeMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  
  // Layer Toggle States
  const [showHotspots, setShowHotspots] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showDistrictBounds, setShowDistrictBounds] = useState(true);
  const [showHeatmapSim, setShowHeatmapSim] = useState(false);

  // Filter Logic execution
  const filteredIncidents = useMemo(() => {
    return CRIME_INCIDENTS.filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inc.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || inc.type === selectedType;
      const matchesSeverity = selectedSeverity === 'All' || inc.severity === selectedSeverity;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [searchQuery, selectedType, selectedSeverity]);

  // Determine severity styling
  const getSeverityBadge = (severity) => {
    const styles = {
      Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Medium: 'bg-blue-50 text-blue-700 border-blue-200',
      High: 'bg-amber-50 text-amber-700 border-amber-200',
      Critical: 'bg-red-50 text-red-700 border-red-200'
    };
    return styles[severity] || 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:pl-64 pt-16">
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Map Control & Incident Directory Sidebar */}
        <div className="w-full xl:w-96 shrink-0 flex flex-col gap-5 h-auto xl:h-[calc(100vh-8.5rem)]">
          
          {/* Quick Filter Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BiFilterAlt className="text-blue-500 text-sm" />
              Tactical Parameters
            </h3>

            {/* Title / ID Search Field */}
            <div className="relative">
              <BiSearch className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Incident ID or Title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown Filters Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-600"
                >
                  <option value="All">All Categories</option>
                  <option value="Cyber">Cyber</option>
                  <option value="Financial">Financial</option>
                  <option value="Property">Property</option>
                  <option value="Violent">Violent</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Severity</label>
                <select 
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-600"
                >
                  <option value="All">All Severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Layer Visibility Toggle Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BiLayer className="text-blue-500 text-sm" />
              Intelligence Layer Toggles
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-600 font-medium">Render Incidents (Markers)</span>
                <input 
                  type="checkbox" 
                  checked={showMarkers} 
                  onChange={(e) => setShowMarkers(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-600 font-medium">Critical Boundary (District)</span>
                <input 
                  type="checkbox" 
                  checked={showDistrictBounds} 
                  onChange={(e) => setShowDistrictBounds(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-600 font-medium">Radius Clusters (Hotspots)</span>
                <input 
                  type="checkbox" 
                  checked={showHotspots} 
                  onChange={(e) => setShowHotspots(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-600 font-medium">Density Heatmap (Thermal Sim)</span>
                <input 
                  type="checkbox" 
                  checked={showHeatmapSim} 
                  onChange={(e) => setShowHeatmapSim(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
              </label>
            </div>
          </div>

          {/* Real-time Filtered Incidents Directory List */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-grow flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
              <BiListUl className="text-blue-500 text-sm" />
              Incidents List ({filteredIncidents.length})
            </h3>

            <div className="space-y-2.5 overflow-y-auto flex-grow max-h-60 xl:max-h-none pr-1">
              {filteredIncidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600">{inc.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{inc.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{inc.details}</p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50 text-[9px] font-mono text-slate-400">
                    <span>TYPE: {inc.type.toUpperCase()}</span>
                    <span>{inc.date}</span>
                  </div>
                </div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching threat logs in local memory layer.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Live Interactive Map Workspace Panel */}
        <div className="flex-grow bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[500px] xl:h-[calc(100vh-8.5rem)] flex flex-col relative">
          
          {/* Internal Command Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BiShieldQuarter className="text-blue-500 text-xl" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Spatial Risk Intelligence Workspace</h3>
                <p className="text-[9px] font-mono text-slate-400">CENTRAL BENGALURU SECTOR - TARGET SYSTEM SCALE</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded text-[10px] font-mono border border-slate-700">
              <BiInfoCircle className="text-blue-400 text-xs" />
              <span>ACTIVE LAYERS: {[showMarkers&&'MRK', showDistrictBounds&&'DST', showHotspots&&'HTS', showHeatmapSim&&'HTM'].filter(Boolean).join(' | ') || 'NONE'}</span>
            </div>
          </div>

          {/* Interactive Geospatial Leaflet Container */}
          <div className="flex-grow w-full h-full relative z-10">
            <MapContainer 
              center={BENGALURU_CENTER} 
              zoom={12.5} 
              className="w-full h-full"
              style={{ background: '#f8fafc' }}
            >
              {/* TileLayer - OpenStreetMap Standard */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* District boundary polygon overlay */}
              {showDistrictBounds && (
                <Polygon 
                  positions={DISTRICT_BOUNDARIES} 
                  pathOptions={{
                    color: '#2563eb',
                    weight: 2,
                    fillColor: '#3b82f6',
                    fillOpacity: 0.08,
                    dashArray: '6, 6'
                  }}
                >
                  <Popup>
                    <div className="text-xs font-sans">
                      <strong className="text-blue-600 uppercase font-mono">Central Crime Sector-Alpha</strong>
                      <p className="text-slate-500 mt-1 text-[10px]">Under jurisdiction of state investigative division.</p>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* Mock Heatmap simulated cluster layers */}
              {showHeatmapSim && (
                <>
                  <Circle 
                    center={BENGALURU_CENTER} 
                    radius={3500} 
                    pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.15 }} 
                  />
                  <Circle 
                    center={[12.9800, 77.6200]} 
                    radius={2000} 
                    pathOptions={{ color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.2 }} 
                  />
                </>
              )}

              {/* Hotspot Circles layer rendering */}
              {showHotspots && CRIME_HOTSPOTS.map((hotspot) => (
                <Circle
                  key={hotspot.id}
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.radius}
                  pathOptions={{
                    color: hotspot.color,
                    fillColor: hotspot.color,
                    fillOpacity: 0.18,
                    weight: 1.5
                  }}
                >
                  <Popup>
                    <div className="text-xs font-sans">
                      <strong className="text-slate-800">{hotspot.name}</strong>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        <div>Risk Cluster ID: {hotspot.id}</div>
                        <div>Density: {hotspot.density}</div>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Individual incident markers layer rendering */}
              {showMarkers && filteredIncidents.map((inc) => (
                <Marker 
                  key={inc.id} 
                  position={[inc.lat, inc.lng]}
                >
                  <Popup>
                    <div className="text-xs font-sans w-56 p-1">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-blue-600">{inc.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </div>
                      <strong className="text-slate-800 text-xs block mb-1">{inc.title}</strong>
                      <p className="text-slate-500 text-[10px] leading-relaxed mb-1.5">{inc.details}</p>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-1.5">
                        <span>{inc.type.toUpperCase()}</span>
                        <span>{inc.date}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
}