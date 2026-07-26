from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.auth import UserRole
from app.schemas.user import UserResponse # Correctly import the response schema
from app.models.user import User
from app.services.auth_service import get_current_active_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/officers", response_model=List[UserResponse])
def get_all_officers(db: Session = Depends(get_db), admin_user: User = Depends(get_current_active_admin)):
    officers = db.query(User).filter(User.role == UserRole.POLICE_OFFICER.value, User.is_active == True).all()
    return [UserResponse.from_attributes(officer) for officer in officers]