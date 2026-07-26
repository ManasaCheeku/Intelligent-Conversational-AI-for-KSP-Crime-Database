import api from "./api";
import type { Officer } from "../types/admin";

export const adminService = { listOfficers: async (): Promise<Officer[]> => (await api.get<Officer[]>("/admin/officers")).data };