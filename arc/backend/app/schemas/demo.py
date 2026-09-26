"""Pydantic schemas for Demo Mode simulation actions."""
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class DemoSimulateRequest(BaseModel):
    elder_id: str
    action_type: str = Field(...)
    # SIMULATE_MEDICINE_REMINDER
    # SIMULATE_MISSED_MEDICINE
    # SIMULATE_DAILY_CHECKIN
    # SIMULATE_FALL
    # SIMULATE_EMERGENCY
    # ADD_HEALTH_READING
    # GENERATE_WEEKLY_REPORT
    payload: Optional[Dict[str, Any]] = Field(default_factory=dict)


class DemoSimulateResponse(BaseModel):
    success: bool
    action_type: str
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)
