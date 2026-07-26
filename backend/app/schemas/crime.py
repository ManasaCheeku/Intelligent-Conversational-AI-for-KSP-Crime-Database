from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time, datetime
from enum import Enum

class CrimeType(str, Enum):
    theft = "theft"
    assault = "assault"
    # ... add all crime types

class CrimeStatus(str, Enum):
    pending = "pending"
    assigned = "assigned"
    # ... add all statuses

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class CrimeBase(BaseModel):
    title: str
    description: str
    crime_type: CrimeType
    location: str
    district: str
    latitude: float
    longitude: float
    incident_date: date
    incident_time: time

class CrimeCreate(CrimeBase):
    pass

class CrimeUpdate(BaseModel):
    status: Optional[CrimeStatus] = None
    priority: Optional[Priority] = None
    investigation_notes: Optional[str] = None

class Crime(CrimeBase):
    id: int
    crime_number: str
    status: CrimeStatus
    priority: Priority
    created_at: datetime

    class Config:
        orm_mode = True