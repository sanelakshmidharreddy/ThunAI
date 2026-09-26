"""Abstract Base Classes for Voice Gateway STT and TTS Providers."""
from abc import ABC, abstractmethod
from typing import Optional
from pydantic import BaseModel


class STTResult(BaseModel):
    text: str
    confidence: float = 1.0
    detected_language: str = "en"
    duration_seconds: Optional[float] = None


class TTSResult(BaseModel):
    audio_base64: Optional[str] = None
    audio_bytes: Optional[bytes] = None
    format: str = "wav"  # wav, mp3, webm
    duration_seconds: Optional[float] = None
    sample_rate: int = 24000


class STTProvider(ABC):
    """Abstract STT Provider interface."""

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, language: Optional[str] = None) -> STTResult:
        """Convert raw speech audio bytes into transcribed text."""
        pass


class TTSProvider(ABC):
    """Abstract TTS Provider interface."""

    @abstractmethod
    async def synthesize(self, text: str, language: str = "en") -> TTSResult:
        """Convert response text into synthesized speech audio."""
        pass


class VoiceProvider(ABC):
    """Unified voice provider facade."""

    @property
    @abstractmethod
    def stt(self) -> STTProvider:
        pass

    @property
    @abstractmethod
    def tts(self) -> TTSProvider:
        pass
