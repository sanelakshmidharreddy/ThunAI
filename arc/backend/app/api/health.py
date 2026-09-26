"""Health Vitals & History REST API."""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.health import HealthReadingCreate, AppointmentResponse
from app.services.health_service import health_service

router = APIRouter(prefix="/health", tags=["Health"])


@router.post("/readings")
async def record_health_reading(data: HealthReadingCreate, db: AsyncSession = Depends(get_db)):
    """Records a new vital health reading (BP, Blood Sugar, Heart Rate, Pulse, Creatinine)."""
    return await health_service.record_reading(db, data)


@router.get("/{elder_id}/daily")
async def get_daily_health(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns today's active health vitals."""
    return await health_service.get_daily_summary(db, elder_id)


@router.get("/{elder_id}/weekly")
async def get_weekly_health(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns 7-day vitals trend for charts."""
    return await health_service.get_weekly_trend(db, elder_id)


@router.get("/{elder_id}/monthly")
async def get_monthly_health(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns 4-week monthly aggregation for charts."""
    return await health_service.get_monthly_trend(db, elder_id)


@router.get("/{elder_id}/appointments", response_model=List[AppointmentResponse])
async def get_appointments(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns upcoming doctor consultations and hospital appointments."""
    return await health_service.get_appointments(db, elder_id)
