"""Dual AI (Groq & xAI) Generative Companion Agent for ARC.
Powers real-time, empathetic, senior-friendly voice intelligence like Siri/Alexa.
Auto-detects API key type (Groq gsk_ or xAI xai-) and uses ultra-fast cloud inference.
Falls back seamlessly to local curated QA if offline.
"""
import os
import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class GrokCompanionAgent:
    """Manages conversational dialogue using Groq Cloud or xAI Grok API."""

    def __init__(self):
        self.api_key = (
            os.environ.get("GROK_API_KEY")
            or os.environ.get("GROQ_API_KEY")
            or os.environ.get("XAI_API_KEY")
            or getattr(settings, "GROK_API_KEY", "")
        )

    def set_api_key(self, key: str):
        """Allows dynamically setting the API key at runtime."""
        self.api_key = key.strip()
        os.environ["GROK_API_KEY"] = self.api_key
        os.environ["GROQ_API_KEY"] = self.api_key

    def has_api_key(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def _resolve_provider_and_model(self, api_key: str):
        """Auto-detects provider URL and model from key prefix."""
        if api_key.startswith("gsk_"):
            return "https://api.groq.com/openai/v1", "openai/gpt-oss-120b", "openai/gpt-oss-20b"
        else:
            base_url = os.environ.get("XAI_API_BASE_URL", getattr(settings, "XAI_API_BASE_URL", "https://api.x.ai/v1"))
            model = os.environ.get("GROK_MODEL", getattr(settings, "GROK_MODEL", "grok-beta"))
            return base_url, model, None

    def _build_system_prompt(self, language: str) -> str:
        lang_instruction = {
            "te": "Respond warmly in Telugu (తెలుగు). Use simple, respectful words suitable for an elder.",
            "ta": "Respond warmly in Tamil (தமிழ்). Use simple, respectful words suitable for an elder.",
            "hi": "Respond warmly in Hindi (हिंदी). Use simple, respectful words suitable for an elder.",
            "en": "Respond warmly, clearly, and respectfully in English using simple, caring vocabulary.",
        }.get(language, "Respond warmly and respectfully in English.")

        return (
            "You are ARC (AI Responsive Companion), an experienced voice assistant for an Indian elderly senior citizen, functioning with the responsiveness of Siri or Alexa.\n"
            "ELDER PROFILE:\n"
            "- Name: Lakshmidhar Reddy (address him respectfully as 'Lakshmidhar Reddy garu' or 'Lakshmidhar Reddy')\n"
            "- Primary Caregiver / Son: Rahul (phone: +91 9080503005)\n"
            "- Health Today: Blood pressure 124/78 mmHg (normal), Heart rate 72 bpm, Blood sugar 108 mg/dL, 3/3 daily medicines taken (Metformin, Amlodipine, Atorvastatin).\n"
            "\n"
            "VOICE ASSISTANT RULES:\n"
            f"1. {lang_instruction}\n"
            "2. Keep answers concise (2 to 3 sentences maximum) so they sound natural and clear when spoken aloud via Text-to-Speech.\n"
            "3. Answer EVERY situation, concern, or question Lakshmidhar Reddy asks — whether about feeling alone, pain, diet, daily routine, medicines, or curiosity.\n"
            "4. If he feels lonely or sad, respond with reassuring warmth, remind him his son Rahul cares deeply for him, and offer to connect him with Rahul.\n"
            "5. If he asks about his health or vitals, reassure him that his readings are steady and normal today.\n"
            "6. Always speak with patience, utmost kindness, and positive reassurance. Never use complicated medical or technical jargon."
        )

    def generate_response(self, user_query: str, language: str = "en") -> Optional[str]:
        """Calls Groq / xAI chat completions with automated fallback."""
        api_key = (
            self.api_key
            or os.environ.get("GROK_API_KEY")
            or os.environ.get("GROQ_API_KEY")
            or os.environ.get("XAI_API_KEY")
            or getattr(settings, "GROK_API_KEY", "")
        )
        if not api_key:
            return None

        base_url, primary_model, backup_model = self._resolve_provider_and_model(api_key)

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        # Try primary model first, fallback to backup if needed
        models_to_try = [primary_model]
        if backup_model:
            models_to_try.append(backup_model)

        for model in models_to_try:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": self._build_system_prompt(language)},
                    {"role": "user", "content": user_query},
                ],
                "temperature": 0.6,
                "max_tokens": 160,
            }

            try:
                with httpx.Client(timeout=6.0) as client:
                    res = client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        choices = data.get("choices", [])
                        if choices and "message" in choices[0]:
                            content = choices[0]["message"].get("content", "").strip()
                            if content:
                                return content
                    else:
                        logger.warning(f"AI provider ({model}) returned {res.status_code}: {res.text}")
            except Exception as e:
                logger.warning(f"AI provider call ({model}) failed: {e}")

        return None


grok_agent = GrokCompanionAgent()
