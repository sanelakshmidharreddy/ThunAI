"""Medicine service for scheduling, reminders, and adherence tracking."""
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.medicine import Medicine
from app.models.reminder import MedicineEvent
from app.schemas.medicine import MedicineCreate, MedicineStatusSummary, MedicineEventResponse
from app.tools.medicine_tools import tool_get_today_medicine_status, tool_mark_medicine_taken, tool_mark_medicine_missed


class MedicineService:

    async def get_medicines_for_elder(self, db: AsyncSession, elder_id: str) -> List[Medicine]:
        res = await db.execute(
            select(Medicine).where(and_(Medicine.elder_id == elder_id, Medicine.active == True))
        )
        return res.scalars().all()

    async def create_medicine(self, db: AsyncSession, med_data: MedicineCreate) -> Medicine:
        med = Medicine(
            elder_id=med_data.elder_id,
            medicine_name=med_data.medicine_name,
            dosage=med_data.dosage,
            dosage_unit=med_data.dosage_unit,
            frequency=med_data.frequency,
            scheduled_times=med_data.scheduled_times,
            instructions=med_data.instructions,
            active=med_data.active,
        )
        db.add(med)
        await db.flush()

        # Seed reminder events for today
        now = datetime.now(timezone.utc)
        for t in med_data.scheduled_times.split(","):
            t = t.strip()
            if not t:
                continue
            try:
                hr, mn = map(int, t.split(":"))
                sched_dt = now.replace(hour=hr, minute=mn, second=0, microsecond=0)
            except Exception:
                sched_dt = now + timedelta(hours=1)

            event = MedicineEvent(
                medicine_id=med.id,
                elder_id=med.elder_id,
                scheduled_at=sched_dt,
                status="PENDING",
            )
            db.add(event)

        await db.commit()
        await db.refresh(med)
        return med

    async def get_today_status(self, db: AsyncSession, elder_id: str) -> MedicineStatusSummary:
        raw = await tool_get_today_medicine_status(db, elder_id)
        events = [MedicineEventResponse(**e) for e in raw["events"]]
        return MedicineStatusSummary(
            total_scheduled=raw["total_scheduled"],
            taken_count=raw["taken_count"],
            missed_count=raw["missed_count"],
            pending_count=raw["pending_count"],
            adherence_percentage=raw["adherence_percentage"],
            events=events,
        )

    async def mark_taken(self, db: AsyncSession, event_id: str, acknowledged_by: str = "elder_tap") -> Dict[str, Any]:
        return await tool_mark_medicine_taken(db, elder_id="", event_id=event_id, acknowledged_by=acknowledged_by)

    async def mark_missed(self, db: AsyncSession, event_id: str) -> Dict[str, Any]:
        return await tool_mark_medicine_missed(db, elder_id="", event_id=event_id)

    async def mark_skip(self, db: AsyncSession, event_id: str) -> Dict[str, Any]:
        res = await db.execute(select(MedicineEvent).where(MedicineEvent.id == event_id))
        event = res.scalars().first()
        if event:
            event.status = "SKIPPED"
            await db.commit()
            return {"success": True, "status": "SKIPPED", "event_id": event_id}
        return {"success": False, "message": "Event not found"}


medicine_service = MedicineService()
