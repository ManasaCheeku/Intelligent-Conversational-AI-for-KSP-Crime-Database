import api from "./api";
import type { Crime, CrimeFilters, CrimeFormValues, CrimeUpdatePayload, DashboardStats, Evidence } from "../types/crime";

const compact = (filters: CrimeFilters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined));
export const crimeService = {
  create: async (values: CrimeFormValues, files: File[]): Promise<Crime> => { const form = new FormData(); Object.entries(values).forEach(([key, value]) => form.append(key, String(value))); files.forEach((file) => form.append("files", file)); return (await api.post<Crime>("/crimes", form, { headers: { "Content-Type": "multipart/form-data" } })).data; },
  list: async (filters: CrimeFilters = {}): Promise<Crime[]> => (await api.get<Crime[]>("/crimes", { params: compact(filters) })).data,
  get: async (id: string): Promise<Crime> => (await api.get<Crime>(`/crimes/${id}`)).data,
  update: async (id: string, values: CrimeUpdatePayload): Promise<Crime> => (await api.put<Crime>(`/crimes/${id}`, values)).data,
  assignOfficer: async (id: string, officerId: number): Promise<Crime> => (await api.put<Crime>(`/crimes/${id}/assignment`, { officer_id: officerId })).data,
  remove: async (id: string): Promise<void> => { await api.delete(`/crimes/${id}`); },
  uploadEvidence: async (id: string, files: File[]): Promise<Evidence[]> => { const form = new FormData(); files.forEach((file) => form.append("files", file)); return (await api.post<Evidence[]>(`/crimes/${id}/evidence`, form, { headers: { "Content-Type": "multipart/form-data" } })).data; },
  downloadEvidence: async (url: string, filename: string): Promise<void> => { const response = await api.get(url, { responseType: "blob" }); const objectUrl = URL.createObjectURL(response.data as Blob); const anchor = document.createElement("a"); anchor.href = objectUrl; anchor.download = filename; anchor.click(); URL.revokeObjectURL(objectUrl); },
  dashboardStats: async (): Promise<DashboardStats> => (await api.get<DashboardStats>("/dashboard/stats")).data,
};
