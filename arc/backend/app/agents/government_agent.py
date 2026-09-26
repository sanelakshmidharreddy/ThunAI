"""Government Services Agent retrieving verified public elder benefits."""
from typing import Dict, Any
from app.schemas.voice import IntentResult
from app.tools.government_tools import tool_query_government_schemes


class GovernmentAgent:
    """Answers senior citizen scheme questions strictly from verified sources."""

    async def execute(self, intent_result: IntentResult) -> Dict[str, Any]:
        query = intent_result.entities.get("query", "")
        schemes = tool_query_government_schemes(query)

        summary_parts = []
        for s in schemes[:2]:
            summary_parts.append(f"{s['title']}: {s['summary']} (Source: {s['source']})")

        return {
            "action": "schemes_retrieved",
            "schemes": schemes,
            "disclaimer": "Official public information. Please verify with the respective government department.",
            "summary": " ".join(summary_parts),
        }


government_agent = GovernmentAgent()
