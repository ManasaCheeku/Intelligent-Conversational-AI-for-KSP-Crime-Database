from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import require_roles
from app.database.database import get_db
from app.models.user import User
from app.schemas.admin import OfficerResponse
from app.schemas.auth import UserRole

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/officers", response_model=list[OfficerResponse])
def list_active_officers(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    return (
        db.query(User)
        .filter(User.role == UserRole.POLICE_OFFICER.value, User.is_active.is_(True))
        .order_by(User.full_name.asc())
        .all()
    )
