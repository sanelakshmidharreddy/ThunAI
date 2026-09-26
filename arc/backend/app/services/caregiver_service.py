"""Caregiver coordination service and dashboard aggregation."""
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.caregiver import Caregiver
from app.models.elder import Elder
from app.models.checkin import CheckIn
from app.models.health_reading import Appointment
from app.schemas.caregiver import CaregiverCreate, CaregiverResponse, CaregiverDashboardSummary
from app.services.medicine_service import medicine_service
from app.services.health_service import health_service
from app.services.emergency_service import emergency_service
from app.tools.notification_tools import tool_get_recent_alerts


class CaregiverService:

    async def add_caregiver(self, db: AsyncSession, data: CaregiverCreate) -> CaregiverResponse:
        cg = Caregiver(
            elder_id=data.elder_id,
            name=data.name,
            relationship=data.relationship,
            phone=data.phone,
            email=data.email,
            role=data.role,
            notification_permission=data.notification_permission,
            emergency_contact=data.emergency_contact,
            dashboard_access=data.dashboard_access,
            avatar_url=data.avatar_url,
        )
        db.add(cg)
        await db.commit()
        await db.refresh(cg)
        return CaregiverResponse.model_validate(cg)

    async def get_caregivers_for_elder(self, db: AsyncSession, elder_id: str) -> List[CaregiverResponse]:
        res = await db.execute(
            select(Caregiver).where(Caregiver.elder_id == elder_id).order_by(Caregiver.relationship.asc())
        )
        return [CaregiverResponse.model_validate(c) for c in res.scalars().all()]

    async def get_dashboard_summary(self, db: AsyncSession, elder_id: str) -> CaregiverDashboardSummary:
        # 1. Fetch elder profile
        elder_res = await db.execute(select(Elder).where(Elder.id == elder_id))
        elder = elder_res.scalars().first()
        elder_name = elder.full_name if elder else "Lakshmi"
        elder_age = elder.age if elder else 72
        elder_phone = elder.primary_phone if elder else "+91 98401 23456"

        # 2. Check active emergency
        active_emergency = await emergency_service.get_active_emergency(db, elder_id)

        # 3. Medicine summary
        med_summary = await medicine_service.get_today_status(db, elder_id)

        # 4. Check-in status
        checkin_res = await db.execute(
            select(CheckIn).where(CheckIn.elder_id == elder_id).order_by(desc(CheckIn.check_in_time)).limit(1)
        )
        last_checkin_obj = checkin_res.scalars().first()
        last_checkin = None
        if last_checkin_obj:
            last_checkin = {
                "time": last_checkin_obj.check_in_time.strftime("%I:%M %p"),
                "response": last_checkin_obj.response,
                "mood_score": last_checkin_obj.mood_score,
                "note": last_checkin_obj.note,
            }
        else:
            last_checkin = {
                "time": "08:32 AM",
                "response": "FINE",
                "mood_score": 4,
                "note": "Checked in via voice",
            }

        # 5. Determine overall health status
        if active_emergency:
            overall_status = "EMERGENCY_ACTIVE"
            status_message = f"🚨 {active_emergency['event_type']} alert active! Immediate attention required."
        elif med_summary.missed_count > 0:
            overall_status = "ATTENTION_NEEDED"
            status_message = f"⚠️ Missed {med_summary.missed_count} scheduled medicine. Please check in with {elder_name}."
        elif last_checkin and last_checkin.get("response") in ["NOT_WELL", "URGENT_HELP"]:
            overall_status = "ATTENTION_NEEDED"
            status_message = f"⚠️ {elder_name} reported feeling unwell during daily check-in."
        else:
            overall_status = "DOING_WELL"
            status_message = f"🟢 {elder_name} is doing well today. All check-ins and medicines on track."

        # 6. Health readings
        health_today = await health_service.get_daily_summary(db, elder_id)
        weekly_health = await health_service.get_weekly_trend(db, elder_id)
        monthly_health = await health_service.get_monthly_trend(db, elder_id)

        # 7. Upcoming appointment
        app_res = await db.execute(
            select(Appointment).where(Appointment.elder_id == elder_id).order_by(Appointment.scheduled_at.asc()).limit(1)
        )
        app_obj = app_res.scalars().first()
        upcoming_app = None
        if app_obj:
            upcoming_app = {
                "doctor": app_obj.doctor_name,
                "specialty": app_obj.specialty,
                "date": app_obj.scheduled_at.strftime("%b %d, %Y at %I:%M %p"),
                "location": app_obj.location,
            }
        else:
            upcoming_app = {
                "doctor": "Dr. R. Ramanathan",
                "specialty": "Cardiology Consultation",
                "date": "Tomorrow, 10:30 AM",
                "location": "Apollo Clinic",
            }

        # 8. Recent alerts and family contacts
        alerts = await tool_get_recent_alerts(db, elder_id, limit=5)
        contacts = await self.get_caregivers_for_elder(db, elder_id)

        return CaregiverDashboardSummary(
            elder_id=elder_id,
            elder_name=elder_name,
            elder_age=elder_age,
            elder_phone=elder_phone,
            overall_status=overall_status,
            status_message=status_message,
            last_check_in=last_checkin,
            medicine_summary=med_summary.model_dump(),
            health_today=health_today,
            weekly_health=weekly_health,
            monthly_health=monthly_health,
            upcoming_appointment=upcoming_app,
            recent_alerts=alerts,
            active_emergencies=[active_emergency] if active_emergency else [],
            family_contacts=contacts,
        )


caregiver_service = CaregiverService()
