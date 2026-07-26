from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import UserRole
from app.schemas.token import LoginRequest, TokenResponse, RefreshTokenRequest
from app.schemas.user import UserRegister, UserResponse
from app.security.hashing import hash_password, verify_password
from app.security.tokens import create_token, decode_token
from app.core.security import oauth2_scheme # This import is now correct
from app.database.database import get_db


def register_user(db: Session, payload: UserRegister) -> User:
    if payload.role is not UserRole.CITIZEN and not settings.ALLOW_PRIVILEGED_SELF_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Police officer and administrator accounts must be provisioned by an administrator",
        )
    if db.query(User).filter((User.email == payload.email.lower()) | (User.mobile == payload.mobile)).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email or mobile number already exists")
    user = User(full_name=payload.full_name, email=payload.email.lower(), mobile=payload.mobile, password_hash=hash_password(payload.password), role=payload.role.value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def issue_tokens(db: Session, user: User) -> TokenResponse:
    access_token, _ = create_token(subject=str(user.id), role=user.role, token_type="access", expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token, _ = create_token(subject=str(user.id), role=user.role, token_type="refresh", expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    user_data = UserResponse.from_attributes(user)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user_data)


def authenticate(db: Session, payload: LoginRequest) -> User:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated")
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise ValueError("Invalid token type")
        user_id = int(payload["sub"])
    except (KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials", headers={"WWW-Authenticate": "Bearer"})
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return current_user


def get_current_active_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The user does not have administrator privileges")
    return current_user

def get_current_active_police_officer(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != UserRole.POLICE_OFFICER.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The user is not a police officer")
    return current_user

def get_current_active_citizen(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != UserRole.CITIZEN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The user is not a citizen")
    return current_user


def rotate_refresh_token(db: Session, refresh_token: str) -> TokenResponse:
    try:
        user = get_current_user(token=refresh_token, db=db)
    except (KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
    return issue_tokens(db, user)


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    pass
