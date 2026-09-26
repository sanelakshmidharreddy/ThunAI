"""Emergency & SOS Management REST API."""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.emergency import EmergencyCreate, SimulateFallRequest, ResolveEmergencyRequest
from app.services.emergency_service import emergency_service

router = APIRouter(prefix="/emergency", tags=["Emergency & SOS"])


@router.post("/sos")
async def trigger_sos(data: EmergencyCreate, db: AsyncSession = Depends(get_db)):
    """Triggers high-priority SOS alert with simulated GPS coordinates and caregiver notification."""
    return await emergency_service.trigger_sos(db, data)


@router.post("/simulate-fall")
async def simulate_fall_event(data: SimulateFallRequest, db: AsyncSession = Depends(get_db)):
    """Simulates a fall event from Demo Controls for hackathon demonstration."""
    return await emergency_service.simulate_fall(db, data)


@router.get("/{elder_id}")
async def get_emergency_events(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns recent emergency alerts and active events."""
    active = await emergency_service.get_active_emergency(db, elder_id)
    history = await emergency_service.get_emergency_history(db, elder_id)
    return {
        "active_emergency": active,
        "history": history,
    }


@router.post("/{id}/resolve")
async def resolve_emergency_event(
    id: str,
    data: ResolveEmergencyRequest = ResolveEmergencyRequest(),
    db: AsyncSession = Depends(get_db),
):
    """Resolves or acknowledges an active emergency incident."""
    res = await emergency_service.resolve_emergency(db, event_id=id, data=data)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail="Emergency event not found")
    return res
