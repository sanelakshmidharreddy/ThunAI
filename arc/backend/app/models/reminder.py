"""Medicine events and reminder logs."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class MedicineEvent(Base):
    __tablename__ = "medicine_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    medicine_id = Column(String(36), nullable=False, index=True)
    elder_id = Column(String(36), nullable=False, index=True)
    scheduled_at = Column(DateTime, nullable=False, index=True)
    status = Column(String(20), default="PENDING")  # PENDING, TAKEN, MISSED, SKIPPED
    taken_at = Column(DateTime, nullable=True)
    missed_at = Column(DateTime, nullable=True)
    acknowledged_by = Column(String(50), nullable=True)  # "elder_voice", "elder_tap", "caregiver"
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
