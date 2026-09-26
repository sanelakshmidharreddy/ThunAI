"""Caregiver and family communication agent."""
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.voice import IntentResult
from app.tools.call_tools import tool_initiate_safe_call, tool_get_family_contacts
from app.tools.notification_tools import tool_dispatch_caregiver_alert


class CaregiverAgent:
    """Manages family calling and caregiver contact orchestration."""

    async def execute(self, db: AsyncSession, elder_id: str, intent_result: IntentResult) -> Dict[str, Any]:
        intent = intent_result.intent
        entities = intent_result.entities or {}

        if intent in ["CALL_FAMILY", "CONTACT_CAREGIVER"]:
            contact_query = entities.get("contact_name_or_relation", "Daughter")
            result = await tool_initiate_safe_call(db, elder_id, contact_query)
            return {"action": "call_initiated", "data": result}

        elif intent == "NAVIGATE_FAMILY":
            contacts = await tool_get_family_contacts(db, elder_id)
            return {"action": "family_contacts", "data": contacts}

        return {"action": "none", "data": {}}


caregiver_agent = CaregiverAgent()
