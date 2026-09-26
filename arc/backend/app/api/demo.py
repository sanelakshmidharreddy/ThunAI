"""Demo Mode API: Realistic simulation controls and seed data for hackathon judges."""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.elder import Elder
from app.models.caregiver import Caregiver
from app.models.medicine import Medicine
from app.models.reminder import MedicineEvent
from app.models.health_reading import HealthReading, Appointment
from app.models.checkin import CheckIn
from app.models.emergency import EmergencyEvent, Notification
from app.schemas.demo import DemoSimulateRequest, DemoSimulateResponse
from app.tools.medicine_tools import tool_mark_medicine_missed
from app.tools.emergency_tools import tool_simulate_fall, tool_trigger_sos
from app.tools.health_tools import tool_record_health_reading
from app.tools.notification_tools import tool_dispatch_caregiver_alert

router = APIRouter(prefix="/demo", tags=["Demo Mode & Simulation"])

DEMO_ELDER_ID = "elder-lakshmi-01"


@router.post("/seed")
@router.get("/seed")
async def seed_demo_data(db: AsyncSession = Depends(get_db)):
    """
    Seeds a rich, realistic elder scenario for judging:
    - Lakshmi (72 years old)
    - 3 Scheduled medicines with events
    - Baseline vitals: BP 124/78, HR 72, Sugar 108, Creatinine 1.0
    - Caregivers: Dr. Priya (Daughter) and Ramesh (Son)
    - Completed Morning Check-in: "I am fine"
    """
    # Check if Lakshmi already exists
    res = await db.execute(select(Elder).where(Elder.id == DEMO_ELDER_ID))
    elder = res.scalars().first()

    if not elder:
        elder = Elder(
            id=DEMO_ELDER_ID,
            full_name="Lakshmidhar Reddy",
            age=72,
            gender="Male",
            preferred_language="en",
            primary_phone="+91 8328287227",
            address="Flat 402, Srinivasa Nilayam, Hyderabad",
            emergency_notes="Mild hypertension, diabetic. Lives independently. Son Rahul is primary contact.",
        )
        db.add(elder)
        await db.flush()
    else:
        elder.full_name = "Lakshmidhar Reddy"
        elder.primary_phone = "+91 8328287227"
        elder.gender = "Male"
        elder.address = "Flat 402, Srinivasa Nilayam, Hyderabad"
        elder.emergency_notes = "Mild hypertension, diabetic. Lives independently. Son Rahul is primary contact."

    # Seed Caregivers
    cg_res = await db.execute(select(Caregiver).where(Caregiver.elder_id == DEMO_ELDER_ID))
    existing_cgs = cg_res.scalars().all()
    if not existing_cgs:
        cg1 = Caregiver(
            elder_id=DEMO_ELDER_ID,
            name="Rahul",
            relationship="Son (Primary Caregiver)",
            phone="+91 9080503005",
            email="rahul@example.com",
            role="PRIMARY_CAREGIVER",
            emergency_contact=True,
            dashboard_access=True,
        )
        cg2 = Caregiver(
            elder_id=DEMO_ELDER_ID,
            name="Dr. Priya Rao",
            relationship="Family Doctor",
            phone="+91 98765 43210",
            email="priya.rao@example.com",
            role="FAMILY_MEMBER",
            emergency_contact=True,
            dashboard_access=True,
        )
        cg3 = Caregiver(
            elder_id=DEMO_ELDER_ID,
            name="Emergency Response",
            relationship="National Elder Helpline 14567",
            phone="14567",
            role="EMERGENCY_CONTACT",
            emergency_contact=True,
            dashboard_access=False,
        )
        db.add_all([cg1, cg2, cg3])
    else:
        # Ensure Rahul is in the caregivers list
        has_rahul = any(cg.name == "Rahul" for cg in existing_cgs)
        if not has_rahul:
            existing_cgs[0].name = "Rahul"
            existing_cgs[0].relationship = "Son (Primary Caregiver)"
            existing_cgs[0].phone = "+91 9080503005"
            existing_cgs[0].email = "rahul@example.com"

    # Seed Medicines & Today's Events
    med_res = await db.execute(select(Medicine).where(Medicine.elder_id == DEMO_ELDER_ID))
    existing_meds = med_res.scalars().all()
    if not existing_meds:
        m1 = Medicine(
            id="med-01",
            elder_id=DEMO_ELDER_ID,
            medicine_name="Metformin",
            dosage="500",
            dosage_unit="mg",
            scheduled_times="08:00",
            instructions="Take after breakfast with water",
        )
        m2 = Medicine(
            id="med-02",
            elder_id=DEMO_ELDER_ID,
            medicine_name="Amlodipine",
            dosage="5",
            dosage_unit="mg",
            scheduled_times="14:00",
            instructions="Take after lunch",
        )
        m3 = Medicine(
            id="med-03",
            elder_id=DEMO_ELDER_ID,
            medicine_name="Atorvastatin",
            dosage="10",
            dosage_unit="mg",
            scheduled_times="20:00",
            instructions="Take before bed",
        )
        db.add_all([m1, m2, m3])
        await db.flush()

        now = datetime.now(timezone.utc)
        e1 = MedicineEvent(
            medicine_id=m1.id,
            elder_id=DEMO_ELDER_ID,
            scheduled_at=now.replace(hour=8, minute=0, second=0),
            status="TAKEN",
            taken_at=now.replace(hour=8, minute=15, second=0),
            acknowledged_by="elder_voice",
        )
        e2 = MedicineEvent(
            medicine_id=m2.id,
            elder_id=DEMO_ELDER_ID,
            scheduled_at=now.replace(hour=14, minute=0, second=0),
            status="TAKEN",
            taken_at=now.replace(hour=14, minute=5, second=0),
            acknowledged_by="elder_tap",
        )
        e3 = MedicineEvent(
            medicine_id=m3.id,
            elder_id=DEMO_ELDER_ID,
            scheduled_at=now.replace(hour=20, minute=0, second=0),
            status="TAKEN",
            taken_at=now.replace(hour=20, minute=2, second=0),
            acknowledged_by="elder_voice",
        )
        db.add_all([e1, e2, e3])

    # Seed baseline vitals
    vitals_res = await db.execute(select(HealthReading).where(HealthReading.elder_id == DEMO_ELDER_ID))
    if not vitals_res.scalars().all():
        hr1 = HealthReading(
            elder_id=DEMO_ELDER_ID,
            type="BLOOD_PRESSURE",
            systolic=124.0,
            diastolic=78.0,
            unit="mmHg",
            source="demo_seed",
        )
        hr2 = HealthReading(
            elder_id=DEMO_ELDER_ID,
            type="HEART_RATE",
            value=72.0,
            unit="BPM",
            source="demo_seed",
        )
        hr3 = HealthReading(
            elder_id=DEMO_ELDER_ID,
            type="BLOOD_SUGAR",
            value=108.0,
            unit="mg/dL",
            source="demo_seed",
        )
        hr4 = HealthReading(
            elder_id=DEMO_ELDER_ID,
            type="CREATININE",
            value=1.0,
            unit="mg/dL",
            source="demo_seed",
        )
        db.add_all([hr1, hr2, hr3, hr4])

    # Seed appointment
    app_res = await db.execute(select(Appointment).where(Appointment.elder_id == DEMO_ELDER_ID))
    if not app_res.scalars().all():
        app = Appointment(
            elder_id=DEMO_ELDER_ID,
            doctor_name="Dr. R. Ramanathan",
            specialty="Cardiology Consultation",
            scheduled_at=datetime.now(timezone.utc) + timedelta(days=1, hours=2),
            location="Apollo Heart Centre, Greams Road",
        )
        db.add(app)

    # Seed morning checkin
    checkin_res = await db.execute(select(CheckIn).where(CheckIn.elder_id == DEMO_ELDER_ID))
    if not checkin_res.scalars().all():
        ci = CheckIn(
            elder_id=DEMO_ELDER_ID,
            check_in_time=datetime.now(timezone.utc).replace(hour=8, minute=32),
            response="FINE",
            mood_score=4,
            note="Spoke 'I am fine' during morning voice greeting",
        )
        db.add(ci)

    await db.commit()
    return {
        "success": True,
        "message": "Demo data successfully seeded for Lakshmi (72).",
        "elder_id": DEMO_ELDER_ID,
    }


@router.post("/simulate-event", response_model=DemoSimulateResponse)
async def simulate_demo_event(req: DemoSimulateRequest, db: AsyncSession = Depends(get_db)):
    """Executes instant interactive simulations for hackathon judges."""
    action = req.action_type
    elder_id = req.elder_id or DEMO_ELDER_ID

    if action == "SIMULATE_MEDICINE_REMINDER":
        # Add a fresh pending reminder event
        med = Medicine(
            elder_id=elder_id,
            medicine_name="Evening Calcium Tablet",
            dosage="1",
            dosage_unit="tablet",
            scheduled_times=datetime.now(timezone.utc).strftime("%H:%M"),
        )
        db.add(med)
        await db.flush()

        event = MedicineEvent(
            medicine_id=med.id,
            elder_id=elder_id,
            scheduled_at=datetime.now(timezone.utc),
            status="PENDING",
        )
        db.add(event)
        await db.commit()
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message="Triggered instant medicine reminder for: Evening Calcium Tablet",
            details={"event_id": event.id, "medicine": med.medicine_name},
        )

    elif action == "SIMULATE_MISSED_MEDICINE":
        # Mark one medicine as missed and alert caregiver
        result = await tool_mark_medicine_missed(db, elder_id)
        await tool_dispatch_caregiver_alert(
            db,
            elder_id=elder_id,
            title="ALERT: Missed Medicine Dose",
            message="Lakshmi did not acknowledge her afternoon medication. Please check in.",
        )
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message="Simulated missed medicine dose. Caregiver alert dispatched.",
            details=result,
        )

    elif action == "SIMULATE_DAILY_CHECKIN":
        mood = req.payload.get("response", "FINE")
        ci = CheckIn(
            elder_id=elder_id,
            check_in_time=datetime.now(timezone.utc),
            response=mood,
            mood_score=4 if mood == "FINE" else 2,
            note="Simulated check-in from Demo panel",
        )
        db.add(ci)
        await db.commit()
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message=f"Simulated daily check-in with response: {mood}",
            details={"check_in_id": ci.id, "response": mood},
        )

    elif action == "SIMULATE_FALL":
        res = await tool_simulate_fall(db, elder_id)
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message="Simulated sudden fall event. Countdown activated and caregiver alerted.",
            details=res,
        )

    elif action == "SIMULATE_EMERGENCY":
        res = await tool_trigger_sos(db, elder_id, source="demo_panel")
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message="Simulated SOS emergency alert dispatched.",
            details=res,
        )

    elif action == "ADD_HEALTH_READING":
        res = await tool_record_health_reading(
            db=db,
            elder_id=elder_id,
            reading_type="BLOOD_PRESSURE",
            systolic=122.0,
            diastolic=76.0,
            unit="mmHg",
            source="demo_panel",
        )
        return DemoSimulateResponse(
            success=True,
            action_type=action,
            message="Added fresh Blood Pressure reading: 122/76 mmHg",
            details=res,
        )

    return DemoSimulateResponse(
        success=False,
        action_type=action,
        message=f"Unknown simulation action: {action}",
    )
