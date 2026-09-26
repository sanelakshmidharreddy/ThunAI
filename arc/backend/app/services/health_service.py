"""Health service managing vitals, trends, and appointments."""
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.health_reading import HealthReading, Appointment
from app.schemas.health import HealthReadingCreate, HealthReadingResponse, AppointmentResponse
from app.tools.health_tools import (
    tool_record_health_reading,
    tool_get_health_summary,
    tool_get_weekly_trend,
    tool_get_monthly_trend,
)


class HealthService:

    async def record_reading(self, db: AsyncSession, data: HealthReadingCreate) -> Dict[str, Any]:
        return await tool_record_health_reading(
            db=db,
            elder_id=data.elder_id,
            reading_type=data.type,
            value=data.value,
            unit=data.unit,
            systolic=data.systolic,
            diastolic=data.diastolic,
            source=data.source or "manual",
            notes=data.notes,
        )

    async def get_daily_summary(self, db: AsyncSession, elder_id: str) -> Dict[str, Any]:
        return await tool_get_health_summary(db, elder_id)

    async def get_weekly_trend(self, db: AsyncSession, elder_id: str) -> List[Dict[str, Any]]:
        return await tool_get_weekly_trend(db, elder_id)

    async def get_monthly_trend(self, db: AsyncSession, elder_id: str) -> List[Dict[str, Any]]:
        return await tool_get_monthly_trend(db, elder_id)

    async def get_appointments(self, db: AsyncSession, elder_id: str) -> List[AppointmentResponse]:
        res = await db.execute(
            select(Appointment)
            .where(Appointment.elder_id == elder_id)
            .order_by(Appointment.scheduled_at.asc())
        )
        apps = res.scalars().all()
        return [AppointmentResponse.model_validate(a) for a in apps]


health_service = HealthService()
