"""Caregiver and family relationship models."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True)
    name = Column(String(100), nullable=False)
    relationship = Column(String(50), nullable=False)  # Daughter, Son, Doctor, Spouse, etc.
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    role = Column(String(30), default="PRIMARY_CAREGIVER")  # PRIMARY_CAREGIVER, FAMILY_MEMBER, EMERGENCY_CONTACT, VIEW_ONLY
    notification_permission = Column(Boolean, default=True)
    emergency_contact = Column(Boolean, default=True)
    dashboard_access = Column(Boolean, default=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
