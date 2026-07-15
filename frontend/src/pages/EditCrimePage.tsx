import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CrimeForm } from "../components/crime/CrimeForm";
import { crimeService } from "../services/crimeService";
import type { Crime, CrimeFormValues } from "../types/crime";
export function EditCrimePage() { const { id = "" } = useParams(); const navigate = useNavigate(); const [crime, setCrime] = useState<Crime | null>(null); useEffect(() => { void crimeService.get(id).then(setCrime).catch(() => toast.error("Report could not be loaded.")); }, [id]); if (!crime) return <div className="content-loader">Loading report…</div>; const submit = async (values: CrimeFormValues, files: File[]) => { await crimeService.update(id, values); if (files.length) await crimeService.uploadEvidence(id, files); toast.success("Crime report updated."); navigate(`/crimes/${id}`); }; return <main className="page-shell"><div className="page-heading"><p className="eyebrow">Report {crime.crime_number}</p><h1>Edit crime report</h1><p>You can edit this report until it has been assigned for investigation.</p></div><CrimeForm initialCrime={crime} onSubmit={submit} submitLabel="Save report changes" /></main>; }
