from pydantic import BaseModel, EmailStr
from .auth import UserRole

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    password: str
    role: UserRole = UserRole.CITIZEN

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True
