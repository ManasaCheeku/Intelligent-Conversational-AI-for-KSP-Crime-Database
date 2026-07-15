export type CrimeType = "theft" | "robbery" | "assault" | "cyber_crime" | "missing_person" | "domestic_violence" | "drug_offense" | "traffic_violation" | "fraud" | "murder" | "kidnapping" | "other";
export type CrimeStatus = "pending" | "under_investigation" | "evidence_collection" | "awaiting_approval" | "assigned" | "resolved" | "rejected";
export type CrimePriority = "low" | "medium" | "high" | "critical";
export interface Evidence { id: number; original_filename: string; content_type: string; file_size: number; uploaded_at: string; download_url: string; }
export interface Crime { id: number; crime_number: string; title: string; crime_type: CrimeType; description: string; status: CrimeStatus; priority: CrimePriority; location: string; district: string; state: string; latitude: number; longitude: number; incident_date: string; incident_time: string; citizen_id: number; assigned_officer_id: number | null; assigned_at: string | null; investigation_notes: string | null; created_at: string; updated_at: string; evidence_items: Evidence[]; }
export interface CrimeFormValues { title: string; crime_type: CrimeType; description: string; location: string; district: string; state: string; latitude: number; longitude: number; incident_date: string; incident_time: string; }
export interface CrimeUpdatePayload extends Partial<CrimeFormValues> { status?: CrimeStatus; priority?: CrimePriority; investigation_notes?: string; }
export interface CrimeFilters { query?: string; crime_type?: CrimeType | ""; status?: CrimeStatus | ""; priority?: CrimePriority | ""; district?: string; incident_date?: string; citizen_id?: string; officer_id?: string; }
export interface DashboardStats { total: number; pending: number; assigned: number; under_investigation: number; resolved: number; }
export const crimeTypes: CrimeType[] = ["theft", "robbery", "assault", "cyber_crime", "missing_person", "domestic_violence", "drug_offense", "traffic_violation", "fraud", "murder", "kidnapping", "other"];
export const crimeStatuses: CrimeStatus[] = ["pending", "under_investigation", "evidence_collection", "awaiting_approval", "assigned", "resolved", "rejected"];
export const priorities: CrimePriority[] = ["low", "medium", "high", "critical"];
export const labelize = (value: string): string => value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
