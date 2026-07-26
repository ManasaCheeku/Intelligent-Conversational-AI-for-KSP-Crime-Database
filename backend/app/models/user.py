from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="citizen")
    is_active = Column(Boolean, default=True)
    badge_number = Column(String(50), nullable=True)
    rank = Column(String(80), nullable=True)
    station = Column(String(150), nullable=True)
    district = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())