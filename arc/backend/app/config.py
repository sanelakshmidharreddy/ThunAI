"""
Configuration settings for ARC (AI Responsive Companion).
Supports environment variable overrides and sensible defaults for local development.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ARC - AI Responsive Companion"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # Database
    # Defaults to SQLite async for immediate out-of-the-box local hackathon execution.
    # Set DATABASE_URL to postgresql+asyncpg://... for PostgreSQL production / docker.
    DATABASE_URL: str = "sqlite+aiosqlite:///./arc.db"

    # Redis (architecturally supported, optional for initial MVP)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_ENABLED: bool = False

    # AI & LLM Providers
    LLM_PROVIDER: str = "auto"  # "auto" | "grok" | "openai" | "gemini" | "rule_fallback"
    GROK_API_KEY: str = ""
    XAI_API_BASE_URL: str = "https://api.x.ai/v1"
    GROK_MODEL: str = "grok-beta"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Voice Providers
    # "device" uses client-side Web Speech / Expo Speech with server-coordinated intent
    # "whisper" uses Whisper API or local whisper
    # "sarvam" uses Sarvam AI for Indian languages (Tamil, Hindi, Telugu)
    VOICE_PROVIDER: str = "device"
    SARVAM_API_KEY: str = ""
    SARVAM_BASE_URL: str = "https://api.sarvam.ai"

    # Supported Languages
    SUPPORTED_LANGUAGES: List[str] = ["en", "ta", "hi", "te"]
    DEFAULT_LANGUAGE: str = "en"

    # Demo & Simulation Mode
    DEMO_MODE: bool = True
    SIMULATED_LOCATION_LAT: float = 13.0827  # Chennai default
    SIMULATED_LOCATION_LNG: float = 80.2707

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
