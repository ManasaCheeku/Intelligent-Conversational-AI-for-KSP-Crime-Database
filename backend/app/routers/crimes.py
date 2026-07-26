from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.crime import Crime as CrimeSchema, CrimeCreate, CrimeUpdate
from app.services import crime_service
from app.security.authentication import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/crimes", tags=["Crimes"])

@router.post("", response_model=CrimeSchema, status_code=status.HTTP_201_CREATED)
async def create_crime_report(
    payload: CrimeCreate = Depends(),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    crime = crime_service.create_crime(db, payload, current_user)
    if files:
        await crime_service.add_evidence(db, crime, current_user, files)
    return crime_service.serialize_crime(crime)

@router.get("", response_model=List[CrimeSchema])
def get_crime_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    # Add filter query params here if needed
):
    crimes = crime_service.list_crimes(db, current_user)
    return [crime_service.serialize_crime(c) for c in crimes]