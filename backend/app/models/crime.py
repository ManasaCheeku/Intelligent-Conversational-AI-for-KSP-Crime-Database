from sqlalchemy import Column, Integer, String, Float, Date, Time, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Crime(Base):
    __tablename__ = "crimes"
    id = Column(Integer, primary_key=True)
    crime_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    crime_type = Column(String, nullable=False)
    status = Column(String, default="pending")
    priority = Column(String, default="medium")
    location = Column(String)
    district = Column(String)
    state = Column(String, default="Karnataka")
    latitude = Column(Float)
    longitude = Column(Float)
    incident_date = Column(Date)
    incident_time = Column(Time)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    citizen_id = Column(Integer, ForeignKey("users.id"))
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    investigation_notes = Column(Text, nullable=True)
    evidence_items = relationship("Evidence", back_populates="crime", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True)
    crime_id = Column(Integer, ForeignKey("crimes.id"), nullable=False)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False, unique=True)
    content_type = Column(String)
    file_size = Column(Integer)
    storage_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    crime = relationship("Crime", back_populates="evidence_items")