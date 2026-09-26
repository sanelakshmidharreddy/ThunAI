"""LangGraph node execution functions."""
import logging
from typing import Dict, Any
from app.graph.state import ElderState
from app.agents.intent_agent import intent_agent
from app.agents.government_agent import government_agent
from app.db.database import AsyncSessionLocal
from app.agents.medicine_agent import medicine_agent
from app.agents.emergency_agent import emergency_agent
from app.agents.caregiver_agent import caregiver_agent
from app.agents.health_agent import health_agent

logger = logging.getLogger(__name__)


async def node_intent_extractor(state: ElderState) -> Dict[str, Any]:
    """Node: Uses IntentAgent to understand speech/text and extract structured IntentResult."""
    text = state.get("input_text", "")
    lang = state.get("language", "en")

    intent_res = await intent_agent.extract_intent(text, user_language=lang)

    return {
        "intent_result": intent_res,
        "language": intent_res.language,
        "requires_confirmation": intent_res.requires_confirmation,
        "final_response": intent_res.response_text,
        "suggested_route": intent_res.suggested_route,
    }


def node_router(state: ElderState) -> str:
    """Conditional edge router determining the downstream specialized agent."""
    intent_res = state.get("intent_result")
    if not intent_res:
        return "confirmation_node"

    intent = intent_res.intent

    if intent in [
        "CREATE_MEDICINE_REMINDER",
        "CHECK_MEDICINE_STATUS",
        "REPORT_MEDICINE_TAKEN",
        "REPORT_MEDICINE_MISSED",
        "NAVIGATE_MEDICINES",
    ]:
        return "medicine_node"

    elif intent in ["TRIGGER_SOS", "CALL_EMERGENCY", "SIMULATE_FALL"]:
        return "emergency_node"

    elif intent in ["CALL_FAMILY", "CONTACT_CAREGIVER", "NAVIGATE_FAMILY"]:
        return "caregiver_node"

    elif intent in [
        "RECORD_BLOOD_PRESSURE",
        "RECORD_BLOOD_SUGAR",
        "RECORD_HEART_RATE",
        "RECORD_PULSE",
        "RECORD_CREATININE",
        "VIEW_HEALTH_HISTORY",
        "VIEW_WEEKLY_REPORT",
        "VIEW_MONTHLY_REPORT",
        "NAVIGATE_HEALTH",
    ]:
        return "health_node"

    elif intent == "GOVERNMENT_QUERY":
        return "government_node"

    return "confirmation_node"


async def node_medicine_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Executes medicine agent tools."""
    elder_id = state.get("elder_id", "")
    intent_res = state.get("intent_result")

    # If the action requires elder confirmation first (e.g. creating reminder with Yes/No button),
    # we don't write to DB yet until elder confirms.
    if intent_res.requires_confirmation:
        return {
            "action_result": {"status": "waiting_for_confirmation", "entities": intent_res.entities}
        }

    async with AsyncSessionLocal() as session:
        result = await medicine_agent.execute(session, elder_id, intent_res)
        return {"action_result": result}


async def node_emergency_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Executes emergency agent tools."""
    elder_id = state.get("elder_id", "")
    intent_res = state.get("intent_result")

    async with AsyncSessionLocal() as session:
        result = await emergency_agent.execute(session, elder_id, intent_res)
        return {"action_result": result}


async def node_caregiver_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Executes family calling and caregiver contact tools."""
    elder_id = state.get("elder_id", "")
    intent_res = state.get("intent_result")

    async with AsyncSessionLocal() as session:
        result = await caregiver_agent.execute(session, elder_id, intent_res)
        return {"action_result": result}


async def node_health_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Executes health measurement and reading tools."""
    elder_id = state.get("elder_id", "")
    intent_res = state.get("intent_result")

    async with AsyncSessionLocal() as session:
        result = await health_agent.execute(session, elder_id, intent_res)
        return {"action_result": result}


async def node_government_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Executes verified public government schemes lookup."""
    intent_res = state.get("intent_result")
    result = await government_agent.execute(intent_res)
    return {"action_result": result}


async def node_confirmation_agent(state: ElderState) -> Dict[str, Any]:
    """Node: Finalizes response text and prepares payload for elder & caregiver."""
    intent_res = state.get("intent_result")
    action_res = state.get("action_result")

    response = state.get("final_response", "")
    if action_res and action_res.get("data", {}).get("message"):
        # Append tool confirmation note if relevant
        pass

    return {
        "final_response": response,
        "next_step": "complete",
    }
