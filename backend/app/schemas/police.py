from datetime import datetime
from pydantic import BaseModel, Field


class InvestigationCreate(BaseModel):
    action_taken: str | None = Field(default=None, max_length=5000)
    recommendation: str | None = Field(default=None, max_length=5000)


class InvestigationNoteCreate(BaseModel):
    note: str = Field(min_length=2, max_length=5000)
    visibility: str = "internal"


class StatusUpdate(BaseModel):
    status: str
    remark: str | None = Field(default=None, max_length=2000)


class TimelineItem(BaseModel):
    id: int
    event_type: str
    status: str | None
    detail: str | None
    created_at: datetime


class NotificationResponse(BaseModel):
    id: int
    notification_type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime


class PoliceDashboardResponse(BaseModel):
    stats: dict[str, int]
    assigned_cases: list[dict]
    recent_activities: list[TimelineItem]
    notifications: list[NotificationResponse]
    unread_notifications: int
