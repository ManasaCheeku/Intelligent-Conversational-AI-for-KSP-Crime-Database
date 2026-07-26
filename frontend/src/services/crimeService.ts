import api from "./api";
import type { Crime, CrimeFilters, CrimeFormValues, CrimeUpdatePayload, DashboardStats, Evidence } from "../types/crime";

export const crimeService = {
  create: async (values: CrimeFormValues, files: File[]): Promise<Crime> => { const form = new FormData(); Object.entries(values).forEach(([key, value]) => form.append(key, String(value))); files.forEach((file) => form.append("files", file)); return (await api.post<Crime>("/crimes", form, { headers: { "Content-Type": "multipart/form-data" } })).data; },
  list: async (filters: CrimeFilters = {}): Promise<Crime[]> => (await api.get<Crime[]>("/crimes", { params: Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)) })).data,
  get: async (id: string): Promise<Crime> => (await api.get<Crime>(`/crimes/${id}`)).data,
  update: async (id: string, values: CrimeUpdatePayload): Promise<Crime> => (await api.put<Crime>(`/crimes/${id}`, values)).data,
  assignOfficer: async (id: string, officerId: number): Promise<Crime> => (await api.put<Crime>(`/crimes/${id}/assignment`, { officer_id: officerId })).data,
  dashboardStats: async (): Promise<DashboardStats> => (await api.get<DashboardStats>("/dashboard/stats")).data,
};