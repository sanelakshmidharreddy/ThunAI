"""Emergency Agent orchestrating SOS and fall detection workflows."""
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.voice import IntentResult
from app.tools.emergency_tools import (
    tool_trigger_sos,
    tool_simulate_fall,
    tool_resolve_emergency,
    tool_get_active_emergency,
)


class EmergencyAgent:
    """Coordinates emergency actions, notifications, and escalation."""

    async def execute(self, db: AsyncSession, elder_id: str, intent_result: IntentResult) -> Dict[str, Any]:
        intent = intent_result.intent
        entities = intent_result.entities or {}

        if intent in ["TRIGGER_SOS", "CALL_EMERGENCY"]:
            result = await tool_trigger_sos(
                db=db,
                elder_id=elder_id,
                source="voice",
                latitude=entities.get("latitude"),
                longitude=entities.get("longitude"),
                notes="Voice-triggered emergency request from elder",
            )
            return {"action": "sos_triggered", "data": result}

        elif intent == "SIMULATE_FALL":
            result = await tool_simulate_fall(
                db=db,
                elder_id=elder_id,
                latitude=entities.get("latitude"),
                longitude=entities.get("longitude"),
            )
            return {"action": "fall_simulated", "data": result}

        return {"action": "none", "data": {}}


emergency_agent = EmergencyAgent()
