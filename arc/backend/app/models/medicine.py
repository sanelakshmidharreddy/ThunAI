"""Medicine schedule and adherence models."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    medicine_name = Column(String(150), nullable=False)
    dosage = Column(String(50), nullable=False)  # e.g. "500", "1"
    dosage_unit = Column(String(30), default="mg")  # mg, tablet, ml, drops
    frequency = Column(String(50), default="daily")  # daily, twice daily, thrice daily, as needed
    scheduled_times = Column(String(100), default="08:00,20:00")  # comma-separated HH:MM
    start_date = Column(String(20), nullable=True)
    end_date = Column(String(20), nullable=True)
    instructions = Column(Text, nullable=True)  # e.g. "Take after food with warm water"
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
