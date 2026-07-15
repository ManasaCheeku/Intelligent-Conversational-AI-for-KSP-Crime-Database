from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from app.models.crime import Crime
from app.models.investigation import CaseStatusHistory, Investigation, InvestigationNote
from app.models.notification import Notification
from app.models.user import User
from app.schemas.police import TimelineItem

OFFICER_STATUSES = {"assigned", "under_investigation", "evidence_collection", "awaiting_approval", "resolved", "rejected"}


def record_event(db: Session, crime_id: int, actor_id: int, event_type: str, status: str | None = None, detail: str | None = None) -> None:
    db.add(CaseStatusHistory(crime_id=crime_id, actor_id=actor_id, event_type=event_type, status=status, detail=detail))


def ensure_investigation(db: Session, crime: Crime, officer: User) -> Investigation:
    investigation = db.query(Investigation).filter(Investigation.crime_id == crime.id, Investigation.officer_id == officer.id).first()
    if not investigation:
        investigation = Investigation(crime_id=crime.id, officer_id=officer.id, status=crime.status)
        db.add(investigation); db.flush()
        record_event(db, crime.id, officer.id, "investigation_started", crime.status, "Investigation workspace started")
    return investigation


def police_cases(db: Session, officer: User, query: str | None = None, crime_type: str | None = None, district: str | None = None, case_status: str | None = None, priority: str | None = None, start_date=None, end_date=None, page: int = 1, page_size: int = 20):
    records = db.query(Crime).join(User, Crime.citizen_id == User.id).filter(Crime.assigned_officer_id == officer.id)
    if query: records = records.filter(or_(Crime.crime_number.ilike(f"%{query}%"), User.full_name.ilike(f"%{query}%"), Crime.title.ilike(f"%{query}%")))
    if crime_type: records = records.filter(Crime.crime_type == crime_type)
    if district: records = records.filter(Crime.district.ilike(f"%{district}%"))
    if case_status: records = records.filter(Crime.status == case_status)
    if priority: records = records.filter(Crime.priority == priority)
    if start_date: records = records.filter(Crime.incident_date >= start_date)
    if end_date: records = records.filter(Crime.incident_date <= end_date)
    total = records.count(); items = records.order_by(Crime.priority.desc(), Crime.assigned_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total
