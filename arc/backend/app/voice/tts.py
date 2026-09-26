"""Text-to-Speech Gateway with dynamic provider resolution."""
import logging
from typing import Optional
from app.config import settings
from app.voice.providers.base import TTSProvider, TTSResult
from app.voice.providers.sarvam import SarvamTTSProvider
from app.voice.providers.device import DeviceTTSProvider

logger = logging.getLogger(__name__)


def get_tts_provider(provider_name: Optional[str] = None, language: str = "en") -> TTSProvider:
    """Factory to get the appropriate TTS provider."""
    name = (provider_name or settings.VOICE_PROVIDER).lower()

    if language in ["ta", "hi", "te"] and settings.SARVAM_API_KEY:
        return SarvamTTSProvider()

    if name == "sarvam":
        return SarvamTTSProvider()
    else:
        return DeviceTTSProvider()


async def synthesize_speech(text: str, language: str = "en") -> TTSResult:
    """Gateway method to synthesize speech audio from text."""
    provider = get_tts_provider(language=language)
    return await provider.synthesize(text, language=language)
