"""Government Services and Senior Citizen Benefits API."""
from typing import List, Dict, Any
from fastapi import APIRouter, Query
from app.tools.government_tools import tool_query_government_schemes

router = APIRouter(prefix="/government", tags=["Government Services"])


@router.get("/schemes", response_model=List[Dict[str, Any]])
async def get_government_schemes(query: str = Query(default="", description="Search query")):
    """Retrieves verified public government schemes, pensions, and healthcare benefits for seniors."""
    return tool_query_government_schemes(query)
