"""Family calling tools with deep-link and safe simulated calling."""
from typing import Dict, Any, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.caregiver import Caregiver


async def tool_get_family_contacts(
    db: AsyncSession,
    elder_id: str,
) -> List[Dict[str, Any]]:
    """Returns list of family members and emergency contacts for direct calling."""
    res = await db.execute(
        select(Caregiver).where(Caregiver.elder_id == elder_id).order_by(Caregiver.relationship.asc())
    )
    contacts = res.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "relationship": c.relationship,
            "phone": c.phone,
            "role": c.role,
            "emergency_contact": c.emergency_contact,
            "tel_uri": f"tel:{c.phone.replace(' ', '').replace('-', '')}",
        }
        for c in contacts
    ]


async def tool_initiate_safe_call(
    db: AsyncSession,
    elder_id: str,
    contact_name_or_relation: str,
) -> Dict[str, Any]:
    """
    Locates the matching family member and generates a safe call session.
    Provides tel: deep link for mobile devices and simulated call session for web/demo.
    """
    contacts = await tool_get_family_contacts(db, elder_id)
    search_term = contact_name_or_relation.lower()

    matched = None
    for c in contacts:
        if search_term in c["name"].lower() or search_term in c["relationship"].lower():
            matched = c
            break

    if not matched and contacts:
        matched = contacts[0]

    if matched:
        return {
            "success": True,
            "contact": matched,
            "tel_uri": matched["tel_uri"],
            "simulated": True,
            "message": f"Calling {matched['name']} ({matched['relationship']})...",
        }

    return {
        "success": False,
        "message": f"Could not find contact for '{contact_name_or_relation}'.",
    }
