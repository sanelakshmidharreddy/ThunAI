"""Deterministic medicine management tools."""
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.medicine import Medicine
from app.models.reminder import MedicineEvent
from app.models.elder import Elder


async def tool_create_medicine_reminder(
    db: AsyncSession,
    elder_id: str,
    medicine_name: str,
    scheduled_time: str,
    dosage: str = "1",
    dosage_unit: str = "tablet",
    instructions: Optional[str] = None,
) -> Dict[str, Any]:
    """Schedules a new medicine reminder for an elder."""
    med = Medicine(
        elder_id=elder_id,
        medicine_name=medicine_name,
        dosage=dosage,
        dosage_unit=dosage_unit,
        scheduled_times=scheduled_time,
        instructions=instructions or "Take with water",
        active=True,
    )
    db.add(med)
    await db.flush()

    # Create scheduled event for today at that time
    now = datetime.now(timezone.utc)
    try:
        hr, mn = map(int, scheduled_time.split(":"))
        scheduled_dt = now.replace(hour=hr, minute=mn, second=0, microsecond=0)
    except Exception:
        scheduled_dt = now + timedelta(hours=1)

    event = MedicineEvent(
        medicine_id=med.id,
        elder_id=elder_id,
        scheduled_at=scheduled_dt,
        status="PENDING",
    )
    db.add(event)
    await db.commit()

    return {
        "success": True,
        "medicine_id": med.id,
        "event_id": event.id,
        "medicine_name": medicine_name,
        "scheduled_time": scheduled_time,
    }


async def tool_mark_medicine_taken(
    db: AsyncSession,
    elder_id: str,
    medicine_id: Optional[str] = None,
    event_id: Optional[str] = None,
    acknowledged_by: str = "elder_voice",
) -> Dict[str, Any]:
    """Marks pending medicine as TAKEN."""
    query = select(MedicineEvent).where(
        and_(
            MedicineEvent.elder_id == elder_id,
            MedicineEvent.status == "PENDING"
        )
    )
    if event_id:
        query = query.where(MedicineEvent.id == event_id)
    elif medicine_id:
        query = query.where(MedicineEvent.medicine_id == medicine_id)

    res = await db.execute(query.order_by(MedicineEvent.scheduled_at.asc()))
    event = res.scalars().first()

    now = datetime.now(timezone.utc)
    if event:
        event.status = "TAKEN"
        event.taken_at = now
        event.acknowledged_by = acknowledged_by
        await db.commit()
        return {
            "success": True,
            "status": "TAKEN",
            "event_id": event.id,
            "taken_at": now.isoformat(),
        }

    return {"success": False, "message": "No pending medicine reminder found."}


async def tool_mark_medicine_missed(
    db: AsyncSession,
    elder_id: str,
    event_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Marks medicine as MISSED and triggers caregiver notification."""
    query = select(MedicineEvent).where(
        and_(
            MedicineEvent.elder_id == elder_id,
            MedicineEvent.status == "PENDING"
        )
    )
    if event_id:
        query = query.where(MedicineEvent.id == event_id)

    res = await db.execute(query.order_by(MedicineEvent.scheduled_at.asc()))
    event = res.scalars().first()

    now = datetime.now(timezone.utc)
    if event:
        event.status = "MISSED"
        event.missed_at = now
        await db.commit()
        return {
            "success": True,
            "status": "MISSED",
            "event_id": event.id,
            "missed_at": now.isoformat(),
        }

    return {"success": False, "message": "No pending medicine found to mark missed."}


async def tool_get_today_medicine_status(
    db: AsyncSession,
    elder_id: str,
) -> Dict[str, Any]:
    """Calculates today's medicine adherence count and returns events."""
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    query = select(MedicineEvent, Medicine).join(
        Medicine, MedicineEvent.medicine_id == Medicine.id
    ).where(
        and_(
            MedicineEvent.elder_id == elder_id,
            MedicineEvent.scheduled_at >= start_of_day,
            MedicineEvent.scheduled_at <= end_of_day,
        )
    )
    res = await db.execute(query)
    rows = res.all()

    taken = sum(1 for e, m in rows if e.status == "TAKEN")
    missed = sum(1 for e, m in rows if e.status == "MISSED")
    pending = sum(1 for e, m in rows if e.status == "PENDING")
    total = len(rows)

    adherence = (taken / total * 100.0) if total > 0 else 100.0

    events_list = [
        {
            "id": e.id,
            "medicine_id": m.id,
            "elder_id": e.elder_id,
            "medicine_name": m.medicine_name,
            "dosage": f"{m.dosage} {m.dosage_unit}",
            "dosage_info": f"{m.dosage} {m.dosage_unit}",
            "scheduled_at": e.scheduled_at,
            "status": e.status,
            "instructions": m.instructions,
        }
        for e, m in rows
    ]

    return {
        "total_scheduled": total,
        "taken_count": taken,
        "missed_count": missed,
        "pending_count": pending,
        "adherence_percentage": round(adherence, 1),
        "events": events_list,
    }
