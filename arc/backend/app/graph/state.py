"""LangGraph state representation for elder voice and task orchestration."""
from typing import TypedDict, Optional, Dict, Any
from app.schemas.voice import IntentResult


class ElderState(TypedDict):
    elder_id: str
    input_text: str
    language: str
    intent_result: Optional[IntentResult]
    next_step: str
    action_result: Optional[Dict[str, Any]]
    final_response: str
    requires_confirmation: bool
    suggested_route: Optional[str]
    error: Optional[str]
