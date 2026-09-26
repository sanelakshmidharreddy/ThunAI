"""Unit and integration tests for AI Agents, LangGraph, and Multilingual Intents."""
import pytest
from app.agents.intent_agent import intent_agent
from app.graph.elder_graph import elder_orchestration_graph
from app.api.demo import DEMO_ELDER_ID
from app.tools.government_tools import tool_query_government_schemes


@pytest.mark.asyncio
async def test_intent_telugu():
    # Telugu check-in
    res = await intent_agent.extract_intent("నేను బాగున్నాను", user_language="te")
    assert res.intent == "DAILY_CHECK_IN"
    assert res.language == "te"


@pytest.mark.asyncio
async def test_intent_medicine_tamil():
    # Tamil medicine reminder
    res = await intent_agent.extract_intent("இரவு 8 மணிக்கு மாத்திரை நினைவூட்டு", user_language="ta")
    assert res.intent == "CREATE_MEDICINE_REMINDER"
    assert res.language == "ta"
    assert res.requires_confirmation is True


@pytest.mark.asyncio
async def test_intent_fall_emergency():
    # Emergency / Fall
    res = await intent_agent.extract_intent("Help me I have fallen down!", user_language="en")
    assert res.intent == "TRIGGER_SOS"
    assert res.suggested_route == "Emergency"


@pytest.mark.asyncio
async def test_government_schemes_lookup():
    schemes = tool_query_government_schemes("pension")
    assert len(schemes) > 0
    assert any("pension" in s["title"].lower() or "pension" in s["category"].lower() for s in schemes)


@pytest.mark.asyncio
async def test_langgraph_full_cycle():
    state = {
        "elder_id": DEMO_ELDER_ID,
        "input_text": "Call my daughter please",
        "language": "en",
        "intent_result": None,
        "next_step": "start",
        "action_result": None,
        "final_response": "",
        "requires_confirmation": False,
        "suggested_route": None,
        "error": None,
    }
    result = await elder_orchestration_graph.ainvoke(state)
    assert result["intent_result"].intent == "CALL_FAMILY"
    assert result["suggested_route"] == "Family"
    assert "Daughter" in result["final_response"]
