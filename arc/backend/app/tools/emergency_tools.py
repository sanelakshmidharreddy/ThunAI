"""Deterministic emergency and SOS event tools."""
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.emergency import EmergencyEvent, Notification
from app.models.caregiver import Caregiver
from app.config import settings


async def tool_trigger_sos(
    db: AsyncSession,
    elder_id: str,
    source: str = "tap",
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Creates a high-priority SOS emergency event and notifies all caregivers."""
    lat = latitude or settings.SIMULATED_LOCATION_LAT
    lng = longitude or settings.SIMULATED_LOCATION_LNG

    event = EmergencyEvent(
        elder_id=elder_id,
        event_type="SOS",
        latitude=lat,
        longitude=lng,
        status="ACTIVE",
        source=source,
        notes=notes or "Urgent SOS triggered by elder",
    )
    db.add(event)
    await db.flush()

    # Create notifications for caregivers
    caregivers_res = await db.execute(
        select(Caregiver).where(Caregiver.elder_id == elder_id)
    )
    caregivers = caregivers_res.scalars().all()

    for cg in caregivers:
        notif = Notification(
            elder_id=elder_id,
            caregiver_id=cg.id,
            title="EMERGENCY ALERT: SOS Triggered",
            message=f"Urgent: SOS triggered by elder. Location: ({lat}, {lng}). Please verify safety immediately.",
            channel="IN_APP",
        )
        db.add(notif)

    await db.commit()

    return {
        "success": True,
        "event_id": event.id,
        "event_type": "SOS",
        "status": "ACTIVE",
        "latitude": lat,
        "longitude": lng,
        "caregivers_notified": len(caregivers),
        "created_at": event.created_at.isoformat(),
    }


async def tool_simulate_fall(
    db: AsyncSession,
    elder_id: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Creates a POSSIBLE_FALL emergency event."""
    lat = latitude or settings.SIMULATED_LOCATION_LAT
    lng = longitude or settings.SIMULATED_LOCATION_LNG

    event = EmergencyEvent(
        elder_id=elder_id,
        event_type="POSSIBLE_FALL",
        latitude=lat,
        longitude=lng,
        status="ACTIVE",
        source="simulated_fall",
        notes=notes or "Fall simulation test triggered from demo panel",
    )
    db.add(event)
    await db.flush()

    caregivers_res = await db.execute(
        select(Caregiver).where(Caregiver.elder_id == elder_id)
    )
    caregivers = caregivers_res.scalars().all()

    for cg in caregivers:
        notif = Notification(
            elder_id=elder_id,
            caregiver_id=cg.id,
            title="ALERT: Possible Fall Detected",
            message=f"A possible fall was detected for elder. Location: ({lat}, {lng}). Please check in immediately.",
            channel="IN_APP",
        )
        db.add(notif)

    await db.commit()

    return {
        "success": True,
        "event_id": event.id,
        "event_type": "POSSIBLE_FALL",
        "status": "ACTIVE",
        "latitude": lat,
        "longitude": lng,
        "caregivers_notified": len(caregivers),
        "created_at": event.created_at.isoformat(),
    }


async def tool_resolve_emergency(
    db: AsyncSession,
    event_id: str,
    status: str = "RESOLVED",
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Resolves or acknowledges an active emergency event."""
    res = await db.execute(select(EmergencyEvent).where(EmergencyEvent.id == event_id))
    event = res.scalars().first()

    if not event:
        return {"success": False, "message": "Emergency event not found."}

    now = datetime.now(timezone.utc)
    if status == "ACKNOWLEDGED":
        event.status = "ACKNOWLEDGED"
        event.acknowledged_at = now
    else:
        event.status = "RESOLVED"
        event.resolved_at = now

    if notes:
        event.notes = f"{event.notes or ''} | {notes}".strip(" |")

    await db.commit()
    return {
        "success": True,
        "event_id": event.id,
        "status": event.status,
    }


async def tool_get_active_emergency(
    db: AsyncSession,
    elder_id: str,
) -> Optional[Dict[str, Any]]:
    """Checks for any currently ACTIVE emergency event."""
    res = await db.execute(
        select(EmergencyEvent).where(
            and_(
                EmergencyEvent.elder_id == elder_id,
                EmergencyEvent.status.in_(["ACTIVE", "ACKNOWLEDGED"])
            )
        ).order_by(desc(EmergencyEvent.created_at))
    )
    event = res.scalars().first()
    if event:
        return {
            "id": event.id,
            "event_type": event.event_type,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "status": event.status,
            "source": event.source,
            "notes": event.notes,
            "created_at": event.created_at.isoformat(),
        }
    return None
