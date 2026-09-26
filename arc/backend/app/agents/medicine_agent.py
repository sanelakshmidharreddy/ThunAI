"""Medicine Agent orchestrating medicine schedule and adherence tools."""
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.voice import IntentResult
from app.tools.medicine_tools import (
    tool_create_medicine_reminder,
    tool_mark_medicine_taken,
    tool_mark_medicine_missed,
    tool_get_today_medicine_status,
)


class MedicineAgent:
    """Manages medicine workflow execution."""

    async def execute(self, db: AsyncSession, elder_id: str, intent_result: IntentResult) -> Dict[str, Any]:
        intent = intent_result.intent
        entities = intent_result.entities or {}

        if intent == "CREATE_MEDICINE_REMINDER":
            # If requires_confirmation is True, the tool execution waits for elder tap confirmation
            # When executed with confirmation or direct request:
            med_name = entities.get("medicine_name", "Prescribed Tablet")
            scheduled_time = entities.get("time", "20:00")
            result = await tool_create_medicine_reminder(
                db=db,
                elder_id=elder_id,
                medicine_name=med_name,
                scheduled_time=scheduled_time,
            )
            return {"action": "reminder_created", "data": result}

        elif intent == "REPORT_MEDICINE_TAKEN":
            result = await tool_mark_medicine_taken(
                db=db,
                elder_id=elder_id,
                acknowledged_by="elder_voice",
            )
            return {"action": "medicine_taken", "data": result}

        elif intent == "REPORT_MEDICINE_MISSED":
            result = await tool_mark_medicine_missed(
                db=db,
                elder_id=elder_id,
            )
            return {"action": "medicine_missed", "data": result}

        elif intent in ["CHECK_MEDICINE_STATUS", "NAVIGATE_MEDICINES"]:
            status = await tool_get_today_medicine_status(db=db, elder_id=elder_id)
            return {"action": "status_retrieved", "data": status}

        return {"action": "none", "data": {}}


medicine_agent = MedicineAgent()
