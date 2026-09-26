"""Pydantic schemas for health and status reports."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ReportGenerateRequest(BaseModel):
    elder_id: str
    date_range: str = Field(default="last_7_days")  # today, last_7_days, last_30_days
    format: str = Field(default="pdf")  # pdf, json, csv
    include_sensitive_notes: bool = False


class ReportResponse(BaseModel):
    report_id: str
    elder_id: str
    elder_name: str
    generated_at: datetime
    date_range: str
    download_url: Optional[str] = None
    summary_text: str
    health_metrics: Dict[str, Any]
    medicine_adherence: Dict[str, Any]
    check_in_summary: Dict[str, Any]
    alerts_count: int

    model_config = ConfigDict(from_attributes=True)
