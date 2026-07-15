import type { Crime } from "./crime";
export interface TimelineItem { id: number; event_type: string; status: string | null; detail: string | null; created_at: string; }
export interface Notification { id: number; notification_type: string; title: string; message: string; is_read: boolean; created_at: string; }
export interface PoliceDashboard { stats: Record<string, number>; assigned_cases: Crime[]; recent_activities: TimelineItem[]; notifications: Notification[]; unread_notifications: number; }
export interface AssignedCases { items: Crime[]; total: number; page: number; page_size: number; }
