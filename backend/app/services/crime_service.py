from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload
from app.models.crime import Crime, Evidence
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.services.police_service import record_event
from app.models.user import User
from app.schemas.auth import UserRole
from app.schemas.crime import CrimeCreate, CrimeUpdate
from app.services.evidence_storage import save_evidence_file


def crime_query(db: Session):
    return db.query(Crime).options(selectinload(Crime.evidence_items))


def serialize_crime(crime: Crime) -> dict:
    data = {column.name: getattr(crime, column.name) for column in Crime.__table__.columns}
    data["evidence_items"] = [{"id": item.id, "original_filename": item.original_filename, "content_type": item.content_type, "file_size": item.file_size, "uploaded_at": item.uploaded_at, "download_url": f"/crimes/{crime.id}/evidence/{item.id}"} for item in crime.evidence_items]
    return data


def generate_crime_number(db: Session) -> str:
    prefix = f"KSP-{datetime.now(timezone.utc).year}-"
    latest = db.query(Crime.crime_number).filter(Crime.crime_number.like(f"{prefix}%")).order_by(Crime.id.desc()).first()
    sequence = int(latest[0].rsplit("-", 1)[1]) + 1 if latest else 1
    return f"{prefix}{sequence:06d}"


def create_crime(db: Session, payload: CrimeCreate, citizen: User) -> Crime:
    duplicate = db.query(Crime).filter(Crime.citizen_id == citizen.id, Crime.title == payload.title, Crime.incident_date == payload.incident_date, Crime.incident_time == payload.incident_time, Crime.created_at >= datetime.now(timezone.utc) - timedelta(minutes=10)).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A matching complaint was submitted recently")
    crime = Crime(crime_number=generate_crime_number(db), citizen_id=citizen.id, **payload.model_dump())
    db.add(crime); db.commit(); db.refresh(crime)
    return crime


def get_crime_or_404(db: Session, crime_id: int) -> Crime:
    crime = crime_query(db).filter(Crime.id == crime_id).first()
    if not crime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crime report not found")
    return crime


def can_access(crime: Crime, user: User) -> bool:
    return user.role == UserRole.ADMIN.value or crime.citizen_id == user.id or (user.role == UserRole.POLICE_OFFICER.value and crime.assigned_officer_id == user.id)


def ensure_access(crime: Crime, user: User) -> None:
    if not can_access(crime, user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this report")


def list_crimes(db: Session, user: User, *, query: str | None = None, crime_type: str | None = None, crime_status: str | None = None, priority: str | None = None, district: str | None = None, incident_date: date | None = None, citizen_id: int | None = None, officer_id: int | None = None) -> list[Crime]:
    records = crime_query(db)
    if user.role == UserRole.CITIZEN.value: records = records.filter(Crime.citizen_id == user.id)
    elif user.role == UserRole.POLICE_OFFICER.value: records = records.filter(Crime.assigned_officer_id == user.id)
    if query: records = records.filter(or_(Crime.crime_number.ilike(f"%{query}%"), Crime.title.ilike(f"%{query}%"), Crime.description.ilike(f"%{query}%")))
    if crime_type: records = records.filter(Crime.crime_type == crime_type)
    if crime_status: records = records.filter(Crime.status == crime_status)
    if priority: records = records.filter(Crime.priority == priority)
    if district: records = records.filter(Crime.district.ilike(f"%{district}%"))
    if incident_date: records = records.filter(Crime.incident_date == incident_date)
    if citizen_id and user.role == UserRole.ADMIN.value: records = records.filter(Crime.citizen_id == citizen_id)
    if officer_id and user.role == UserRole.ADMIN.value: records = records.filter(Crime.assigned_officer_id == officer_id)
    return records.order_by(Crime.created_at.desc()).all()


def update_crime(db: Session, crime: Crime, payload: CrimeUpdate, user: User) -> Crime:
    values = payload.model_dump(exclude_unset=True)
    if user.role == UserRole.CITIZEN.value:
        if crime.citizen_id != user.id or crime.status != "pending" or crime.assigned_officer_id is not None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Reports can only be edited before assignment")
        prohibited = {"status", "priority", "investigation_notes"}
        if prohibited & values.keys(): raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Citizens cannot change case management fields")
    elif user.role == UserRole.POLICE_OFFICER.value:
        if crime.assigned_officer_id != user.id: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This report is not assigned to you")
        allowed = {"status", "priority", "investigation_notes"}
        if set(values) - allowed: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Officers may update only status, priority, and investigation notes")
    for name, value in values.items(): setattr(crime, name, value.value if hasattr(value, "value") else value)
    db.commit(); db.refresh(crime)
    return get_crime_or_404(db, crime.id)


async def add_evidence(db: Session, crime: Crime, user: User, files: list[UploadFile]) -> list[Evidence]:
    ensure_access(crime, user)
    if user.role == UserRole.CITIZEN.value and (crime.citizen_id != user.id or crime.assigned_officer_id is not None):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Evidence can be added only before a report is assigned")
    saved: list[Evidence] = []
    try:
        for file in files:
            original_name, stored_name, file_size, storage_path = await save_evidence_file(file)
            item = Evidence(crime_id=crime.id, original_filename=original_name, stored_filename=stored_name, content_type=file.content_type, file_size=file_size, storage_path=storage_path)
            db.add(item); saved.append(item)
            record_event(db, crime.id, user.id, "evidence_uploaded", crime.status, f"Evidence uploaded: {original_name}")
        db.commit()
        for item in saved: db.refresh(item)
        return saved
    except Exception:
        db.rollback()
        for item in saved: Path(item.storage_path).unlink(missing_ok=True)
        raise


def delete_crime(db: Session, crime: Crime) -> None:
    for item in crime.evidence_items: Path(item.storage_path).unlink(missing_ok=True)
    db.delete(crime); db.commit()


def assign_officer(db: Session, crime: Crime, officer_id: int, admin: User) -> Crime:
    officer = db.get(User, officer_id)
    if not officer or not officer.is_active or officer.role != UserRole.POLICE_OFFICER.value:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="The selected officer is unavailable for assignment")
    previous_officer_id = crime.assigned_officer_id
    crime.assigned_officer_id = officer.id
    crime.assigned_at = datetime.now(timezone.utc)
    if crime.status == "pending": crime.status = "assigned"
    action = "crime_reassigned" if previous_officer_id else "crime_assigned"
    db.add(AuditLog(actor_user_id=admin.id, crime_id=crime.id, action=action, details=f"Assigned crime {crime.crime_number} to officer {officer.id}"))
    db.add(Notification(user_id=officer.id, notification_type="crime_assignment", title="New crime report assigned", message=f"{crime.crime_number}: {crime.title} has been assigned to you."))
    db.add(Notification(user_id=crime.citizen_id, notification_type="crime_assignment", title="Your report has been assigned", message=f"{crime.crime_number} has been assigned to an investigating officer."))
    record_event(db, crime.id, admin.id, action, crime.status, f"Assigned to officer {officer.full_name}")
    db.commit()
    return get_crime_or_404(db, crime.id)
