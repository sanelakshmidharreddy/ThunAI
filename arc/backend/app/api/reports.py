"""Reports REST API for PDF report generation and download."""
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/{elder_id}", response_model=ReportResponse)
async def get_report_summary(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Generates and returns latest health & adherence report summary."""
    return await report_service.generate_health_report(db, elder_id=elder_id)


@router.post("/generate", response_model=ReportResponse)
async def generate_report(data: ReportGenerateRequest, db: AsyncSession = Depends(get_db)):
    """Requests on-demand generation of status report."""
    return await report_service.generate_health_report(
        db, elder_id=data.elder_id, date_range=data.date_range, format_type=data.format
    )


@router.get("/{elder_id}/download-pdf")
@router.get("/{elder_id}/pdf")
async def download_pdf_report(elder_id: str, db: AsyncSession = Depends(get_db)):
    """Generates and downloads a clean, printable PDF report."""
    pdf_bytes = await report_service.build_pdf_bytes(db, elder_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ARC_Health_Report_{elder_id[:8]}.pdf"},
    )
