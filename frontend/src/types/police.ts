import type { Crime, CrimeStatus } from "./crime";

export interface PoliceDashboard {
    // Define structure
}

export interface AssignedCases {
    items: Crime[];
    total: number;
    page: number;
    page_size: number;
}

export interface TimelineItem {
    // Define structure
}

export interface Notification {
    id: number;
    // Define structure
}