"""Elder profile model."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Elder(Base):
    __tablename__ = "elders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True, index=True)
    full_name = Column(String(100), nullable=False)
    age = Column(Integer, default=70)
    gender = Column(String(20), nullable=True)
    preferred_language = Column(String(10), default="en")  # en, ta, hi, te
    emergency_notes = Column(String(500), nullable=True)
    address = Column(String(255), nullable=True)
    primary_phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
