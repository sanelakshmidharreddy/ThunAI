"""Pydantic schemas for daily check-in."""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CheckInCreate(BaseModel):
    elder_id: str
    response: str = Field(...)  # FINE, NEED_HELP, NOT_WELL, URGENT_HELP
    note: Optional[str] = None
    mood_score: Optional[int] = None


class CheckInResponse(BaseModel):
    id: str
    elder_id: str
    check_in_time: datetime
    response: str
    mood_score: int
    note: Optional[str] = None
    escalation_state: str

    model_config = ConfigDict(from_attributes=True)
