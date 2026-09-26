"""Health Agent executing deterministic health readings and statistics."""
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.voice import IntentResult
from app.tools.health_tools import (
    tool_record_health_reading,
    tool_get_health_summary,
    tool_get_weekly_trend,
    tool_get_monthly_trend,
)


class HealthAgent:
    """Manages recording and retrieval of health metrics."""

    async def execute(self, db: AsyncSession, elder_id: str, intent_result: IntentResult) -> Dict[str, Any]:
        intent = intent_result.intent
        entities = intent_result.entities or {}

        if intent == "RECORD_BLOOD_PRESSURE":
            result = await tool_record_health_reading(
                db=db,
                elder_id=elder_id,
                reading_type="BLOOD_PRESSURE",
                systolic=entities.get("systolic"),
                diastolic=entities.get("diastolic"),
                unit="mmHg",
                source="elder_voice",
            )
            return {"action": "reading_recorded", "data": result}

        elif intent == "RECORD_BLOOD_SUGAR":
            result = await tool_record_health_reading(
                db=db,
                elder_id=elder_id,
                reading_type="BLOOD_SUGAR",
                value=entities.get("blood_sugar"),
                unit="mg/dL",
                source="elder_voice",
            )
            return {"action": "reading_recorded", "data": result}

        elif intent in ["RECORD_HEART_RATE", "RECORD_PULSE"]:
            result = await tool_record_health_reading(
                db=db,
                elder_id=elder_id,
                reading_type="HEART_RATE",
                value=entities.get("heart_rate"),
                unit="BPM",
                source="elder_voice",
            )
            return {"action": "reading_recorded", "data": result}

        elif intent == "VIEW_WEEKLY_REPORT":
            trend = await tool_get_weekly_trend(db, elder_id)
            return {"action": "weekly_trend", "data": trend}

        elif intent == "VIEW_MONTHLY_REPORT":
            trend = await tool_get_monthly_trend(db, elder_id)
            return {"action": "monthly_trend", "data": trend}

        elif intent in ["VIEW_HEALTH_HISTORY", "NAVIGATE_HEALTH"]:
            summary = await tool_get_health_summary(db, elder_id)
            return {"action": "health_summary", "data": summary}

        return {"action": "none", "data": {}}


health_agent = HealthAgent()
