from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import RefreshToken, User
from app.schemas.auth import LoginRequest, TokenResponse, UserRegister, UserRole
from app.security.hashing import hash_password, verify_password
from app.security.tokens import create_token, decode_token


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
    refresh_token, refresh_jti = create_token(subject=str(user.id), role=user.role, token_type="refresh", expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    db.add(RefreshToken(user_id=user.id, jti=refresh_jti, expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)))
    db.commit()
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user)


def authenticate(db: Session, payload: LoginRequest) -> User:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated")
    return user


def rotate_refresh_token(db: Session, refresh_token: str) -> TokenResponse:
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")
        record = db.query(RefreshToken).filter(RefreshToken.jti == payload["jti"]).first()
        if not record or record.revoked_at or record.expires_at.replace(tzinfo=timezone.utc) <= datetime.now(timezone.utc):
            raise ValueError("Refresh token is invalid")
    except (KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
    record.revoked_at = datetime.now(timezone.utc)
    db.commit()
    return issue_tokens(db, record.user)


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            return
        record = db.query(RefreshToken).filter(RefreshToken.jti == payload.get("jti")).first()
        if record and not record.revoked_at:
            record.revoked_at = datetime.now(timezone.utc)
            db.commit()
    except ValueError:
        return
