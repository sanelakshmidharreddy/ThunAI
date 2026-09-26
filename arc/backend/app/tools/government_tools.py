"""Verified public government services knowledge base and retrieval tool."""
from typing import Dict, Any, List

VERIFIED_GOVERNMENT_SCHEMES = [
    {
        "id": "elder_line_14567",
        "title": "Elder Line - National Helpline for Senior Citizens",
        "category": "Emergency & Support",
        "summary": "Toll-free national helpline (14567) operating across India offering information, emotional support, and rescue services for seniors.",
        "phone": "14567",
        "source": "Ministry of Social Justice and Empowerment (Govt. of India)",
        "disclaimer": "Official Government Helpline. Call 14567 directly from any phone.",
        "benefits": "Free guidance, elder abuse rescue, legal aid info, shelter support.",
    },
    {
        "id": "ayushman_bharat_70_plus",
        "title": "Ayushman Bharat Senior Health Coverage (AB-PMJAY)",
        "category": "Healthcare Benefits",
        "summary": "Comprehensive health insurance cover of up to ₹5 Lakh per year for all senior citizens aged 70 years and above, irrespective of income.",
        "source": "National Health Authority (NHA)",
        "disclaimer": "Please verify eligibility and hospital empanelment with official PMJAY portal (pmjay.gov.in) or call 14555.",
        "benefits": "Cashless secondary and tertiary healthcare in empanelled public and private hospitals.",
    },
    {
        "id": "ignoaps_pension",
        "title": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
        "category": "Pension & Financial",
        "summary": "Monthly pension for senior citizens aged 60+ belonging to below-poverty-line (BPL) households, with higher pension for ages 80+.",
        "source": "National Social Assistance Programme (NSAP)",
        "disclaimer": "Applications processed through local District Social Welfare Office or Gram Panchayat.",
        "benefits": "Direct bank transfer monthly financial stipend.",
    },
    {
        "id": "varishtha_medi_claim",
        "title": "Senior Citizen Health and OPD Priority Services",
        "category": "Hospital Services",
        "summary": "Designated priority queues at government district hospitals, medical colleges, and AIIMS for patients aged 60 and above.",
        "source": "Ministry of Health and Family Welfare",
        "disclaimer": "Subject to state government health guidelines and hospital capacity.",
        "benefits": "Separate registration counter, medicine dispensing priority, and geriatric clinics.",
    }
]


def tool_query_government_schemes(query_text: str = "") -> List[Dict[str, Any]]:
    """Returns verified public government schemes matching the user query."""
    q = query_text.lower().strip()
    if not q:
        return VERIFIED_GOVERNMENT_SCHEMES

    matches = []
    for s in VERIFIED_GOVERNMENT_SCHEMES:
        if (
            q in s["title"].lower()
            or q in s["category"].lower()
            or q in s["summary"].lower()
            or q in s["benefits"].lower()
        ):
            matches.append(s)

    return matches if matches else VERIFIED_GOVERNMENT_SCHEMES
