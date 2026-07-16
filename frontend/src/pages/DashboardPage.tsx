
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  Suspense,
  lazy,
} from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ShieldAlert,
  FileText,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  Radio,
  Users,
  Sparkles,
  Send,
  MapPin,
  Activity,
  BadgeCheck,
  Cpu,
  Database,
  Server,
  ScanEye,
  Boxes,
  Siren,
  TrendingUp,
  TrendingDown,
  Eye,
  ClipboardList,
  UserPlus,
  UploadCloud,
  BarChart3,
  FilePlus2,
  PhoneCall,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ----------------------------------------------------------------------------
   0. TYPES
   -------------------------------------------------------------------------- */

interface StatCardData {
  id: string;
  label: string;
  value: number;
  icon: React.ElementType;
  trend: number; // percentage, signed
  accent: "signal" | "alert" | "danger" | "success" | "neutral";
}

interface CaseRow {
  id: string;
  caseNumber: string;
  crimeType: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Under Investigation" | "Resolved" | "Closed";
  officer: string;
  createdAt: string;
}

interface TimelineEvent {
  id: string;
  type: "created" | "evidence" | "ai" | "assigned" | "closed";
  title: string;
  detail: string;
  time: string;
}

interface SystemStatusItem {
  id: string;
  label: string;
  icon: React.ElementType;
  online: boolean;
  latencyMs?: number;
}

interface HotspotPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  risk: "Critical" | "High" | "Medium";
  incidents: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  detail: string;
  score: number; // 0-100 risk / confidence score
  severity: "critical" | "warning" | "info";
}

/* ----------------------------------------------------------------------------
   1. MOCK / LIVE DATA HOOKS
   In production, replace the generator functions below with your existing
   API/service calls (e.g. useCasesQuery(), useStatsQuery()). Signatures are
   kept intentionally close to typical REST/query hook shapes so swapping in
   real data does not require changing any JSX below.
   -------------------------------------------------------------------------- */

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useDashboardStats(): StatCardData[] {
  return useMemo(
    () => [
      { id: "fir", label: "Today's FIRs", value: 128, icon: FileText, trend: 6.4, accent: "signal" },
      { id: "active", label: "Active Cases", value: 842, icon: FolderOpen, trend: 2.1, accent: "alert" },
      { id: "resolved", label: "Resolved Cases", value: 511, icon: CheckCircle2, trend: 9.8, accent: "success" },
      { id: "pending", label: "Pending Investigation", value: 214, icon: Clock, trend: -3.2, accent: "neutral" },
      { id: "critical", label: "Critical Incidents", value: 17, icon: Siren, trend: 12.5, accent: "danger" },
      { id: "evidence", label: "Evidence Uploaded", value: 964, icon: Camera, trend: 4.7, accent: "signal" },
      { id: "aiAlerts", label: "AI Alerts", value: 39, icon: ScanEye, trend: 18.3, accent: "alert" },
      { id: "citizen", label: "Citizen Reports", value: 276, icon: Radio, trend: 1.4, accent: "neutral" },
    ],
    []
  );
}

function useCrimeTrendData() {
  return useMemo(
    () => [
      { day: "Mon", reports: 42, resolved: 28 },
      { day: "Tue", reports: 38, resolved: 31 },
      { day: "Wed", reports: 55, resolved: 40 },
      { day: "Thu", reports: 47, resolved: 35 },
      { day: "Fri", reports: 61, resolved: 44 },
      { day: "Sat", reports: 73, resolved: 52 },
      { day: "Sun", reports: 58, resolved: 49 },
    ],
    []
  );
}

function useMonthlyStats() {
  return useMemo(
    () => [
      { month: "Feb", cases: 320 },
      { month: "Mar", cases: 356 },
      { month: "Apr", cases: 298 },
      { month: "May", cases: 402 },
      { month: "Jun", cases: 388 },
      { month: "Jul", cases: 421 },
    ],
    []
  );
}

function useCrimeDistribution() {
  return useMemo(
    () => [
      { name: "Theft", value: 34 },
      { name: "Cyber Fraud", value: 22 },
      { name: "Assault", value: 15 },
      { name: "Burglary", value: 12 },
      { name: "Narcotics", value: 9 },
      { name: "Other", value: 8 },
    ],
    []
  );
}

function useHotspots(): HotspotPoint[] {
  return useMemo(
    () => [
      { id: "h1", lat: 12.9716, lng: 77.5946, label: "MG Road Junction", risk: "Critical", incidents: 24 },
      { id: "h2", lat: 12.9352, lng: 77.6146, label: "Koramangala 5th Block", risk: "High", incidents: 17 },
      { id: "h3", lat: 12.9784, lng: 77.6408, label: "Indiranagar 100ft Rd", risk: "Medium", incidents: 9 },
      { id: "h4", lat: 12.9141, lng: 77.6081, label: "HSR Layout Sector 3", risk: "High", incidents: 14 },
      { id: "h5", lat: 13.0067, lng: 77.5673, label: "Malleshwaram Market", risk: "Medium", incidents: 6 },
    ],
    []
  );
}

function useAIRecommendations(): AIRecommendation[] {
  return useMemo(
    () => [
      {
        id: "r1",
        title: "Elevated risk near MG Road after 9 PM",
        detail: "Pattern analysis of the last 30 days shows a 42% spike in reported incidents between 9–11 PM.",
        score: 87,
        severity: "critical",
      },
      {
        id: "r2",
        title: "Cyber fraud cluster linked to 3 FIRs",
        detail: "Shared device fingerprints suggest a coordinated phishing operation across 3 open cases.",
        score: 74,
        severity: "warning",
      },
      {
        id: "r3",
        title: "Suggested officer reassignment",
        detail: "Case load imbalance detected — Sector 4 has 2.3x average pending cases per officer.",
        score: 58,
        severity: "info",
      },
    ],
    []
  );
}

function useRecentCases(): CaseRow[] {
  return useMemo(
    () => [
      {
        id: "c1",
        caseNumber: "FIR-2026-08841",
        crimeType: "Cyber Fraud",
        priority: "Critical",
        status: "Under Investigation",
        officer: "Insp. R. Sharma",
        createdAt: "2026-07-16 09:12",
      },
      {
        id: "c2",
        caseNumber: "FIR-2026-08839",
        crimeType: "Burglary",
        priority: "High",
        status: "Open",
        officer: "SI K. Patil",
        createdAt: "2026-07-16 07:48",
      },
      {
        id: "c3",
        caseNumber: "FIR-2026-08822",
        crimeType: "Assault",
        priority: "Medium",
        status: "Resolved",
        officer: "Insp. M. Rao",
        createdAt: "2026-07-15 21:03",
      },
      {
        id: "c4",
        caseNumber: "FIR-2026-08810",
        crimeType: "Theft",
        priority: "Low",
        status: "Closed",
        officer: "SI A. Verma",
        createdAt: "2026-07-15 15:37",
      },
      {
        id: "c5",
        caseNumber: "FIR-2026-08804",
        crimeType: "Narcotics",
        priority: "Critical",
        status: "Under Investigation",
        officer: "Insp. R. Sharma",
        createdAt: "2026-07-15 11:52",
      },
    ],
    []
  );
}

function useActivityTimeline(): TimelineEvent[] {
  return useMemo(
    () => [
      { id: "t1", type: "created", title: "FIR-2026-08841 registered", detail: "Cyber Fraud reported via citizen portal", time: "09:12 AM" },
      { id: "t2", type: "ai", title: "AI risk analysis complete", detail: "Risk score 87/100 assigned to FIR-2026-08841", time: "09:14 AM" },
      { id: "t3", type: "assigned", title: "Officer assigned", detail: "Insp. R. Sharma assigned to FIR-2026-08841", time: "09:20 AM" },
      { id: "t4", type: "evidence", title: "Evidence uploaded", detail: "3 files added to FIR-2026-08839", time: "08:05 AM" },
      { id: "t5", type: "closed", title: "Case closed", detail: "FIR-2026-08810 marked resolved and closed", time: "Yesterday" },
    ],
    []
  );
}

function useSystemStatus(): SystemStatusItem[] {
  return useMemo(
    () => [
      { id: "backend", label: "Backend", icon: Server, online: true, latencyMs: 42 },
      { id: "ai", label: "AI Engine", icon: Cpu, online: true, latencyMs: 118 },
      { id: "db", label: "Database", icon: Database, online: true, latencyMs: 21 },
      { id: "api", label: "API Gateway", icon: Boxes, online: true, latencyMs: 64 },
      { id: "camera", label: "Camera Feed", icon: Camera, online: false },
      { id: "ocr", label: "OCR Service", icon: ScanEye, online: true, latencyMs: 205 },
      { id: "yolo", label: "YOLO Detection", icon: Eye, online: true, latencyMs: 89 },
    ],
    []
  );
}

/* Animated counter — counts up on mount / value change, GPU-friendly (no layout thrash) */
function useAnimatedCounter(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

/* ----------------------------------------------------------------------------
   2. REUSABLE SUB-COMPONENTS
   -------------------------------------------------------------------------- */

const StatCard = memo(function StatCard({ data }: { data: StatCardData }) {
  const animated = useAnimatedCounter(data.value);
  const Icon = data.icon;
  const isUp = data.trend >= 0;
  return (
    <div className={`stat-card stat-card--${data.accent} fade-in`} role="group" aria-label={data.label}>
      <div className="stat-card__icon">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="stat-card__body">
        <span className="stat-card__label">{data.label}</span>
        <strong className="stat-card__value">{animated.toLocaleString()}</strong>
        <span className={`stat-card__trend ${isUp ? "is-up" : "is-down"}`}>
          {isUp ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
          {Math.abs(data.trend).toFixed(1)}%
        </span>
      </div>
    </div>
  );
});

const PriorityPill = memo(function PriorityPill({ priority }: { priority: CaseRow["priority"] }) {
  return <span className={`pill pill--priority-${priority.toLowerCase()}`}>{priority}</span>;
});

const StatusPill = memo(function StatusPill({ status }: { status: CaseRow["status"] }) {
  const map: Record<CaseRow["status"], string> = {
    Open: "open",
    "Under Investigation": "investigation",
    Resolved: "resolved",
    Closed: "closed",
  };
  return <span className={`pill pill--status-${map[status]}`}>{status}</span>;
});

const SystemStatusRow = memo(function SystemStatusRow({ item }: { item: SystemStatusItem }) {
  const Icon = item.icon;
  return (
    <li className="system-status__row">
      <span className="system-status__label">
        <Icon size={16} aria-hidden="true" />
        {item.label}
      </span>
      <span className={`status-dot ${item.online ? "status-dot--online" : "status-dot--offline"}`}>
        <span className="status-dot__pulse" aria-hidden="true" />
        {item.online ? `Online${item.latencyMs ? ` · ${item.latencyMs}ms` : ""}` : "Offline"}
      </span>
    </li>
  );
});

const TimelineItem = memo(function TimelineItem({ event }: { event: TimelineEvent }) {
  const iconMap: Record<TimelineEvent["type"], React.ElementType> = {
    created: FilePlus2,
    evidence: UploadCloud,
    ai: Sparkles,
    assigned: UserPlus,
    closed: CheckCircle2,
  };
  const Icon = iconMap[event.type];
  return (
    <li className={`timeline__item timeline__item--${event.type}`}>
      <span className="timeline__icon">
        <Icon size={14} aria-hidden="true" />
      </span>
      <div className="timeline__content">
        <p className="timeline__title">{event.title}</p>
        <p className="timeline__detail">{event.detail}</p>
        <span className="timeline__time">{event.time}</span>
      </div>
    </li>
  );
});

const CHART_COLORS = ["#2fd8c9", "#f5a623", "#e5395b", "#7c9cff", "#34d399", "#a9bdd1"];

/* ----------------------------------------------------------------------------
   3. TOP NAVIGATION
   -------------------------------------------------------------------------- */

function TopNav({ officerName }: { officerName: string }) {
  const now = useLiveClock();
  const [menuOpen, setMenuOpen] = useState(false);

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <header className="dashboard-topnav" role="banner">
      <div className="dashboard-topnav__title">
        <span className="auth-logo">
          <ShieldAlert size={14} aria-hidden="true" />
          KSP IntelliCrime AI
        </span>
        <h1>Crime Intelligence Command Center</h1>
      </div>

      <div className="dashboard-topnav__meta">
        <div className="dashboard-topnav__clock" aria-live="off">
          <span>{dateLabel}</span>
          <strong>{timeLabel}</strong>
        </div>

        <p className="dashboard-topnav__greeting">
          Welcome back, <strong>{officerName}</strong>
        </p>

        <button className="btn-icon" aria-label="View notifications" type="button">
          <Bell size={18} aria-hidden="true" />
          <span className="notif-badge" aria-hidden="true">
            5
          </span>
        </button>

        <div className="profile-menu">
          <button
            className="profile-menu__trigger"
            type="button"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="profile-menu__avatar" aria-hidden="true">
              {officerName
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {menuOpen && (
            <ul className="profile-menu__dropdown" role="menu">
              <li role="menuitem">
                <Link to="/profile">My Profile</Link>
              </li>
              <li role="menuitem">
                <Link to="/settings">Settings</Link>
              </li>
              <li role="menuitem">
                <Link to="/logout">Sign Out</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------------
   4. HERO / AI SUMMARY
   -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="dashboard-hero fade-in" aria-label="Crime intelligence overview">
      <div className="dashboard-hero__summary">
        <span className="eyebrow">
          <Sparkles size={12} aria-hidden="true" style={{ verticalAlign: "middle", marginRight: 4 }} />
          AI Generated Insight
        </span>
        <h2>
          Reported incidents are trending <strong>4.7% higher</strong> than last week, concentrated around 3
          hotspots. AI has flagged <strong>17 critical incidents</strong> requiring immediate review.
        </h2>
        <p className="muted">
          Real-time monitoring across 12 stations · Last model refresh 4 minutes ago · Confidence 92%
        </p>
        <div className="dashboard-hero__alerts">
          <span className="auth-badge auth-badge--danger">
            <Siren size={13} aria-hidden="true" /> 2 Emergency Alerts Active
          </span>
          <span className="auth-badge">
            <Activity size={13} aria-hidden="true" /> Today's Activity: 128 FIRs
          </span>
        </div>
      </div>
      <div className="dashboard-hero__illustration auth-illustration" aria-hidden="true" />
    </section>
  );
}

/* ----------------------------------------------------------------------------
   5. STATISTICS CARDS
   -------------------------------------------------------------------------- */

function StatsGrid() {
  const stats = useDashboardStats();
  return (
    <section className="stats-grid" aria-label="Key statistics">
      {stats.map((s) => (
        <StatCard key={s.id} data={s} />
      ))}
    </section>
  );
}

/* ----------------------------------------------------------------------------
   6. CRIME ANALYTICS
   -------------------------------------------------------------------------- */

const CrimeAnalytics = memo(function CrimeAnalytics() {
  const trend = useCrimeTrendData();
  const monthly = useMonthlyStats();
  const distribution = useCrimeDistribution();

  return (
    <section className="analytics-grid" aria-label="Crime analytics">
      <div className="panel panel--chart">
        <h3>Weekly Crime Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(163,197,227,0.12)" />
            <XAxis dataKey="day" stroke="#a9bdd1" fontSize={12} />
            <YAxis stroke="#a9bdd1" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f1f33", border: "1px solid rgba(163,197,227,0.2)" }} />
            <Legend />
            <Line type="monotone" dataKey="reports" name="Reports" stroke="#2fd8c9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#f5a623" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="panel panel--chart">
        <h3>Monthly Statistics</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(163,197,227,0.12)" />
            <XAxis dataKey="month" stroke="#a9bdd1" fontSize={12} />
            <YAxis stroke="#a9bdd1" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f1f33", border: "1px solid rgba(163,197,227,0.2)" }} />
            <Bar dataKey="cases" name="Cases" fill="#2fd8c9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel panel--chart">
        <h3>Crime Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
              {distribution.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f1f33", border: "1px solid rgba(163,197,227,0.2)" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
});

/* ----------------------------------------------------------------------------
   7. HEATMAP SECTION (Leaflet)
   -------------------------------------------------------------------------- */

const riskColor = (risk: HotspotPoint["risk"]) =>
  risk === "Critical" ? "#e5395b" : risk === "High" ? "#f5a623" : "#2fd8c9";

const HeatmapSection = memo(function HeatmapSection() {
  const hotspots = useHotspots();
  const center: [number, number] = [12.9716, 77.5946];

  return (
    <section className="panel panel--map" aria-label="Crime hotspots map">
      <div className="panel__header">
        <h3>
          <MapPin size={16} aria-hidden="true" /> Crime Hotspots &amp; Risk Zones
        </h3>
        <span className="auth-badge">Live</span>
      </div>
      <div className="map-shell">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "360px", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotspots.map((h) => (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lng]}
              radius={8 + h.incidents / 4}
              pathOptions={{ color: riskColor(h.risk), fillColor: riskColor(h.risk), fillOpacity: 0.45 }}
            >
              <Popup>
                <strong>{h.label}</strong>
                <br />
                Risk: {h.risk}
                <br />
                Incidents (30d): {h.incidents}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <ul className="hotspot-legend">
        {hotspots.map((h) => (
          <li key={h.id}>
            <span className="hotspot-legend__dot" style={{ background: riskColor(h.risk) }} aria-hidden="true" />
            {h.label} <span className="muted">· {h.incidents} incidents</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

/* ----------------------------------------------------------------------------
   8. AI INTELLIGENCE PANEL
   -------------------------------------------------------------------------- */

const AIIntelligencePanel = memo(function AIIntelligencePanel() {
  const recs = useAIRecommendations();
  return (
    <section className="panel panel--ai" aria-label="AI intelligence recommendations">
      <div className="panel__header">
        <h3>
          <Sparkles size={16} aria-hidden="true" /> AI Intelligence &amp; Recommendations
        </h3>
      </div>
      <ul className="ai-rec-list">
        {recs.map((r) => (
          <li key={r.id} className={`ai-rec ai-rec--${r.severity}`}>
            <div className="ai-rec__score" aria-hidden="true">
              {r.score}
            </div>
            <div className="ai-rec__body">
              <p className="ai-rec__title">{r.title}</p>
              <p className="ai-rec__detail">{r.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});

/* ----------------------------------------------------------------------------
   9. RECENT CASES TABLE
   -------------------------------------------------------------------------- */

const RecentCasesTable = memo(function RecentCasesTable() {
  const cases = useRecentCases();
  return (
    <section className="panel panel--table" aria-label="Recent cases">
      <div className="panel__header">
        <h3>
          <ClipboardList size={16} aria-hidden="true" /> Recent Cases
        </h3>
        <Link to="/cases" className="btn-text">
          View all cases
        </Link>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Case No.</th>
              <th scope="col">Crime Type</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
              <th scope="col">Assigned Officer</th>
              <th scope="col">Created</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>{c.caseNumber}</td>
                <td>{c.crimeType}</td>
                <td>
                  <PriorityPill priority={c.priority} />
                </td>
                <td>
                  <StatusPill status={c.status} />
                </td>
                <td>{c.officer}</td>
                <td>{c.createdAt}</td>
                <td>
                  <Link to={`/cases/${c.caseNumber}`} className="btn-outline btn-sm">
                    <Eye size={14} aria-hidden="true" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

/* ----------------------------------------------------------------------------
   10. RECENT ACTIVITY TIMELINE
   -------------------------------------------------------------------------- */

const ActivityTimeline = memo(function ActivityTimeline() {
  const events = useActivityTimeline();
  return (
    <section className="panel panel--timeline" aria-label="Recent activity timeline">
      <div className="panel__header">
        <h3>
          <Activity size={16} aria-hidden="true" /> Recent Activity
        </h3>
      </div>
      <ul className="timeline">
        {events.map((e) => (
          <TimelineItem key={e.id} event={e} />
        ))}
      </ul>
    </section>
  );
});

/* ----------------------------------------------------------------------------
   11. QUICK ACTIONS
   -------------------------------------------------------------------------- */

function QuickActions() {
  const actions = [
    { label: "Register FIR", icon: FilePlus2, to: "/fir/new" },
    { label: "View Cases", icon: FolderOpen, to: "/cases" },
    { label: "Upload Evidence", icon: UploadCloud, to: "/evidence/upload" },
    { label: "AI Assistant", icon: Sparkles, to: "/ai-assistant" },
    { label: "Generate Report", icon: BarChart3, to: "/reports/new" },
    { label: "Analytics", icon: Activity, to: "/analytics" },
    { label: "Emergency Response", icon: PhoneCall, to: "/emergency" },
  ];
  return (
    <section className="panel panel--quick-actions" aria-label="Quick actions">
      <div className="panel__header">
        <h3>Quick Actions</h3>
      </div>
      <div className="quick-actions-grid">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className="quick-action">
            <span className="quick-action__icon">
              <a.icon size={18} aria-hidden="true" />
            </span>
            {a.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   12. OFFICER PANEL
   -------------------------------------------------------------------------- */

function OfficerPanel({ officerName }: { officerName: string }) {
  return (
    <section className="panel panel--officer" aria-label="Officer information">
      <div className="panel__header">
        <h3>
          <BadgeCheck size={16} aria-hidden="true" /> Officer Panel
        </h3>
      </div>
      <div className="officer-card">
        <span className="profile-menu__avatar profile-menu__avatar--lg" aria-hidden="true">
          {officerName
            .split(" ")
            .map((p) => p[0])
            .join("")}
        </span>
        <div>
          <p className="officer-card__name">{officerName}</p>
          <p className="muted">Badge No. KSP-30471 · Sector 4 Command</p>
        </div>
      </div>
      <ul className="officer-stats">
        <li>
          <span>Assigned Cases</span>
          <strong>24</strong>
        </li>
        <li>
          <span>Current Duty</span>
          <strong>06:00 – 18:00</strong>
        </li>
        <li>
          <span>Performance</span>
          <strong className="text-success">94%</strong>
        </li>
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   13. SYSTEM STATUS
   -------------------------------------------------------------------------- */

function SystemStatusPanel() {
  const status = useSystemStatus();
  return (
    <section className="panel panel--system-status" aria-label="System status">
      <div className="panel__header">
        <h3>System Status</h3>
      </div>
      <ul className="system-status">
        {status.map((s) => (
          <SystemStatusRow key={s.id} item={s} />
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   14. FLOATING AI ASSISTANT WIDGET
   -------------------------------------------------------------------------- */

function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const quickPrompts = ["Summarize today's incidents", "Show high-risk zones", "Draft FIR summary"];

  const handleAsk = useCallback((text: string) => {
    // Hook this up to your existing AI assistant API/service.
    setPrompt(text);
  }, []);

  return (
    <div className="ai-widget" role="complementary" aria-label="AI Assistant">
      {open && (
        <div className="ai-widget__panel">
          <div className="ai-widget__header">
            <span>
              <Sparkles size={15} aria-hidden="true" /> AI Assistant
            </span>
            <button type="button" className="btn-icon btn-icon--sm" aria-label="Close AI assistant" onClick={() => setOpen(false)}>
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="ai-widget__quick">
            {quickPrompts.map((q) => (
              <button key={q} type="button" className="btn-outline btn-sm" onClick={() => handleAsk(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="ai-widget__input"
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(prompt);
            }}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the AI assistant…"
              aria-label="Ask the AI assistant"
            />
            <button type="submit" className="btn-icon" aria-label="Send">
              <Send size={15} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        className="ai-widget__fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle AI assistant"
      >
        <Sparkles size={22} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   15. DASHBOARD (ROOT EXPORT)
   -------------------------------------------------------------------------- */

export function DashboardPage() {
    const officerName = "Insp. Arjun Rao";

  return (
    <div className="dashboard-shell">
      <TopNav officerName={officerName} />

      <main className="dashboard-main">
        <HeroSection />
        <StatsGrid />

        <Suspense fallback={<div className="panel panel--loading">Loading analytics…</div>}>
          <CrimeAnalytics />
        </Suspense>

        <div className="dashboard-grid-2col">
          <HeatmapSection />
          <AIIntelligencePanel />
        </div>

        <div className="dashboard-grid-2col">
          <RecentCasesTable />
          <ActivityTimeline />
        </div>

        <div className="dashboard-grid-3col">
          <QuickActions />
          <OfficerPanel officerName={officerName} />
          <SystemStatusPanel />
        </div>
      </main>

      <AIAssistantWidget />
    </div>
  );
}
export default DashboardPage;