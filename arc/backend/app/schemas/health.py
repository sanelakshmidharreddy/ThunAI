"""Pydantic schemas for health readings and history."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class HealthReadingCreate(BaseModel):
    elder_id: str
    type: str = Field(...)  # BLOOD_PRESSURE, BLOOD_SUGAR, HEART_RATE, PULSE, CREATININE
    value: Optional[float] = Field(default=None)
    unit: str = Field(...)
    systolic: Optional[float] = Field(default=None)
    diastolic: Optional[float] = Field(default=None)
    recorded_at: Optional[datetime] = None
    source: Optional[str] = "elder_voice"
    notes: Optional[str] = None


class HealthReadingResponse(BaseModel):
    id: str
    elder_id: str
    type: str
    value: Optional[float] = None
    unit: str
    systolic: Optional[float] = None
    diastolic: Optional[float] = None
    recorded_at: datetime
    source: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AppointmentResponse(BaseModel):
    id: str
    elder_id: str
    doctor_name: str
    specialty: str
    scheduled_at: datetime
    location: Optional[str] = None
    status: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class HealthOverviewResponse(BaseModel):
    elder_id: str
    elder_name: str
    today_readings: Dict[str, Any]
    weekly_trend: List[Dict[str, Any]]
    monthly_trend: List[Dict[str, Any]]
    medicine_adherence_today: Dict[str, Any]
    check_in_today: Optional[Dict[str, Any]] = None
    active_emergency: Optional[Dict[str, Any]] = None
