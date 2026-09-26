"""Integration tests for ARC Backend APIs, Agents, and Voice Gateway."""
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.demo import DEMO_ELDER_ID


@pytest.mark.asyncio
async def test_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "ARC" in data["app"]
        assert data["tagline"] == "Speak. Connect. Stay Safe."


@pytest.mark.asyncio
async def test_demo_seed_and_caregiver_dashboard():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Seed demo
        seed_res = await ac.get("/api/v1/demo/seed")
        assert seed_res.status_code == 200

        # 2. Get caregiver dashboard
        dash_res = await ac.get(f"/api/v1/caregivers/{DEMO_ELDER_ID}/dashboard")
        assert dash_res.status_code == 200
        dash = dash_res.json()
        assert dash["elder_name"] == "Lakshmi"
        assert "medicine_summary" in dash
        assert "health_today" in dash
        assert len(dash["family_contacts"]) > 0


@pytest.mark.asyncio
async def test_voice_interpret_multilingual():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Test 1: English Check-in
        res1 = await ac.post("/api/v1/voice/interpret", json={
            "elder_id": DEMO_ELDER_ID,
            "text": "I am fine today",
            "language": "en"
        })
        assert res1.status_code == 200
        data1 = res1.json()["intent_result"]
        assert data1["intent"] == "DAILY_CHECK_IN"

        # Test 2: English Medicine Reminder
        res2 = await ac.post("/api/v1/voice/interpret", json={
            "elder_id": DEMO_ELDER_ID,
            "text": "Remind me to take my tablet at 8 PM",
            "language": "en"
        })
        assert res2.status_code == 200
        data2 = res2.json()["intent_result"]
        assert data2["intent"] == "CREATE_MEDICINE_REMINDER"
        assert data2["requires_confirmation"] is True

        # Test 3: Tamil SOS Emergency
        res3 = await ac.post("/api/v1/voice/interpret", json={
            "elder_id": DEMO_ELDER_ID,
            "text": "எனக்கு உதவி வேண்டும்",
            "language": "ta"
        })
        assert res3.status_code == 200
        data3 = res3.json()["intent_result"]
        assert data3["intent"] in ["TRIGGER_SOS", "DAILY_CHECK_IN"]

        # Test 4: Hindi Health Reading
        res4 = await ac.post("/api/v1/voice/interpret", json={
            "elder_id": DEMO_ELDER_ID,
            "text": "मेरा ब्लड प्रेशर 120 / 80 है",
            "language": "hi"
        })
        assert res4.status_code == 200
        data4 = res4.json()["intent_result"]
        assert data4["intent"] == "RECORD_BLOOD_PRESSURE"
        assert data4["entities"]["systolic"] == 120
        assert data4["entities"]["diastolic"] == 80


@pytest.mark.asyncio
async def test_report_generation_and_pdf():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        rep_res = await ac.get(f"/api/v1/reports/{DEMO_ELDER_ID}")
        assert rep_res.status_code == 200
        rep = rep_res.json()
        assert "Lakshmi" in rep["elder_name"]

        # Download PDF
        pdf_res = await ac.get(f"/api/v1/reports/{DEMO_ELDER_ID}/download-pdf")
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"] == "application/pdf"
        assert len(pdf_res.content) > 500  # valid PDF bytes
