from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Investigation(Base):
    __tablename__ = "investigations"
    id = Column(Integer, primary_key=True, index=True)
    crime_id = Column(Integer, ForeignKey("crimes.id", ondelete="CASCADE"), nullable=False, index=True)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    notes = Column(Text, nullable=True)
    action_taken = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)
    status = Column(String(40), nullable=False, default="assigned")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    crime = relationship("Crime", back_populates="investigations")
    notes_items = relationship("InvestigationNote", back_populates="investigation", cascade="all, delete-orphan")


class InvestigationNote(Base):
    __tablename__ = "investigation_notes"
    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    note = Column(Text, nullable=False)
    visibility = Column(String(20), nullable=False, default="internal")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    investigation = relationship("Investigation", back_populates="notes_items")


class CaseStatusHistory(Base):
    __tablename__ = "case_status_history"
    id = Column(Integer, primary_key=True, index=True)
    crime_id = Column(Integer, ForeignKey("crimes.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)
    status = Column(String(40), nullable=True)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
