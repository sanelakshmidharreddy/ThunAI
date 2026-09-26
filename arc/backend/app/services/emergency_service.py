"""Emergency service managing SOS, fall simulation, and status updates."""
from typing import Dict, Any, List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.emergency import EmergencyEvent
from app.schemas.emergency import EmergencyCreate, SimulateFallRequest, ResolveEmergencyRequest
from app.tools.emergency_tools import (
    tool_trigger_sos,
    tool_simulate_fall,
    tool_resolve_emergency,
    tool_get_active_emergency,
)


class EmergencyService:

    async def trigger_sos(self, db: AsyncSession, data: EmergencyCreate) -> Dict[str, Any]:
        return await tool_trigger_sos(
            db=db,
            elder_id=data.elder_id,
            source=data.source or "tap",
            latitude=data.latitude,
            longitude=data.longitude,
            notes=data.notes,
        )

    async def simulate_fall(self, db: AsyncSession, data: SimulateFallRequest) -> Dict[str, Any]:
        return await tool_simulate_fall(
            db=db,
            elder_id=data.elder_id,
            latitude=data.latitude,
            longitude=data.longitude,
            notes=data.notes,
        )

    async def resolve_emergency(self, db: AsyncSession, event_id: str, data: ResolveEmergencyRequest) -> Dict[str, Any]:
        return await tool_resolve_emergency(
            db=db,
            event_id=event_id,
            status=data.status,
            notes=data.notes,
        )

    async def get_active_emergency(self, db: AsyncSession, elder_id: str) -> Optional[Dict[str, Any]]:
        return await tool_get_active_emergency(db, elder_id)

    async def get_emergency_history(self, db: AsyncSession, elder_id: str, limit: int = 15) -> List[Dict[str, Any]]:
        res = await db.execute(
            select(EmergencyEvent)
            .where(EmergencyEvent.elder_id == elder_id)
            .order_by(desc(EmergencyEvent.created_at))
            .limit(limit)
        )
        events = res.scalars().all()
        return [
            {
                "id": e.id,
                "event_type": e.event_type,
                "latitude": e.latitude,
                "longitude": e.longitude,
                "status": e.status,
                "source": e.source,
                "notes": e.notes,
                "created_at": e.created_at.isoformat(),
                "resolved_at": e.resolved_at.isoformat() if e.resolved_at else None,
            }
            for e in events
        ]


emergency_service = EmergencyService()
