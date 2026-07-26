from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"))
    crime_id = Column(Integer, ForeignKey("crimes.id"), nullable=True)
    action = Column(String, nullable=False)
    details = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())