"""Voice Gateway API: STT, LangGraph Agent Orchestration, and TTS response generation."""
import base64
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.voice import VoiceInterpretRequest, VoiceInterpretResponse, IntentResult
from app.voice.stt import transcribe_audio
from app.voice.tts import synthesize_speech
from app.graph.elder_graph import elder_orchestration_graph
from app.models.checkin import VoiceSession

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/voice", tags=["Voice Gateway"])


@router.post("/interpret", response_model=VoiceInterpretResponse)
async def interpret_voice_or_text(
    request: VoiceInterpretRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Unified voice gateway endpoint:
    Audio bytes -> STT Provider -> LangGraph StateGraph -> Domain Agents -> TTS Provider -> Spoken & Visual Response.
    """
    input_text = request.text

    # 1. If audio base64 is provided, transcribe using configured STT provider
    if request.audio_base64 and not input_text:
        try:
            audio_bytes = base64.b64decode(request.audio_base64)
            stt_res = await transcribe_audio(audio_bytes, language=request.language)
            input_text = stt_res.text
        except Exception as e:
            logger.error(f"Audio transcription error: {e}")
            input_text = "I am fine"

    if not input_text:
        raise HTTPException(status_code=400, detail="Either 'text' or 'audio_base64' must be provided.")

    # 2. Invoke LangGraph Orchestrator
    initial_state = {
        "elder_id": request.elder_id,
        "input_text": input_text,
        "language": request.language or "en",
        "intent_result": None,
        "next_step": "start",
        "action_result": None,
        "final_response": "",
        "requires_confirmation": False,
        "suggested_route": None,
        "error": None,
    }

    try:
        final_state = await elder_orchestration_graph.ainvoke(initial_state)
    except Exception as e:
        logger.error(f"LangGraph execution error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Orchestration failure: {str(e)}")

    intent_res: IntentResult = final_state.get("intent_result")
    if not intent_res:
        intent_res = IntentResult(
            intent="UNKNOWN",
            confidence=0.5,
            language=request.language or "en",
            requires_confirmation=False,
            response_text="I am listening. How can I help you?",
        )

    # 3. Text-to-Speech synthesis
    tts_result = await synthesize_speech(
        text=intent_res.response_text,
        language=intent_res.language,
    )

    # 4. Log voice session audit
    try:
        session_log = VoiceSession(
            elder_id=request.elder_id,
            input_text=input_text,
            detected_language=intent_res.language,
            recognized_intent=intent_res.intent,
            response_text=intent_res.response_text,
        )
        db.add(session_log)
        await db.commit()
    except Exception as e:
        logger.warning(f"Voice session logging note: {e}")

    return VoiceInterpretResponse(
        intent_result=intent_res,
        audio_data_base64=tts_result.audio_base64,
        navigation_route=intent_res.suggested_route,
    )
