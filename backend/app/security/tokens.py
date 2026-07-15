from datetime import datetime, timedelta, timezone
from uuid import uuid4
from jose import JWTError, jwt
from app.core.config import settings

def create_token(*, subject: str, role: str, token_type: str, expires_delta: timedelta, jti: str | None = None) -> tuple[str, str]:
    token_id = jti or str(uuid4())
    expires_at = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": subject, "role": role, "type": token_type, "jti": token_id, "exp": expires_at}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM), token_id


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as error:
        raise ValueError("Invalid or expired token") from error
