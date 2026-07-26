export const crimeTypes = ["theft", "assault", "robbery", "fraud", "cyber_crime", "drug_offense", "murder", "kidnapping", "domestic_violence", "traffic_violation"] as const;
export type CrimeType = typeof crimeTypes[number];

export const crimeStatuses = ["pending", "assigned", "under_investigation", "evidence_collection", "awaiting_approval", "resolved", "rejected"] as const;
export type CrimeStatus = typeof crimeStatuses[number];

export const priorities = ["low", "medium", "high", "critical"] as const;
export type Priority = typeof priorities[number];

export interface Evidence {
    id: number;
    original_filename: string;
    content_type: string;
    file_size: number;
    uploaded_at: string;
    download_url: string;
}

export interface Crime {
    id: number;
    crime_number: string;
    title: string;
    description: string;
    crime_type: CrimeType;
    status: CrimeStatus;
    priority: Priority;
    location: string;
    district: string;
    state: string;
    latitude: number;
    longitude: number;
    incident_date: string;
    incident_time: string;
    created_at: string;
    updated_at: string;
    citizen_id: number;
    assigned_officer_id: number | null;
    assigned_at: string | null;
    evidence_items?: Evidence[];
}

export type CrimeFormValues = Omit<Crime, "id" | "crime_number" | "status" | "priority" | "created_at" | "updated_at" | "citizen_id" | "assigned_officer_id" | "assigned_at" | "evidence_items">;

export type CrimeUpdatePayload = Partial<Pick<Crime, "status" | "priority">>;

export type CrimeFilters = Partial<Pick<Crime, "crime_type" | "status" | "priority" | "district" | "incident_date"> & { query?: string }>;

export interface DashboardStats {
    [key: string]: number;
}

export const labelize = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());