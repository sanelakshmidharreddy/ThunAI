"""Pydantic schemas for caregivers and family dashboard."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CaregiverBase(BaseModel):
    name: str = Field(...)
    relationship: str = Field(...)
    phone: str = Field(...)
    email: Optional[str] = None
    role: str = Field(default="PRIMARY_CAREGIVER")
    notification_permission: bool = True
    emergency_contact: bool = True
    dashboard_access: bool = True
    avatar_url: Optional[str] = None


class CaregiverCreate(CaregiverBase):
    elder_id: str


class CaregiverResponse(CaregiverBase):
    id: str
    elder_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CaregiverDashboardSummary(BaseModel):
    elder_id: str
    elder_name: str
    elder_age: int
    elder_phone: Optional[str] = None
    overall_status: str  # DOING_WELL, ATTENTION_NEEDED, EMERGENCY_ACTIVE
    status_message: str
    last_check_in: Optional[Dict[str, Any]] = None
    medicine_summary: Dict[str, Any]
    health_today: Dict[str, Any]
    weekly_health: List[Dict[str, Any]]
    monthly_health: List[Dict[str, Any]]
    upcoming_appointment: Optional[Dict[str, Any]] = None
    recent_alerts: List[Dict[str, Any]] = []
    active_emergencies: List[Dict[str, Any]] = []
    family_contacts: List[CaregiverResponse] = []
