"""Emergency events and notifications models."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, DateTime, Text, Boolean
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class EmergencyEvent(Base):
    __tablename__ = "emergency_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # SOS, POSSIBLE_FALL, MEDICAL_ASSISTANCE, NO_RESPONSE, OTHER
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(20), default="ACTIVE")  # ACTIVE, ACKNOWLEDGED, RESOLVED, CANCELLED
    source = Column(String(50), default="tap")  # tap, voice, simulated_fall, sensor_mock
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    caregiver_id = Column(String(36), nullable=True, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String(30), default="IN_APP")  # IN_APP, SMS_MOCK, PUSH_MOCK
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
