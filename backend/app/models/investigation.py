from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.database.base import Base

class Investigation(Base):
    __tablename__ = "investigations"
    id = Column(Integer, primary_key=True)
    crime_id = Column(Integer, ForeignKey("crimes.id"), nullable=False, unique=True)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notes = Column(Text)
    action_taken = Column(Text)
    recommendation = Column(Text)
    status = Column(String, default="assigned")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InvestigationNote(Base):
    __tablename__ = "investigation_notes"
    id = Column(Integer, primary_key=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=False)
    visibility = Column(String, default="internal")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CaseStatusHistory(Base):
    __tablename__ = "case_status_history"
    id = Column(Integer, primary_key=True)
    crime_id = Column(Integer, ForeignKey("crimes.id"), nullable=False)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)
    status = Column(String)
    detail = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())