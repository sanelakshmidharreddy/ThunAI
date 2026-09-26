"""Daily check-in, voice session, and audit log models."""
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    response = Column(String(30), nullable=False)  # FINE, NEED_HELP, NOT_WELL, URGENT_HELP, PENDING, MISSED
    mood_score = Column(Integer, default=3)  # 4: Fine, 3: Need help, 2: Not well, 1: Urgent
    note = Column(Text, nullable=True)
    escalation_state = Column(String(30), default="NONE")  # NONE, CAREGIVER_NOTIFIED, ESCALATED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    elder_id = Column(String(36), nullable=False, index=True)
    input_text = Column(Text, nullable=False)
    detected_language = Column(String(10), default="en")
    recognized_intent = Column(String(50), nullable=False)
    response_text = Column(Text, nullable=False)
    audio_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
