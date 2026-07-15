from pydantic import BaseModel


class DashboardStats(BaseModel):
    total: int
    pending: int
    assigned: int
    under_investigation: int
    resolved: int
