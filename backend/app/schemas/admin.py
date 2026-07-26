from pydantic import BaseModel, EmailStr


class OfficerResponse(BaseModel):
    id: int
    full_name: str
    badge_number: str | None
    rank: str | None
    email: EmailStr
    station: str | None
    district: str | None

    class Config:
        from_attributes = True
