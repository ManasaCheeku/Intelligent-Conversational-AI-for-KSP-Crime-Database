from fastapi.security import OAuth2PasswordBearer

# This is the central dependency for API security.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")