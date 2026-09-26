"""Deterministic caregiver alert notification tools."""
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.emergency import Notification


async def tool_dispatch_caregiver_alert(
    db: AsyncSession,
    elder_id: str,
    title: str,
    message: str,
    caregiver_id: str = None,
    channel: str = "IN_APP",
) -> Dict[str, Any]:
    """Logs and dispatches an alert for caregiver attention."""
    notif = Notification(
        elder_id=elder_id,
        caregiver_id=caregiver_id,
        title=title,
        message=message,
        channel=channel,
        is_read=False,
    )
    db.add(notif)
    await db.commit()

    return {
        "success": True,
        "notification_id": notif.id,
        "title": title,
        "created_at": notif.created_at.isoformat(),
    }


async def tool_get_recent_alerts(
    db: AsyncSession,
    elder_id: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Fetches recent notification alerts for caregiver dashboard."""
    res = await db.execute(
        select(Notification)
        .where(Notification.elder_id == elder_id)
        .order_by(desc(Notification.created_at))
        .limit(limit)
    )
    notifs = res.scalars().all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "channel": n.channel,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
        }
        for n in notifs
    ]
