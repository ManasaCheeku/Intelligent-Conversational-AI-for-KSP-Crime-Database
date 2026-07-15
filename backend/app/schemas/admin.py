from pydantic import BaseModel, ConfigDict, EmailStr


class OfficerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    badge_number: str | None
    rank: str | None
    email: EmailStr
    station: str | None
    district: str | None
