"""Daily Check-In REST API."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.checkin import CheckIn
from app.schemas.checkin import CheckInCreate, CheckInResponse
from app.tools.notification_tools import tool_dispatch_caregiver_alert

router = APIRouter(prefix="/checkins", tags=["Daily Check-In"])


@router.post("", response_model=CheckInResponse)
async def submit_daily_checkin(data: CheckInCreate, db: AsyncSession = Depends(get_db)):
    """Submits elder's daily morning check-in and triggers escalation if unwell."""
    mood_map = {
        "FINE": 4,
        "NEED_HELP": 3,
        "NOT_WELL": 2,
        "URGENT_HELP": 1,
    }
    mood_score = data.mood_score or mood_map.get(data.response.upper(), 3)
    escalation = "NONE"

    if data.response.upper() == "URGENT_HELP":
        escalation = "ESCALATED"
        await tool_dispatch_caregiver_alert(
            db,
            elder_id=data.elder_id,
            title="CRITICAL: Elder Requested Urgent Help",
            message="Elder indicated urgent help needed during morning check-in. Please contact immediately.",
        )
    elif data.response.upper() == "NOT_WELL":
        escalation = "CAREGIVER_NOTIFIED"
        await tool_dispatch_caregiver_alert(
            db,
            elder_id=data.elder_id,
            title="ATTENTION: Elder Feeling Unwell",
            message="Elder reported not feeling well during morning check-in. Consider checking in.",
        )
    elif data.response.upper() == "NEED_HELP":
        escalation = "CAREGIVER_NOTIFIED"
        await tool_dispatch_caregiver_alert(
            db,
            elder_id=data.elder_id,
            title="NOTICE: Elder Needs Assistance",
            message="Elder requested assistance with daily activities or supplies.",
        )

    checkin = CheckIn(
        elder_id=data.elder_id,
        check_in_time=datetime.now(timezone.utc),
        response=data.response.upper(),
        mood_score=mood_score,
        note=data.note,
        escalation_state=escalation,
    )
    db.add(checkin)
    await db.commit()
    await db.refresh(checkin)

    return CheckInResponse.model_validate(checkin)


@router.get("/{elder_id}/today")
async def get_today_checkin(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Returns the elder's latest check-in for today."""
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

    res = await db.execute(
        select(CheckIn)
        .where(and_(CheckIn.elder_id == elder_id, CheckIn.check_in_time >= start_of_day))
        .order_by(desc(CheckIn.check_in_time))
        .limit(1)
    )
    checkin = res.scalars().first()
    if checkin:
        return CheckInResponse.model_validate(checkin)
    return {"status": "CHECK_IN_PENDING", "message": "No check-in recorded yet today"}
