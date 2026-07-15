import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Edit3, MapPin, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { CrimeTimeline } from "../components/crime/CrimeTimeline";
import { EvidenceUpload } from "../components/crime/EvidenceUpload";
import { OfficerAssignment } from "../components/crime/OfficerAssignment";
import { AIInvestigationAssistant } from "../components/crime/AIInvestigationAssistant";
import { crimeService } from "../services/crimeService";
import { labelize, type Crime, type CrimePriority, type CrimeStatus } from "../types/crime";
import { useAuth } from "../context/AuthContext";

export function CrimeDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crime, setCrime] = useState<Crime | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<CrimeStatus>("pending");
  const [priority, setPriority] = useState<CrimePriority>("medium");
  const load = async () => {
    try {
      const data = await crimeService.get(id);
      setCrime(data); setNotes(data.investigation_notes || ""); setStatus(data.status); setPriority(data.priority);
    } catch { toast.error("Crime report could not be loaded."); }
  };
  useEffect(() => { void load(); }, [id]);
  if (!crime) return <div className="content-loader">Loading report…</div>;
  const editable = user?.role === "citizen" && crime.status === "pending" && !crime.assigned_officer_id;
  const upload = async () => { if (!files.length) return; try { await crimeService.uploadEvidence(id, files); setFiles([]); toast.success("Evidence uploaded."); await load(); } catch { toast.error("Evidence could not be uploaded."); } };
  const updateInvestigation = async () => { try { await crimeService.update(id, { status, priority, investigation_notes: notes }); toast.success("Investigation update saved."); await load(); } catch { toast.error("Investigation update could not be saved."); } };
  const remove = async () => { if (!window.confirm("Permanently delete this crime report and its evidence?")) return; try { await crimeService.remove(id); toast.success("Crime report deleted."); navigate("/crimes"); } catch { toast.error("Crime report could not be deleted."); } };
  return <main className="page-shell"><div className="page-heading page-actions"><div><p className="eyebrow">{crime.crime_number}</p><h1>{crime.title}</h1><p><span className={`status ${crime.status}`}>{labelize(crime.status)}</span> · {labelize(crime.crime_type)}</p></div><div className="button-row">{editable && <Link className="secondary-button" to={`/crimes/${id}/edit`}><Edit3 size={16} /> Edit</Link>}{user?.role === "admin" && <button className="danger-button" onClick={() => void remove()}><Trash2 size={16} /> Delete</button>}</div></div><div className="details-grid"><section className="detail-card"><h2>Incident details</h2><dl><dt>Date and time</dt><dd>{crime.incident_date} · {crime.incident_time}</dd><dt>Location</dt><dd><MapPin size={16} /> {crime.location}, {crime.district}, {crime.state}</dd><dt>Coordinates</dt><dd>{crime.latitude.toFixed(6)}, {crime.longitude.toFixed(6)}</dd><dt>Priority</dt><dd>{labelize(crime.priority)}</dd>{crime.assigned_at && <><dt>Assigned at</dt><dd>{new Date(crime.assigned_at).toLocaleString()}</dd></>}</dl><h2>Description</h2><p className="prose">{crime.description}</p></section><CrimeTimeline crime={crime} /></div><section className="detail-card evidence-section"><h2>Evidence</h2>{crime.evidence_items.length ? <ul className="evidence-list">{crime.evidence_items.map((item) => <li key={item.id}><span>{item.original_filename} <small>{(item.file_size / 1024 / 1024).toFixed(1)} MB</small></span><button className="text-button" onClick={() => void crimeService.downloadEvidence(item.download_url, item.original_filename)}><Download size={16} /> Download</button></li>)}</ul> : <p>No evidence uploaded.</p>}{(editable || user?.role === "police_officer" || user?.role === "admin") && <><EvidenceUpload files={files} onChange={setFiles} /><button className="secondary-button" onClick={() => void upload()} disabled={!files.length}>Upload evidence</button></>}</section>{user?.role === "admin" && <OfficerAssignment crimeId={id} assignedOfficerId={crime.assigned_officer_id} onAssigned={load} />}{user?.role === "police_officer" && <><section className="detail-card investigation"><h2>Investigation update</h2><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as CrimeStatus)}>{["assigned", "under_investigation", "evidence_collection", "awaiting_approval", "resolved", "rejected"].map((value) => <option key={value} value={value}>{labelize(value)}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as CrimePriority)}>{["low", "medium", "high", "critical"].map((value) => <option key={value} value={value}>{labelize(value)}</option>)}</select></label><label>Investigation notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} /></label><button className="primary-button" onClick={() => void updateInvestigation()}>Save investigation update</button></section><AIInvestigationAssistant crimeId={crime.id} /></>}</main>;
}
