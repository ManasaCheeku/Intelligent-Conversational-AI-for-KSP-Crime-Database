import { useCallback, useEffect, useState } from "react";
import { ClipboardPlus, FileSearch, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { crimeService } from "../services/crimeService";
import type { DashboardStats } from "../types/crime";
import { PoliceDashboardPage } from "./PoliceDashboardPage";

export function DashboardPage() {
  const { user, logout } = useAuth();
  if (user?.role === "police_officer") return <PoliceDashboardPage />;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const loadStats = useCallback(async () => { try { setStats(await crimeService.dashboardStats()); } catch { setStats(null); } }, []);
  useEffect(() => { void loadStats(); window.addEventListener("ksp-crime-assignment-updated", loadStats); return () => window.removeEventListener("ksp-crime-assignment-updated", loadStats); }, [loadStats]);
  return <main className="dashboard"><header><div><p className="eyebrow">Secure workspace</p><h1>Welcome, {user?.full_name}</h1><p>Your authenticated role: <strong>{user?.role.replace("_", " ")}</strong></p></div><button className="secondary-button" onClick={() => void logout()}><LogOut size={17} /> Logout</button></header><section className="status-card"><ShieldCheck size={28} /><div><h2>Crime Reporting is ready</h2><p>Submit, track, search, and securely manage authorized crime reports.</p><div className="button-row">{user?.role === "citizen" && <Link className="primary-button" to="/crimes/report"><ClipboardPlus size={17} /> Report crime</Link>}<Link className="secondary-button" to="/crimes"><FileSearch size={17} /> View reports</Link></div></div></section>{stats && <section className="stats-grid"><article><strong>{stats.total}</strong><span>Total reports</span></article><article><strong>{stats.pending}</strong><span>Pending</span></article><article><strong>{stats.assigned}</strong><span>Assigned</span></article><article><strong>{stats.under_investigation}</strong><span>Under investigation</span></article><article><strong>{stats.resolved}</strong><span>Resolved</span></article></section>}</main>;
}
