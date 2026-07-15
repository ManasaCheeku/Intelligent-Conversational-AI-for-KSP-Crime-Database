from datetime import date
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_roles
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import UserRole
from app.schemas.crime import CrimeAssignment, CrimeCreate, CrimeResponse, CrimeUpdate, EvidenceResponse
from app.schemas.police import InvestigationCreate, InvestigationNoteCreate, StatusUpdate, TimelineItem
from app.models.investigation import CaseStatusHistory, InvestigationNote
from app.services.gemini_service import generate_investigation_insight
from app.services.police_service import OFFICER_STATUSES, ensure_investigation, police_cases, record_event
from app.services.crime_service import add_evidence, assign_officer, create_crime, delete_crime, ensure_access, get_crime_or_404, list_crimes, serialize_crime, update_crime

router = APIRouter(prefix="/crimes", tags=["Crime Reporting"])

@router.get("/assigned", response_model=dict)
def assigned_cases(query: str | None = None, crime_type: str | None = None, district: str | None = None, case_status: str | None = Query(default=None, alias="status"), priority: str | None = None, start_date: date | None = None, end_date: date | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.POLICE_OFFICER.value: raise HTTPException(status_code=403, detail="Police officer access required")
    cases, total = police_cases(db, current_user, query, crime_type, district, case_status, priority, start_date, end_date, page, page_size)
    return {"items": [serialize_crime(case) for case in cases], "total": total, "page": page, "page_size": page_size}

@router.post("", response_model=CrimeResponse, status_code=status.HTTP_201_CREATED)
async def report_crime(title: str = Form(...), crime_type: str = Form(...), description: str = Form(...), location: str = Form(...), district: str = Form(...), state: str = Form(...), latitude: float = Form(...), longitude: float = Form(...), incident_date: date = Form(...), incident_time: str = Form(...), files: list[UploadFile] = File(default=[]), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.CITIZEN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only citizens may create crime reports")
    payload = CrimeCreate(title=title, crime_type=crime_type, description=description, location=location, district=district, state=state, latitude=latitude, longitude=longitude, incident_date=incident_date, incident_time=incident_time)
    crime = create_crime(db, payload, current_user)
    if files: await add_evidence(db, crime, current_user, files)
    return serialize_crime(get_crime_or_404(db, crime.id))

@router.get("", response_model=list[CrimeResponse])
def get_crimes(query: str | None = None, crime_type: str | None = None, crime_status: str | None = Query(default=None, alias="status"), priority: str | None = None, district: str | None = None, incident_date: date | None = None, citizen_id: int | None = None, officer_id: int | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [serialize_crime(crime) for crime in list_crimes(db, current_user, query=query, crime_type=crime_type, crime_status=crime_status, priority=priority, district=district, incident_date=incident_date, citizen_id=citizen_id, officer_id=officer_id)]

@router.get("/my", response_model=list[CrimeResponse])
def get_my_crimes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [serialize_crime(crime) for crime in list_crimes(db, current_user)]

@router.get("/search", response_model=list[CrimeResponse])
def search_crimes(q: str = Query(min_length=1), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [serialize_crime(crime) for crime in list_crimes(db, current_user, query=q)]

@router.get("/filter", response_model=list[CrimeResponse])
def filter_crimes(crime_type: str | None = None, crime_status: str | None = Query(default=None, alias="status"), priority: str | None = None, district: str | None = None, incident_date: date | None = None, citizen_id: int | None = None, officer_id: int | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [serialize_crime(crime) for crime in list_crimes(db, current_user, crime_type=crime_type, crime_status=crime_status, priority=priority, district=district, incident_date=incident_date, citizen_id=citizen_id, officer_id=officer_id)]

@router.get("/{crime_id}", response_model=CrimeResponse)
def get_crime(crime_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id); ensure_access(crime, current_user); return serialize_crime(crime)

@router.put("/{crime_id}", response_model=CrimeResponse)
def edit_crime(crime_id: int, payload: CrimeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id); return serialize_crime(update_crime(db, crime, payload, current_user))

@router.put("/{crime_id}/status", response_model=CrimeResponse)
def update_case_status(crime_id: int, payload: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id)
    if current_user.role != UserRole.POLICE_OFFICER.value or crime.assigned_officer_id != current_user.id: raise HTTPException(status_code=403, detail="This case is not assigned to you")
    if payload.status not in OFFICER_STATUSES: raise HTTPException(status_code=422, detail="Invalid investigation status")
    investigation = ensure_investigation(db, crime, current_user); crime.status = payload.status; investigation.status = payload.status
    if payload.remark: investigation.notes = payload.remark
    record_event(db, crime.id, current_user.id, "status_changed", payload.status, payload.remark); db.commit()
    return serialize_crime(get_crime_or_404(db, crime.id))

@router.post("/{crime_id}/investigation", response_model=dict)
def start_investigation(crime_id: int, payload: InvestigationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id)
    if current_user.role != UserRole.POLICE_OFFICER.value or crime.assigned_officer_id != current_user.id: raise HTTPException(status_code=403, detail="This case is not assigned to you")
    item = ensure_investigation(db, crime, current_user); item.action_taken = payload.action_taken; item.recommendation = payload.recommendation
    if crime.status == "assigned": crime.status = "under_investigation"; item.status = crime.status
    db.commit(); db.refresh(item); return {"id": item.id, "status": item.status}

@router.post("/{crime_id}/notes", response_model=dict)
def add_investigation_note(crime_id: int, payload: InvestigationNoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id)
    if current_user.role != UserRole.POLICE_OFFICER.value or crime.assigned_officer_id != current_user.id: raise HTTPException(status_code=403, detail="This case is not assigned to you")
    investigation = ensure_investigation(db, crime, current_user); note = InvestigationNote(investigation_id=investigation.id, author_id=current_user.id, note=payload.note, visibility=payload.visibility)
    db.add(note); record_event(db, crime.id, current_user.id, "officer_note", crime.status, payload.note); db.commit(); db.refresh(note); return {"id": note.id, "created_at": note.created_at}

@router.get("/{crime_id}/timeline", response_model=list[TimelineItem])
def get_timeline(crime_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id); ensure_access(crime, current_user)
    return db.query(CaseStatusHistory).filter(CaseStatusHistory.crime_id == crime.id).order_by(CaseStatusHistory.created_at.asc()).all()

@router.post("/{crime_id}/investigation/ai", response_model=dict)
def ai_investigation_summary(crime_id: int, language: str = "English", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id)
    if current_user.role != UserRole.POLICE_OFFICER.value or crime.assigned_officer_id != current_user.id: raise HTTPException(status_code=403, detail="This case is not assigned to you")
    context = f"Crime {crime.crime_number}; type: {crime.crime_type}; location: {crime.location}, {crime.district}; date: {crime.incident_date}; priority: {crime.priority}; description: {crime.description}; evidence count: {len(crime.evidence_items)}"
    return {"analysis": generate_investigation_insight(context, language), "language": language}


@router.put("/{crime_id}/assignment", response_model=CrimeResponse)
def assign_crime_officer(
    crime_id: int,
    payload: CrimeAssignment,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
):
    return serialize_crime(assign_officer(db, get_crime_or_404(db, crime_id), payload.officer_id, current_user))

@router.delete("/{crime_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_crime(crime_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN.value: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators may delete crime reports")
    delete_crime(db, get_crime_or_404(db, crime_id))

@router.post("/{crime_id}/evidence", response_model=list[EvidenceResponse], status_code=status.HTTP_201_CREATED)
async def upload_evidence(crime_id: int, files: list[UploadFile] = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id)
    items = await add_evidence(db, crime, current_user, files)
    return [{"id": item.id, "original_filename": item.original_filename, "content_type": item.content_type, "file_size": item.file_size, "uploaded_at": item.uploaded_at, "download_url": f"/crimes/{crime_id}/evidence/{item.id}"} for item in items]

@router.get("/{crime_id}/evidence/{evidence_id}")
def download_evidence(crime_id: int, evidence_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crime = get_crime_or_404(db, crime_id); ensure_access(crime, current_user)
    evidence = next((item for item in crime.evidence_items if item.id == evidence_id), None)
    if not evidence or not Path(evidence.storage_path).is_file(): raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence file not found")
    return FileResponse(evidence.storage_path, media_type=evidence.content_type, filename=evidence.original_filename)
