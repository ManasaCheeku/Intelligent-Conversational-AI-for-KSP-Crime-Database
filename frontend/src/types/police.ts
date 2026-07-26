import type { Crime, CrimeStatus } from "./crime";

export interface PoliceDashboard {
    stats: {
        assigned_cases: number;
        pending_cases: number;
        under_investigation: number;
        resolved: number;
        high_priority: number;
        critical: number;
        today_assigned: number;
    };
    assigned_cases: Crime[];
    unread_notifications: number;
    notifications: Notification[];
    recent_activities: TimelineItem[];
}

export interface AssignedCases {
    items: Crime[];
    total: number;
    page: number;
    page_size: number;
}

export interface TimelineItem { // Renamed from ActivityItem for clarity
    id: number;
    event_type: string;
    detail: string | null;
    status: string | null;
    created_at: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}