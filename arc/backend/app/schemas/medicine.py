"""Pydantic schemas for medicine management."""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class MedicineBase(BaseModel):
    medicine_name: str = Field(...)
    dosage: str = Field(...)
    dosage_unit: str = Field(default="mg")
    frequency: str = Field(default="daily")
    scheduled_times: str = Field(default="08:00,20:00")
    instructions: Optional[str] = Field(default=None)
    active: bool = True


class MedicineCreate(MedicineBase):
    elder_id: str


class MedicineResponse(MedicineBase):
    id: str
    elder_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MedicineEventResponse(BaseModel):
    id: str
    medicine_id: str
    elder_id: str
    medicine_name: Optional[str] = None
    dosage: Optional[str] = None
    dosage_info: Optional[str] = None
    scheduled_at: datetime
    status: str  # PENDING, TAKEN, MISSED, SKIPPED
    taken_at: Optional[datetime] = None
    missed_at: Optional[datetime] = None
    acknowledged_by: Optional[str] = None
    instructions: Optional[str] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MedicineActionRequest(BaseModel):
    acknowledged_by: Optional[str] = "elder_tap"
    notes: Optional[str] = None


class MedicineStatusSummary(BaseModel):
    total_scheduled: int
    taken_count: int
    missed_count: int
    pending_count: int
    adherence_percentage: float
    events: List[MedicineEventResponse] = []
