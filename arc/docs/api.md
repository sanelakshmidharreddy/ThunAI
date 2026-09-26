# ARC (AI Responsive Companion) — REST API Documentation

Base URL: `http://localhost:8000/api/v1`  
Interactive Swagger UI: `http://localhost:8000/docs`

---

## 1. Voice Gateway
### `POST /voice/interpret`
Processes audio base64 or text, passes it through the Intent Agent and LangGraph orchestrator, executes tools, and returns TTS synthesis and suggested routes.

**Request:**
```json
{
  "elder_id": "elder-lakshmi-01",
  "text": "Remind me to take my tablet at eight tonight",
  "language": "en"
}
```

**Response (200 OK):**
```json
{
  "intent_result": {
    "intent": "CREATE_MEDICINE_REMINDER",
    "confidence": 0.95,
    "language": "en",
    "entities": {
      "time": "20:00",
      "medicine_name": "Prescribed Tablet"
    },
    "requires_confirmation": true,
    "response_text": "I can set a medicine reminder for 8:00 PM. Would you like me to set it?",
    "suggested_route": "Medicines"
  },
  "audio_data_base64": null,
  "navigation_route": "Medicines"
}
```

---

## 2. Medicines
### `GET /medicines/{elder_id}/today`
Retrieves today's dose schedule, adherence percentage, and individual event statuses.

### `POST /medicines/{id}/taken`
Marks a dose as TAKEN.

### `POST /medicines/{id}/missed`
Marks a dose as MISSED and dispatches a caregiver alert.

### `POST /medicines/{id}/skip`
Marks a dose as SKIPPED.

---

## 3. Health & Vitals
### `POST /health/readings`
Records a vital reading (Blood Pressure, Sugar, Heart Rate, Creatinine).

### `GET /health/{elder_id}/daily`
Returns today's active vitals summary.

### `GET /health/{elder_id}/weekly`
Returns 7-day health trend items for visual charts.

### `GET /health/{elder_id}/monthly`
Returns 4-week rolling averages.

---

## 4. Emergency & SOS
### `POST /emergency/sos`
Triggers high-priority SOS emergency with simulated GPS coordinates.

### `POST /emergency/simulate-fall`
Simulates a sudden fall event from Demo Controls for hackathon demonstration.

### `GET /emergency/{elder_id}`
Returns active emergencies and incident history.

### `POST /emergency/{id}/resolve`
Resolves an emergency incident.

---

## 5. Daily Check-In
### `POST /checkins`
Records morning check-in (FINE, NEED_HELP, NOT_WELL, URGENT_HELP) and escalates if necessary.

---

## 6. Caregivers & Dashboard
### `GET /caregivers/{elder_id}/dashboard`
Aggregates all elder status, vitals, adherence, upcoming appointment, alerts, and contacts for the Caregiver Web Dashboard.

### `POST /caregivers`
Registers a new family member or designated caregiver.

---

## 7. Reports
### `GET /reports/{elder_id}/download-pdf`
Generates and downloads a clean, printable medical status summary PDF document.

---

## 8. Hackathon Demo Mode
### `GET /demo/seed`
Seeds rich baseline demo data for Lakshmi (72 years old).

### `POST /demo/simulate-event`
Simulates instant medicine reminders, missed doses, falls, and health readings.
