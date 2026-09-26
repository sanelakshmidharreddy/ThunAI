"""Health reading and medical appointment models."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, DateTime
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class HealthReading(Base):
    __tablename__ = "health_readings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)  # BLOOD_PRESSURE, BLOOD_SUGAR, HEART_RATE, PULSE, CREATININE
    value = Column(Float, nullable=True)
    unit = Column(String(20), nullable=False)  # BPM, mg/dL, mmHg
    systolic = Column(Float, nullable=True)
    diastolic = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    source = Column(String(50), default="elder_voice")  # elder_voice, elder_tap, device_mock, demo
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    doctor_name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    location = Column(String(200), nullable=True)
    status = Column(String(20), default="SCHEDULED")  # SCHEDULED, COMPLETED, CANCELLED
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
