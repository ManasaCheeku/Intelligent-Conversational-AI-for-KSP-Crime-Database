import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CrimeForm } from "../components/crime/CrimeForm";
import { crimeService } from "../services/crimeService";
import type { CrimeFormValues } from "../types/crime";
export function ReportCrimePage() { const navigate = useNavigate(); const submit = async (values: CrimeFormValues, files: File[]) => { const crime = await crimeService.create(values, files); toast.success(`Crime report ${crime.crime_number} submitted.`); navigate(`/crimes/${crime.id}`); }; return <main className="page-shell"><div className="page-heading"><p className="eyebrow">Citizen reporting</p><h1>Report a crime</h1><p>Provide accurate details. Your report will be securely sent to Karnataka State Police.</p></div><CrimeForm onSubmit={submit} submitLabel="Submit crime report" /></main>; }
