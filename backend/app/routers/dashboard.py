from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.database import get_db
from app.models.crime import Crime
from app.models.user import User
from app.schemas.auth import UserRole
from app.schemas.dashboard import DashboardStats
from app.schemas.police import PoliceDashboardResponse
from app.models.investigation import CaseStatusHistory
from app.models.notification import Notification
from app.services.crime_service import serialize_crime

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Crime.status, func.count(Crime.id)).group_by(Crime.status)
    if current_user.role == UserRole.CITIZEN.value:
        query = query.filter(Crime.citizen_id == current_user.id)
    elif current_user.role == UserRole.POLICE_OFFICER.value:
        query = query.filter(Crime.assigned_officer_id == current_user.id)
    counts = dict(query.all())
    return DashboardStats(total=sum(counts.values()), pending=counts.get("pending", 0), assigned=counts.get("assigned", 0), under_investigation=counts.get("under_investigation", 0), resolved=counts.get("resolved", 0))


@router.get("/police", response_model=PoliceDashboardResponse)
def get_police_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.POLICE_OFFICER.value: raise HTTPException(status_code=403, detail="Police officer access required")
    base = db.query(Crime).filter(Crime.assigned_officer_id == current_user.id)
    statuses = dict(base.with_entities(Crime.status, func.count(Crime.id)).group_by(Crime.status).all())
    stats = {"assigned_cases": sum(statuses.values()), "pending_cases": statuses.get("assigned", 0), "under_investigation": statuses.get("under_investigation", 0), "resolved": statuses.get("resolved", 0), "high_priority": base.filter(Crime.priority == "high").count(), "critical": base.filter(Crime.priority == "critical").count(), "today_assigned": base.filter(func.date(Crime.assigned_at) == func.date("now")).count()}
    cases = [serialize_crime(item) for item in base.order_by(Crime.assigned_at.desc()).limit(8).all()]
    history = db.query(CaseStatusHistory).join(Crime).filter(Crime.assigned_officer_id == current_user.id).order_by(CaseStatusHistory.created_at.desc()).limit(12).all()
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(8).all()
    return {"stats": stats, "assigned_cases": cases, "recent_activities": history, "notifications": notifications, "unread_notifications": sum(not item.is_read for item in notifications)}
