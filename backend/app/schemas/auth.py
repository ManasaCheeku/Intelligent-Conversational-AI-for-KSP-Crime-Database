from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "citizen"
    POLICE_OFFICER = "police_officer"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool

    class Config:
        orm_mode = True