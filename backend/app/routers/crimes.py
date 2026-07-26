from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database.database import get_db
from app.schemas.crime import Crime as CrimeSchema, CrimeCreate, CrimeUpdate, CrimeType, CrimeStatus, Priority
from app.services import crime_service
from app.services.auth_service import get_current_active_user, get_current_active_admin
from app.models.user import User

router = APIRouter(prefix="/crimes", tags=["Crimes"])

@router.post("", response_model=CrimeSchema, status_code=status.HTTP_201_CREATED)
async def create_crime_report(
    title: str = Form(...),
    description: str = Form(...),
    crime_type: CrimeType = Form(...),
    location: str = Form(...),
    district: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    incident_date: date = Form(...),
    incident_time: str = Form(...),
    files: List[UploadFile] = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Reconstruct the Pydantic model from Form fields
    payload = CrimeCreate(
        title=title, description=description, crime_type=crime_type,
        location=location, district=district, latitude=latitude, longitude=longitude,
        incident_date=incident_date, incident_time=incident_time
    )
    crime = crime_service.create_crime(db, payload, current_user)
    if files:
        await crime_service.add_evidence(db, crime, current_user, files)
    return crime_service.serialize_crime(crime)

@router.get("", response_model=List[CrimeSchema])
def get_crime_list(
    query: Optional[str] = None,
    crime_type: Optional[CrimeType] = None,
    crime_status: Optional[CrimeStatus] = None,
    priority: Optional[Priority] = None,
    district: Optional[str] = None,
    incident_date: Optional[date] = None,
    citizen_id: Optional[int] = None,
    officer_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    crimes = crime_service.list_crimes(
        db, user=current_user, query=query, crime_type=crime_type,
        crime_status=crime_status, priority=priority, district=district,
        incident_date=incident_date, citizen_id=citizen_id, officer_id=officer_id
    )
    return [crime_service.serialize_crime(c) for c in crimes]

@router.get("/{crime_id}", response_model=CrimeSchema)
def get_crime_details(crime_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    crime = crime_service.get_crime_or_404(db, crime_id)
    crime_service.ensure_access(crime, current_user)
    return crime_service.serialize_crime(crime)

@router.put("/{crime_id}", response_model=CrimeSchema)
def update_crime_details(crime_id: int, payload: CrimeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    crime = crime_service.get_crime_or_404(db, crime_id)
    updated_crime = crime_service.update_crime(db, crime, payload, current_user)
    return crime_service.serialize_crime(updated_crime)

@router.delete("/{crime_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_crime_report(crime_id: int, db: Session = Depends(get_db), admin_user: User = Depends(get_current_active_admin)):
    crime = crime_service.get_crime_or_404(db, crime_id)
    crime_service.delete_crime(db, crime)
    return None

@router.put("/{crime_id}/assignment", response_model=CrimeSchema)
def assign_crime_to_officer(crime_id: int, officer_id: int, db: Session = Depends(get_db), admin_user: User = Depends(get_current_active_admin)):
    crime = crime_service.get_crime_or_404(db, crime_id)
    assigned_crime = crime_service.assign_officer(db, crime, officer_id, admin_user)
    return crime_service.serialize_crime(assigned_crime)