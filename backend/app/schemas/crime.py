from datetime import date, datetime, time
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class CrimeType(str, Enum):
    THEFT = "theft"; ROBBERY = "robbery"; ASSAULT = "assault"; CYBER_CRIME = "cyber_crime"; MISSING_PERSON = "missing_person"; DOMESTIC_VIOLENCE = "domestic_violence"; DRUG_OFFENSE = "drug_offense"; TRAFFIC_VIOLATION = "traffic_violation"; FRAUD = "fraud"; MURDER = "murder"; KIDNAPPING = "kidnapping"; OTHER = "other"


class CrimeStatus(str, Enum):
    PENDING = "pending"; UNDER_INVESTIGATION = "under_investigation"; EVIDENCE_COLLECTION = "evidence_collection"; AWAITING_APPROVAL = "awaiting_approval"; ASSIGNED = "assigned"; RESOLVED = "resolved"; REJECTED = "rejected"


class CrimePriority(str, Enum):
    LOW = "low"; MEDIUM = "medium"; HIGH = "high"; CRITICAL = "critical"


class CrimeCreate(BaseModel):
    title: str = Field(min_length=5, max_length=180)
    crime_type: CrimeType
    description: str = Field(min_length=20, max_length=5000)
    location: str = Field(min_length=3, max_length=300)
    district: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    incident_date: date
    incident_time: time


class CrimeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=5, max_length=180)
    crime_type: CrimeType | None = None
    description: str | None = Field(default=None, min_length=20, max_length=5000)
    location: str | None = Field(default=None, min_length=3, max_length=300)
    district: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    incident_date: date | None = None
    incident_time: time | None = None
    status: CrimeStatus | None = None
    priority: CrimePriority | None = None
    investigation_notes: str | None = Field(default=None, max_length=10000)


class CrimeAssignment(BaseModel):
    officer_id: int = Field(ge=1)


class EvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    original_filename: str
    content_type: str
    file_size: int
    uploaded_at: datetime
    download_url: str


class CrimeResponse(BaseModel):
    id: int
    crime_number: str
    title: str
    crime_type: CrimeType
    description: str
    status: CrimeStatus
    priority: CrimePriority
    location: str
    district: str
    state: str
    latitude: float
    longitude: float
    incident_date: date
    incident_time: time
    citizen_id: int
    assigned_officer_id: int | None
    assigned_at: datetime | None
    investigation_notes: str | None
    created_at: datetime
    updated_at: datetime
    evidence_items: list[EvidenceResponse]
