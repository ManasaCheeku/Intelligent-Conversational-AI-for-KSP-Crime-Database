import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import { crimeService } from "../../services/crimeService";
import type { Officer } from "../../types/admin";

interface Props { crimeId: string; assignedOfficerId: number | null; onAssigned: () => Promise<void>; }

export function OfficerAssignment({ crimeId, assignedOfficerId, onAssigned }: Props) {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [query, setQuery] = useState("");
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | null>(assignedOfficerId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);
  useEffect(() => { const load = async () => { try { setLoading(true); setOfficers(await adminService.listOfficers()); } catch { setError("Active officers could not be loaded."); } finally { setLoading(false); } }; void load(); }, []);
  const officersToShow = useMemo(() => officers.filter((officer) => `${officer.full_name} ${officer.badge_number || ""} ${officer.station || ""} ${officer.district || ""}`.toLowerCase().includes(query.toLowerCase())), [officers, query]);
  const selected = officers.find((officer) => officer.id === selectedOfficerId);
  const assign = async () => { if (!selectedOfficerId) return; setAssigning(true); try { await crimeService.assignOfficer(crimeId, selectedOfficerId); await onAssigned(); window.dispatchEvent(new Event("ksp-crime-assignment-updated")); toast.success(`${selected?.full_name || "Officer"} has been assigned.`); } catch { toast.error("Officer assignment could not be completed."); } finally { setAssigning(false); } };
  return <section className="detail-card assignment-panel"><div className="assignment-title"><ShieldCheck size={22} /><div><h2>Assign investigating officer</h2><p>Select an active police officer for this report.</p></div></div>{loading ? <p>Loading active officers…</p> : error ? <p className="form-error">{error}</p> : <><label className="officer-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, badge, station, or district" disabled={assigning} /></label><div className="officer-options">{officersToShow.length ? officersToShow.map((officer) => <button type="button" className={selectedOfficerId === officer.id ? "officer-option selected" : "officer-option"} onClick={() => setSelectedOfficerId(officer.id)} disabled={assigning} key={officer.id}><strong>{officer.full_name}</strong><span>{officer.rank || "Police Officer"}{officer.badge_number ? ` · Badge ${officer.badge_number}` : ""}</span><small>{officer.station || "Station not recorded"} · {officer.district || "District not recorded"}</small></button>) : <p className="no-officers">No active officers match your search.</p>}</div><button className="primary-button" onClick={() => void assign()} disabled={!selectedOfficerId || assigning}>{assigning ? "Assigning officer…" : selectedOfficerId === assignedOfficerId ? "Confirm assignment" : "Assign officer"}</button></>}</section>;
}
