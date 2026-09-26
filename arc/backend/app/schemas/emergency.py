"""Pydantic schemas for emergency and SOS handling."""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class EmergencyCreate(BaseModel):
    elder_id: str
    event_type: str = Field(default="SOS")  # SOS, POSSIBLE_FALL, MEDICAL_ASSISTANCE, NO_RESPONSE, OTHER
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    source: Optional[str] = "tap"  # tap, voice, simulated_fall, sensor_mock
    notes: Optional[str] = None


class EmergencyResponse(BaseModel):
    id: str
    elder_id: str
    event_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str  # ACTIVE, ACKNOWLEDGED, RESOLVED, CANCELLED
    source: str
    notes: Optional[str] = None
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SimulateFallRequest(BaseModel):
    elder_id: str
    latitude: Optional[float] = 13.0827
    longitude: Optional[float] = 80.2707
    notes: Optional[str] = "Simulated fall event from Demo Controls"


class ResolveEmergencyRequest(BaseModel):
    status: str = "RESOLVED"  # ACKNOWLEDGED, RESOLVED, CANCELLED
    notes: Optional[str] = "Resolved by caregiver"
