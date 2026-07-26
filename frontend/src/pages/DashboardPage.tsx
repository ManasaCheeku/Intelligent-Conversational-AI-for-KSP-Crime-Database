import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Shield, Siren } from "lucide-react";
import { crimeService } from "../services/crimeService";
import type { DashboardStats } from "../types/crime";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/animations/Loader";

const chartData = [
  { name: 'Jan', reported: 40, resolved: 24 },
  { name: 'Feb', reported: 30, resolved: 13 },
  { name: 'Mar', reported: 48, resolved: 40 },
  { name: 'Apr', reported: 39, resolved: 32 },
  { name: 'May', reported: 52, resolved: 41 },
  { name: 'Jun', reported: 45, resolved: 38 },
];

const crimeTypeData = [
  { name: 'Theft', count: 68 },
  { name: 'Assault', count: 42 },
  { name: 'Cyber Crime', count: 55 },
  { name: 'Fraud', count: 31 },
  { name: 'Robbery', count: 25 },
  { name: 'Traffic', count: 78 },
];


const MetricCard = ({ label, value, icon: Icon, colorClass }) => (
    <div className={`crime-stat-card ${colorClass}`}>
        <div className="stat-header">
            <span className="stat-label">{label}</span>
            <Icon size={20} />
        </div>
        <div className="stat-value">{value}</div>
    </div>
);

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                const data = await crimeService.dashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        void fetchStats();
    }, []);

    return (
        <>
        <style>{`
            .stat-header { display: flex; justify-content: space-between; align-items: center; color: var(--gotham-text-secondary); }
            .dashboard-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; }
            .chart-widget { grid-column: span 12; }
            @media (min-width: 1024px) {
                .chart-widget-large { grid-column: span 8; }
                .chart-widget-small { grid-column: span 4; }
            }
        `}</style>
        <main className="page-shell">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Command Center</p>
                    <h1>Police Dashboard</h1>
                    <p>Welcome, {user?.role === 'police_officer' ? 'Officer' : 'Admin'} {user?.full_name}.</p>
                </div>
            </div>

            {loading ? (
                 <div className="content-loader-container">
                    <Loader />
                    <p>Loading intelligence dashboard...</p>
                </div>
            ) : (
            <>
                <div className="crime-stats-row">
                    <MetricCard label="New Reports Today" value={stats?.new_today ?? 12} icon={Siren} colorClass="stat-today" />
                    <MetricCard label="Pending Assignment" value={stats?.pending ?? 47} icon={Clock} colorClass="stat-pending" />
                    <MetricCard label="Critical Priority" value={stats?.critical ?? 8} icon={AlertTriangle} colorClass="stat-critical" />
                    <MetricCard label="Resolved This Month" value={stats?.resolved_month ?? 128} icon={CheckCircle} colorClass="stat-solved" />
                    <MetricCard label="AI Alerts" value={stats?.ai_alerts ?? 3} icon={Shield} colorClass="stat-ai-alerts" />
                </div>
            </>
            )}
        </main>
        </>
    );
}