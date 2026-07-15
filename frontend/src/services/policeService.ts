import api from "./api";
import type { AssignedCases, Notification, PoliceDashboard, TimelineItem } from "../types/police";
import type { Crime, CrimeFilters, CrimeStatus } from "../types/crime";
export const policeService = {
  dashboard: async (): Promise<PoliceDashboard> => (await api.get("/dashboard/police")).data,
  cases: async (filters: CrimeFilters & { page?: number; page_size?: number } = {}): Promise<AssignedCases> => (await api.get("/crimes/assigned", { params: filters })).data,
  updateStatus: async (id: number, status: CrimeStatus, remark?: string): Promise<Crime> => (await api.put(`/crimes/${id}/status`, { status, remark })).data,
  startInvestigation: async (id: number, action_taken?: string, recommendation?: string) => api.post(`/crimes/${id}/investigation`, { action_taken, recommendation }),
  addNote: async (id: number, note: string) => api.post(`/crimes/${id}/notes`, { note, visibility: "internal" }),
  timeline: async (id: number): Promise<TimelineItem[]> => (await api.get(`/crimes/${id}/timeline`)).data,
  notifications: async (): Promise<Notification[]> => (await api.get("/notifications")).data,
  markRead: async (id: number): Promise<Notification> => (await api.post(`/notifications/${id}/read`)).data,
  ai: async (id: number, language: string): Promise<{ analysis: string; language: string }> => (await api.post(`/crimes/${id}/investigation/ai`, null, { params: { language } })).data,
};
