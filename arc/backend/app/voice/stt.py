"""Speech-to-Text Gateway with dynamic provider resolution."""
import logging
from typing import Optional
from app.config import settings
from app.voice.providers.base import STTProvider, STTResult
from app.voice.providers.whisper import WhisperSTTProvider
from app.voice.providers.sarvam import SarvamSTTProvider
from app.voice.providers.device import DeviceSTTProvider

logger = logging.getLogger(__name__)


def get_stt_provider(provider_name: Optional[str] = None, language: Optional[str] = None) -> STTProvider:
    """Factory to get the appropriate STT provider."""
    name = (provider_name or settings.VOICE_PROVIDER).lower()

    # If language is Tamil/Hindi/Telugu and Sarvam API key is available, prefer Sarvam
    if language in ["ta", "hi", "te"] and settings.SARVAM_API_KEY:
        return SarvamSTTProvider()

    if name == "sarvam":
        return SarvamSTTProvider()
    elif name == "whisper":
        return WhisperSTTProvider()
    else:
        return DeviceSTTProvider()


async def transcribe_audio(audio_bytes: bytes, language: Optional[str] = None) -> STTResult:
    """Gateway method to transcribe audio."""
    provider = get_stt_provider(language=language)
    return await provider.transcribe(audio_bytes, language=language)
