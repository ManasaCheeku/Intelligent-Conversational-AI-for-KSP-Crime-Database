from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Crime(Base):
    __tablename__ = "crimes"

    id = Column(Integer, primary_key=True, index=True)
    crime_number = Column(String(32), unique=True, nullable=False, index=True)
    title = Column(String(180), nullable=False, index=True)
    crime_type = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    status = Column(String(32), nullable=False, default="pending", index=True)
    priority = Column(String(16), nullable=False, default="medium", index=True)
    location = Column(String(300), nullable=False)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    incident_date = Column(Date, nullable=False, index=True)
    incident_time = Column(Time, nullable=False)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    investigation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    citizen = relationship("User", foreign_keys=[citizen_id], back_populates="reported_crimes")
    officer = relationship("User", foreign_keys=[assigned_officer_id], back_populates="assigned_crimes")
    evidence_items = relationship("Evidence", back_populates="crime", cascade="all, delete-orphan")
    investigations = relationship("Investigation", back_populates="crime", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    crime_id = Column(Integer, ForeignKey("crimes.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), unique=True, nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    crime = relationship("Crime", back_populates="evidence_items")
