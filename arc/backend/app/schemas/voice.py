"""Pydantic schemas for voice and intent extraction."""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class IntentResult(BaseModel):
    intent: str = Field(..., description="Recognized intent enum string")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    language: str = Field(default="en", description="Detected language code (en, ta, hi, te)")
    entities: Dict[str, Any] = Field(default_factory=dict, description="Extracted parameters (time, medicine, values)")
    requires_confirmation: bool = Field(default=False, description="Whether confirmation is required before tool action")
    response_text: str = Field(..., description="Elder-friendly natural language response")
    action_executed: bool = Field(default=False, description="Whether deterministic action was executed directly")
    action_payload: Optional[Dict[str, Any]] = Field(default=None, description="Action execution output if any")
    suggested_route: Optional[str] = Field(default=None, description="App navigation route if intent is navigation")


class VoiceInterpretRequest(BaseModel):
    elder_id: str = Field(..., description="ID of the elder user")
    text: Optional[str] = Field(default=None, description="Spoken or typed user prompt")
    audio_base64: Optional[str] = Field(default=None, description="Base64 encoded audio bytes for STT")
    language: Optional[str] = Field(default="en", description="Preferred language (en, ta, hi, te)")
    source: Optional[str] = Field(default="mobile_voice", description="Source of the request")


class VoiceInterpretResponse(BaseModel):
    intent_result: IntentResult
    audio_data_base64: Optional[str] = None
    audio_url: Optional[str] = None
    navigation_route: Optional[str] = None
