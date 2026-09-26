"""Caregivers and Family Coordination REST API."""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.caregiver import CaregiverCreate, CaregiverResponse, CaregiverDashboardSummary
from app.services.caregiver_service import caregiver_service

router = APIRouter(prefix="/caregivers", tags=["Caregivers & Family"])


@router.get("/{elder_id}", response_model=List[CaregiverResponse])
async def list_caregivers(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Lists all registered family members and designated caregivers."""
    return await caregiver_service.get_caregivers_for_elder(db, elder_id)


@router.post("", response_model=CaregiverResponse)
async def add_caregiver(data: CaregiverCreate, db: AsyncSession = Depends(get_db)):
    """Registers a new family member or caregiver."""
    return await caregiver_service.add_caregiver(db, data)


@router.get("/{elder_id}/dashboard", response_model=CaregiverDashboardSummary)
async def get_caregiver_dashboard(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Aggregates all elder status, vitals, alerts, adherence, and checkins for the Caregiver Web Dashboard."""
    return await caregiver_service.get_dashboard_summary(db, elder_id)
