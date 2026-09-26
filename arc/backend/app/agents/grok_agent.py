"""xAI Grok Integration Agent for ARC Elderly Companion.
Provides generative, empathetic, senior-friendly conversation powered by Grok.
Falls back seamlessly to local curated QA if API key is not provided or network is offline.
"""
import os
import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

GROK_BASE_URL = os.environ.get("XAI_API_BASE_URL", getattr(settings, "XAI_API_BASE_URL", "https://api.x.ai/v1"))
DEFAULT_GROK_MODEL = os.environ.get("GROK_MODEL", getattr(settings, "GROK_MODEL", "grok-beta"))


class GrokCompanionAgent:
    """Manages conversational dialogue using xAI Grok API."""

    def __init__(self):
        self.api_key = (
            os.environ.get("GROK_API_KEY")
            or os.environ.get("XAI_API_KEY")
            or getattr(settings, "GROK_API_KEY", "")
        )

    def set_api_key(self, key: str):
        """Allows dynamically setting the Grok API key at runtime."""
        self.api_key = key.strip()
        os.environ["GROK_API_KEY"] = self.api_key

    def has_api_key(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def _build_system_prompt(self, language: str) -> str:
        lang_instruction = {
            "te": "Respond in warm, respectful Telugu (తెలుగు) using simple words suitable for an elder.",
            "ta": "Respond in warm, respectful Tamil (தமிழ்) using simple words suitable for an elder.",
            "hi": "Respond in warm, respectful Hindi (हिंदी) using simple words suitable for an elder.",
            "en": "Respond in warm, respectful, caring English using clear, simple vocabulary.",
        }.get(language, "Respond in warm, respectful, caring English.")

        return (
            "You are ARC (AI Responsive Companion), a dedicated voice companion for an Indian elderly senior citizen.\n"
            "ELDER PROFILE:\n"
            "- Name: Lakshmidhar Reddy (referred to respectfully as 'Lakshmidhar Reddy garu' or 'Lakshmidhar Reddy')\n"
            "- Phone: +91 8328287227\n"
            "- Primary Caregiver / Son: Rahul (phone: +91 9080503005)\n"
            "- Health Today: Blood pressure 124/78 mmHg (normal), Heart rate 72 bpm (steady), Blood sugar 108 mg/dL (normal), 3/3 daily medicines taken (Metformin, Amlodipine, Atorvastatin).\n"
            "\n"
            "COMMUNICATION RULES:\n"
            f"1. {lang_instruction}\n"
            "2. Keep responses concise (2 to 4 sentences maximum) because your response will be read aloud via Text-to-Speech.\n"
            "3. If the user feels lonely, alone, sad, or isolated, respond with deep emotional empathy, reassuring companionship, remind them Rahul loves them, and offer to call Rahul.\n"
            "4. If the user asks about health, reassure them that their vitals are normal and controlled today.\n"
            "5. If the user asks to navigate, see dashboard, or call family, confirm warmly that you are assisting them with that action.\n"
            "6. Always speak with kindness, respect, patience, and warmth. Never use technical jargon."
        )

    def generate_response(self, user_query: str, language: str = "en") -> Optional[str]:
        """Calls xAI Grok chat completions synchronously or returns None on failure."""
        api_key = (
            self.api_key
            or os.environ.get("GROK_API_KEY")
            or os.environ.get("XAI_API_KEY")
            or getattr(settings, "GROK_API_KEY", "")
        )
        if not api_key:
            return None

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": DEFAULT_GROK_MODEL,
            "messages": [
                {"role": "system", "content": self._build_system_prompt(language)},
                {"role": "user", "content": user_query},
            ],
            "temperature": 0.6,
            "max_tokens": 180,
        }

        try:
            with httpx.Client(timeout=8.0) as client:
                res = client.post(f"{GROK_BASE_URL}/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices and "message" in choices[0]:
                        content = choices[0]["message"].get("content", "").strip()
                        if content:
                            return content
                else:
                    logger.warning(f"Grok API returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.warning(f"Grok API call failed: {e}. Falling back to local senior engine.")

        return None


grok_agent = GrokCompanionAgent()
