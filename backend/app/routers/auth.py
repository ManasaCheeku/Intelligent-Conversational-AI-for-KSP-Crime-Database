from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services import auth_service
from app.schemas.token import LoginRequest, TokenResponse, RefreshTokenRequest
from app.schemas.user import UserRegister
from app.core.security import oauth2_scheme # This import is now correct

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    new_user = auth_service.register_user(db, payload)
    return auth_service.issue_tokens(db, new_user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate(db, payload)
    return auth_service.issue_tokens(db, user)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    return auth_service.rotate_refresh_token(db, payload.refresh_token)