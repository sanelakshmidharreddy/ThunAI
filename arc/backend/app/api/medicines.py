"""Medicines REST API for scheduling, adherence tracking, and dose status."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.medicine import (
    MedicineCreate,
    MedicineResponse,
    MedicineStatusSummary,
    MedicineActionRequest,
)
from app.services.medicine_service import medicine_service

router = APIRouter(prefix="/medicines", tags=["Medicines"])


@router.get("/{elder_id}", response_model=List[MedicineResponse])
async def list_elder_medicines(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Fetches all active prescriptions for the elder."""
    meds = await medicine_service.get_medicines_for_elder(db, elder_id)
    return [MedicineResponse.model_validate(m) for m in meds]


@router.post("", response_model=MedicineResponse)
async def create_medicine(data: MedicineCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new prescribed medicine schedule."""
    med = await medicine_service.create_medicine(db, data)
    return MedicineResponse.model_validate(med)


@router.get("/{elder_id}/today", response_model=MedicineStatusSummary)
async def get_today_medicine_status(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns today's dose schedule and adherence count."""
    return await medicine_service.get_today_status(db, elder_id)


@router.post("/{id}/taken")
async def mark_medicine_taken(
    id: str,
    action: MedicineActionRequest = MedicineActionRequest(),
    db: AsyncSession = Depends(get_db),
):
    """Marks a scheduled medicine event as TAKEN."""
    res = await medicine_service.mark_taken(
        db, event_id=id, acknowledged_by=action.acknowledged_by or "elder_tap"
    )
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message", "Medicine event not found"))
    return res


@router.post("/{id}/missed")
async def mark_medicine_missed(id: str, db: AsyncSession = Depends(get_db)):
    """Marks a scheduled medicine event as MISSED and alerts caregiver."""
    res = await medicine_service.mark_missed(db, event_id=id)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message", "Medicine event not found"))
    return res


@router.post("/{id}/skip")
async def mark_medicine_skip(id: str, db: AsyncSession = Depends(get_db)):
    """Marks a scheduled medicine event as SKIPPED."""
    res = await medicine_service.mark_skip(db, event_id=id)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message", "Medicine event not found"))
    return res
