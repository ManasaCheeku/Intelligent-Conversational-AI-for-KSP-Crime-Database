from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services import crime_service
from app.services.auth_service import get_current_active_user
from app.models.user import User
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # This would eventually call a dedicated dashboard service
    # For now, we can mock a response or perform a simple query.
    return {"total": 100, "pending": 47, "assigned": 20, "under_investigation": 15, "resolved": 18}