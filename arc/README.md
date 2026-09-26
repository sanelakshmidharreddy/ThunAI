# ARC — AI Responsive Companion

> **"Speak. Connect. Stay Safe."**  
> *"Technology that adapts to the elder — not the other way around."*

ARC is a voice-first, multilingual elderly assistance and caregiver coordination platform designed specifically for senior citizens living alone or with limited family contact. It bridges the digital exclusion gap by replacing complex smartphone navigation, small touch targets, and app literacy requirements with natural voice interactions, large high-contrast visual controls, automated health check-ins, medicine adherence tracking, emergency SOS, and real-time family telemetry.

---

## 1. Complete Project Tree

```
arc/
├── apps/
│   ├── mobile/                               # React Native / Expo Elder Mobile App
│   │   ├── App.tsx                           # Master Elder App Root with Screen Routing
│   │   ├── app.json                          # Expo configuration & deep-link scheme
│   │   ├── babel.config.js                   # Expo Babel preset
│   │   ├── tsconfig.json                     # Strict TypeScript config
│   │   ├── components/                       # Large-target, accessible elder components
│   │   │   ├── ActionButtons.tsx             # Giant quick-action grid (Medicines, Health, Family, SOS, Govt)
│   │   │   ├── CheckInCard.tsx               # One-tap Daily Mood Check-In card
│   │   │   ├── DemoControlsDrawer.tsx        # Hackathon Judge Demo Simulation drawer
│   │   │   ├── LanguageSelector.tsx          # Multi-lingual switcher (EN, TA, HI, TE)
│   │   │   ├── TodayStatusBar.tsx            # High-visibility today's health & medicine summary
│   │   │   └── VoiceButton.tsx               # Pulsing Voice Gateway interface
│   │   ├── hooks/
│   │   │   └── useVoiceCompanion.ts          # STT & TTS Voice loop with Web Speech fallback
│   │   ├── i18n/                             # Extensible translations
│   │   │   ├── en.ts                         # English
│   │   │   ├── ta.ts                         # Tamil (தமிழ்)
│   │   │   ├── hi.ts                         # Hindi (हिन्दी)
│   │   │   └── te.ts                         # Telugu (తెలుగు)
│   │   ├── screens/                          # Clean, high-contrast, uncluttered screens
│   │   │   ├── EmergencyModal.tsx            # 2-step countdown SOS confirmation modal
│   │   │   ├── FamilyScreen.tsx              # Large-tile family calling interface
│   │   │   ├── GovernmentScreen.tsx          # Senior Citizen & Pension scheme browser
│   │   │   ├── HealthScreen.tsx              # Daily, Weekly, and Monthly health vitals
│   │   │   ├── HomeScreen.tsx                # Master voice-first elder home screen
│   │   │   └── MedicinesScreen.tsx           # Medicine schedule with TAKEN / SKIP / REMIND LATER
│   │   ├── services/
│   │   │   └── api.ts                        # Typed client for FastAPI backend
│   │   └── package.json
│   │
│   └── caregiver-web/                        # Caregiver & Family Coordination Web Portal
│       ├── index.html                        # Web entrypoint
│       ├── vite.config.ts                    # Vite config with proxy & build optimization
│       ├── tsconfig.json                     # Strict TypeScript configuration
│       ├── src/
│       │   ├── App.tsx                       # Caregiver Dashboard root view
│       │   ├── index.css                     # Accessible healthcare color tokens & utilities
│       │   ├── charts/                       # Clean, uncluttered, scannable trends
│       │   │   ├── MonthlyTrendChart.tsx     # 4-week blood pressure & heart rate trends
│       │   │   └── WeeklyTrendChart.tsx      # 7-day vitals adherence & stability bar chart
│       │   ├── components/                   # Real-time caregiver monitoring components
│       │   │   ├── AddMemberModal.tsx        # Add family caregiver with role permissions
│       │   │   ├── AppointmentsCard.tsx      # Upcoming doctor consultations
│       │   │   ├── DemoController.tsx        # Interactive Hackathon Judge simulator
│       │   │   ├── EmergencyAlertsCard.tsx   # Critical SOS and fall incident feed
│       │   │   ├── FamilyContactsCard.tsx    # Family circle & emergency responder list
│       │   │   ├── Header.tsx                # Branding & PDF report download trigger
│       │   │   ├── HealthVitalsCard.tsx      # Real-time systolic, diastolic, glucose, creatinine
│       │   │   ├── MedicineCard.tsx          # Scheduled doses, adherence stats, and add modal
│       │   │   ├── SafeCallModal.tsx         # Simulated carrier call safety dialogue
│       │   │   └── StatusBanner.tsx          # 5-second elder wellness indicator (Doing Well / Alert)
│       │   └── services/
│       │       └── api.ts                    # REST service for caregiver telemetry & PDF stream
│       └── package.json
│
├── backend/                                  # FastAPI & AI Engine
│   ├── Dockerfile                            # Production container spec
│   ├── requirements.txt                      # Backend dependencies
│   ├── app/
│   │   ├── main.py                           # Application factory, CORS, and lifecycle seeder
│   │   ├── config.py                         # Pydantic Settings & environment validation
│   │   ├── api/                              # REST API Routers
│   │   │   ├── caregivers.py                 # Caregiver relationships & dashboard endpoints
│   │   │   ├── checkins.py                   # Daily check-in logging & caregiver escalation
│   │   │   ├── demo.py                       # Simulation endpoints for hackathon evaluation
│   │   │   ├── emergency.py                  # SOS creation, fall simulation, resolution
│   │   │   ├── government.py                 # Verified public welfare schemes & senior benefits
│   │   │   ├── health.py                     # Vitals ingestion, daily, weekly, monthly queries
│   │   │   ├── medicines.py                  # Dose scheduling, Taken/Missed event tracking
│   │   │   ├── reports.py                    # PDF & CSV health summary download
│   │   │   └── voice.py                      # Voice interpretation & intent routing gateway
│   │   ├── agents/                           # Pydantic AI Agent interfaces
│   │   │   ├── caregiver_agent.py            # Family coordination & contact queries
│   │   │   ├── emergency_agent.py            # Fall & SOS intent triage with safety gates
│   │   │   ├── government_agent.py           # Grounded welfare schemes QA
│   │   │   ├── health_agent.py               # Vitals extraction & non-diagnostic summaries
│   │   │   ├── intent_agent.py               # 22-intent multilingual semantic extraction
│   │   │   └── medicine_agent.py             # Prescription parsing & reminder creation
│   │   ├── db/
│   │   │   └── database.py                   # Async SQLAlchemy engine, session maker, Base model
│   │   ├── graph/                            # LangGraph Workflow Orchestrator
│   │   │   ├── elder_graph.py                # StateGraph assembly, conditional routing, compilation
│   │   │   ├── nodes.py                      # Pure function graph nodes & tool delegators
│   │   │   └── state.py                      # TypedDict state tracking conversation & actions
│   │   ├── models/                           # SQLAlchemy ORM Models
│   │   │   ├── appointment.py                # Doctor consultations
│   │   │   ├── audit_log.py                  # Security audit trail
│   │   │   ├── caregiver.py                  # Caregiver profile & elder relationships
│   │   │   ├── checkin.py                    # Daily mood & escalation state
│   │   │   ├── elder.py                      # Elder demographic & emergency profile
│   │   │   ├── emergency.py                  # Critical events, lat/long, resolution
│   │   │   ├── health_reading.py             # Numerical vitals & blood chemistry
│   │   │   ├── medicine.py                   # Master medication prescriptions
│   │   │   ├── reminder.py                   # Scheduled dose event adherence
│   │   │   └── user.py                       # User identities & role-based credentials
│   │   ├── schemas/                          # Pydantic V2 Validation Schemas
│   │   │   ├── caregiver.py                  # Caregiver inputs & payloads
│   │   │   ├── checkin.py                    # Check-in requests & mood statuses
│   │   │   ├── demo.py                       # Judge simulation request payloads
│   │   │   ├── emergency.py                  # SOS event representations
│   │   │   ├── health.py                     # Health readings, daily/weekly/monthly trends
│   │   │   ├── medicine.py                   # Prescription creation & adherence updates
│   │   │   ├── report.py                     # Report filtering metadata
│   │   │   └── voice.py                      # Voice requests, IntentResult, audio configs
│   │   ├── services/                         # Deterministic Domain Business Logic
│   │   │   ├── caregiver_service.py          # Dashboard aggregation & relationship links
│   │   │   ├── emergency_service.py          # Incident dispatch & safety confirmation
│   │   │   ├── health_service.py             # Time-series aggregation (daily, weekly, monthly)
│   │   │   ├── medicine_service.py           # Adherence calculations & scheduled times
│   │   │   └── report_service.py             # ReportLab PDF synthesis with custom layout
│   │   ├── tools/                            # Deterministic Tool Execution Layer
│   │   │   ├── call_tools.py                 # Family & emergency dialing
│   │   │   ├── emergency_tools.py            # SOS logging & caregiver notification
│   │   │   ├── government_tools.py           # Grounded schemes knowledge lookup
│   │   │   ├── health_tools.py               # Blood pressure, glucose, pulse, creatinine
│   │   │   ├── medicine_tools.py             # Dose logging & reminder scheduling
│   │   │   └── notification_tools.py         # Caregiver alerting & push dispatch
│   │   └── voice/                            # Voice Provider Abstraction Layer
│   │       ├── language.py                   # Language detection & medical entity preservation
│   │       ├── stt.py                        # Speech-to-Text orchestrator
│   │       ├── tts.py                        # Text-to-Speech orchestrator
│   │       └── providers/
│   │           ├── base.py                   # BaseSTTProvider & BaseTTSProvider interfaces
│   │           ├── device.py                 # Native device Web Speech & SpeechSynthesis
│   │           ├── sarvam.py                 # Indian language Sarvam AI voice provider
│   │           └── whisper.py                # OpenAI Whisper STT provider
│   └── tests/                                # Pytest Automated Verification Suite
│       ├── test_agents.py                    # Unit tests for Pydantic AI & LangGraph routing
│       └── test_api.py                       # Integration tests for all REST endpoints & PDF
│
├── shared/                                   # Shared Monorepo Code
│   └── schemas/
│       └── index.ts                          # Shared TypeScript interfaces for Mobile & Web
├── docs/                                     # Architecture & Hackathon Documentation
│   ├── api.md                                # Detailed REST API specification
│   ├── architecture.md                       # Comprehensive design & security manifesto
│   └── demo.md                               # Step-by-step judge demonstration script
├── docker-compose.yml                        # Full-stack orchestrator (FastAPI, Web, Postgres)
├── .env.example                              # Reference configuration template
└── package.json                              # Monorepo task orchestration
```

---

## 2. Technology List

| Layer | Technologies |
| :--- | :--- |
| **Mobile Frontend** | React Native, Expo SDK 52, TypeScript, React DOM, Lucide Icons, Web Speech API / Expo Speech |
| **Caregiver Web** | React 18, Vite 5, TypeScript, Lucide Icons, Vanilla CSS Design System with accessible tokens |
| **Backend Framework** | Python 3.11+, FastAPI, Uvicorn (ASGI), Pydantic V2, Starlette |
| **AI Orchestration** | Pydantic AI, LangGraph (StateGraph, Conditional Edges), LLM Provider Abstraction |
| **Voice Processing** | Provider Abstraction (Whisper STT, Sarvam AI Indian-language STT/TTS, Device Web Speech) |
| **Database & ORM** | PostgreSQL (Production) / SQLite (Instant local run), SQLAlchemy 2.0 Async, aiosqlite |
| **Document Generation** | ReportLab (Medical-grade formatted PDF synthesis) |
| **Testing & CI** | Pytest, Pytest-Asyncio, TypeScript Compiler (`tsc`) |
| **Infrastructure** | Docker, Docker Compose, Multi-stage container builds |

---

## 3. Architecture Explanation

ARC strictly decouples **Cognition (AI)** from **Execution (Deterministic Tools)**. The LLM understands language and context, but all database transactions, reminders, dials, and emergency triggers are executed exclusively by deterministic code.

```
                    ┌─────────────────────────┐
                    │      ELDER DEVICE       │
                    │    React Native Expo    │
                    └────────────┬────────────┘
                                 │
                         Voice / Text / Tap
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      VOICE GATEWAY      │
                    │   STT / TTS Provider    │
                    │ (Whisper/Sarvam/Device) │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     PYDANTIC AI         │
                    │     Intent Agent        │
                    │  (Multilingual Triage)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       LANGGRAPH         │
                    │    AI Orchestrator      │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
    Medicine Agent         Emergency Agent         Health Agent
          │                      │                      │
          ▼                      ▼                      ▼
    Medicine Tool             SOS Tool             Health Tool
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       DATABASE          │
                    │    PostgreSQL/SQLite    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   CAREGIVER DASHBOARD   │
                    │    React Web Portal     │
                    └─────────────────────────┘
```

### Safety Boundaries:
1. **No Unvalidated AI Actions:** An unvalidated LLM output is never allowed to directly execute tools. Intent and entities pass through Pydantic V2 schema validation (`IntentResult`).
2. **No Medical Fabrication:** ARC never invents medical readings, never changes prescribed dosages, and does not diagnose disease.
3. **No Phantom Calling:** During demos or in web environments, emergency dialing enters a safe simulated state with visible screen feedback.

---

## 4. Database Schema

The database is built on SQLAlchemy 2.0 with asynchronous drivers.

### Core Tables & Relationships:
- **`users`**: Authentication credentials, hashed passwords, roles (`ELDER`, `PRIMARY_CAREGIVER`, `FAMILY_MEMBER`).
- **`elders`**: Core profile (`id`, `user_id`, `full_name`, `age`, `language_preference`, `address`, `emergency_notes`).
- **`caregivers`**: Caregiver profile (`id`, `user_id`, `full_name`, `phone`, `email`).
- **`caregiver_relationships`**: Links caregiver to elder (`role`, `notification_permission`, `emergency_contact`, `dashboard_access`).
- **`medicines`**: Prescriptions (`medicine_name`, `dosage`, `dosage_unit`, `frequency`, `scheduled_times`, `instructions`).
- **`medicine_events`**: Dose occurrences (`scheduled_at`, `status`: `PENDING`, `TAKEN`, `MISSED`, `SKIPPED`, `taken_at`).
- **`health_readings`**: Numerical health readings (`type`: `BLOOD_PRESSURE`, `BLOOD_SUGAR`, `HEART_RATE`, `CREATININE`, `systolic`, `diastolic`, `value`, `unit`, `recorded_at`).
- **`check_ins`**: Daily status check-ins (`mood`: `FINE`, `NEED_HELP`, `UNWELL`, `URGENT`, `escalation_state`).
- **`emergency_events`**: Critical triggers (`event_type`: `SOS`, `POSSIBLE_FALL`, `NO_RESPONSE`, `status`: `ACTIVE`, `RESOLVED`, `latitude`, `longitude`).
- **`appointments`**: Medical appointments (`doctor_name`, `specialty`, `scheduled_at`, `location`).
- **`audit_logs`**: Tamper-evident logging of actions, timestamps, and actors.

---

## 5. API Documentation

Comprehensive REST APIs are mounted under `/api/v1`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/voice/interpret` | Multilingual voice/text interpretation via Pydantic AI & LangGraph |
| `POST` | `/api/v1/medicines` | Create a new medication schedule |
| `GET` | `/api/v1/medicines/{elder_id}` | Retrieve scheduled medicines & today's dose events |
| `POST` | `/api/v1/medicines/{event_id}/taken` | Mark a scheduled dose as taken |
| `POST` | `/api/v1/medicines/{event_id}/missed` | Mark a dose missed and alert caregiver |
| `POST` | `/api/v1/health/readings` | Record vitals (BP, Sugar, HR, Creatinine) |
| `GET` | `/api/v1/health/{elder_id}/daily` | Today's latest health vitals |
| `GET` | `/api/v1/health/{elder_id}/weekly` | 7-day vitals trends |
| `GET` | `/api/v1/health/{elder_id}/monthly` | 4-week vitals trends |
| `POST` | `/api/v1/checkins` | Record elder daily mood check-in |
| `POST` | `/api/v1/emergency/sos` | Trigger high-priority emergency SOS event |
| `POST` | `/api/v1/emergency/simulate-fall` | Simulate accelerometer fall incident with countdown |
| `GET` | `/api/v1/caregivers/{elder_id}/dashboard` | Caregiver real-time telemetry dashboard data |
| `POST` | `/api/v1/caregivers` | Add a new family caregiver |
| `GET` | `/api/v1/reports/{elder_id}/pdf` | Stream formatted ReportLab PDF health report |
| `POST` | `/api/v1/demo/seed` | Reset and reseed test scenario (Elder Lakshmi, age 72) |

---

## 6. AI Agent Documentation

ARC employs **Pydantic AI** for structured validation and **LangGraph** for multi-agent routing.

### 1. Intent Agent (`intent_agent.py`)
Extracts one of 22 structured intents:
- Navigation: `NAVIGATE_HOME`, `NAVIGATE_MEDICINES`, `NAVIGATE_HEALTH`, `NAVIGATE_FAMILY`
- Medicines: `CREATE_MEDICINE_REMINDER`, `CHECK_MEDICINE_STATUS`, `REPORT_MEDICINE_TAKEN`, `REPORT_MEDICINE_MISSED`
- Calling & SOS: `CALL_FAMILY`, `CALL_EMERGENCY`, `TRIGGER_SOS`, `DAILY_CHECK_IN`
- Health: `RECORD_BLOOD_PRESSURE`, `RECORD_BLOOD_SUGAR`, `RECORD_HEART_RATE`, `RECORD_PULSE`, `RECORD_CREATININE`, `VIEW_HEALTH_HISTORY`, `VIEW_WEEKLY_REPORT`, `VIEW_MONTHLY_REPORT`
- Caregiver & Government: `CONTACT_CAREGIVER`, `UNKNOWN`

### 2. LangGraph State Machine (`elder_graph.py`)
1. **`route_intent`**: Determines the appropriate agent based on classified intent.
2. **Specialized Nodes**:
   - `medicine_node` -> Calls `MedicineTools` (deterministic SQLite/Postgres schedule insert)
   - `emergency_node` -> Checks confirmation state; invokes `EmergencyTools`
   - `health_node` -> Ingests vitals without offering diagnostic conclusions
   - `caregiver_node` -> Queries family directory
   - `government_node` -> Fetches verified senior citizen schemes
3. **`confirmation_node`**: Formulates elder-friendly, multilingual confirmation messages.

---

## 7. Voice Architecture

ARC features a swappable voice provider abstraction located in `backend/app/voice/`:

- **STT Providers (`stt.py`)**:
  - `WhisperSTTProvider`: OpenAI Whisper API or local whisper.cpp endpoint.
  - `SarvamSTTProvider`: Low-latency speech recognition for Indian languages (Tamil, Hindi, Telugu).
  - `DeviceSTTProvider`: Client-side Web Speech API / Expo Speech fallback (runs offline in any browser).
- **TTS Providers (`tts.py`)**:
  - `SarvamTTSProvider`: Natural Indian-accented speech synthesis.
  - `DeviceTTSProvider`: Client-side SpeechSynthesis.
- **Medical Entity Preservation (`language.py`)**:
  - Automatically isolates numbers and clinical units (`124/78`, `72 BPM`, `8 PM`, `108 mg/dL`) to guarantee lexical translation does not mutate numerical data required by deterministic tools.

---

## 8. Supported Languages

| Language | Code | Native Script | Voice Input | Voice Output | UI Translation |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **English** | `en` | English | Yes | Yes | Yes |
| **Tamil** | `ta` | தமிழ் | Yes | Yes | Yes |
| **Hindi** | `hi` | हिन्दी | Yes | Yes | Yes |
| **Telugu** | `te` | తెలుగు | Yes | Yes | Yes |

---

## 9. Demo Instructions — The Story of Lakshmi (72 years old)

1. **Morning Check-In**:
   - Open Elder Mobile App. ARC greets: *"Good morning Lakshmi. How are you feeling today?"*
   - Tap **"😊 I am fine"** or speak *"I am feeling good today"*.
   - Check-In updates to **Completed**.
2. **Voice Medicine Reminder**:
   - Tap **🎙️ TALK TO ARC** and say: *"Remind me to take my tablet at 8 PM"* (or in Tamil: *"இரவு 8 மணிக்கு மாத்திரை நினைவூட்டு"*).
   - ARC responds: *"I can set a reminder for 8 PM. Would you like me to set it?"*
   - Tap **"YES"**. Schedule confirmed.
3. **Taking Medicine**:
   - Tap **💊 Medicines** from home screen.
   - For **Metformin (500mg)**, tap **TAKEN**.
   - Home screen badge updates to **3/3 Taken**.
4. **Health Vitals Recording**:
   - Tap **❤️ My Health**. View Blood Pressure (`124/78`), Heart Rate (`72 BPM`), Glucose (`108 mg/dL`), Creatinine (`1.0 mg/dL`).
   - Notice simple, non-diagnostic trends.
5. **Caregiver Oversight**:
   - Open Caregiver Web Portal (`http://localhost:3000`).
   - Notice top badge: **🟢 Doing Well**.
   - Check Lakshmi's latest check-in, vitals, and medication timeline.
6. **Simulating Missed Medicine**:
   - In Caregiver Demo Controller (bottom right), click **"⚠️ Simulate Missed Medicine"**.
   - Status updates instantly to **⚠️ Medicine Missed**.
   - Caregiver sees alert: *"Lakshmi has not acknowledged Metformin scheduled for 08:00 AM."*
7. **Simulating Emergency Fall Incident**:
   - In Elder App or Caregiver Controller, click **"🚨 Simulate Fall"**.
   - Elder screen displays 10-second countdown: *"Possible Fall Detected! Are you okay?"*
   - If not cancelled, status escalates to **CRITICAL ALERT**.
   - Caregiver dashboard shows live latitude/longitude with **"Simulate Family Call"** button.
8. **Downloading PDF Report**:
   - In Caregiver Portal header, click **"Download Health Report (PDF)"**.
   - A professionally styled PDF report is immediately generated and downloaded.

---

## 10. Environment Variables

Reference `.env.example`:

```bash
# Application
ENVIRONMENT=development
LOG_LEVEL=INFO
APP_SECRET_KEY=arc_super_secure_secret_key_change_in_production_2026

# Database
# Default: Local SQLite (zero-config local run)
DATABASE_URL=sqlite+aiosqlite:///./arc.db
# PostgreSQL (Production)
# DATABASE_URL=postgresql+asyncpg://arc_user:arc_password@localhost:5432/arc_db

# Voice & AI Providers
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
VOICE_STT_PROVIDER=whisper
VOICE_TTS_PROVIDER=device
SARVAM_API_KEY=your_sarvam_api_key_here

# Service URLs
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8081","http://localhost:19006"]
```

---

## 11. Setup Commands

### Prerequisites:
- Python 3.11+
- Node.js 18+ & npm

### Step 1: Clone & Configure
```bash
git clone https://github.com/your-org/arc.git
cd arc
cp .env.example .env
```

### Step 2: Backend Setup
```bash
# Create virtual environment
python -m venv arc_venv

# Activate virtual environment
# Windows:
.\arc_venv\Scripts\Activate.ps1
# macOS/Linux:
source arc_venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### Step 3: Caregiver Web Setup
```bash
cd apps/caregiver-web
npm install
cd ../..
```

### Step 4: Elder Mobile Setup
```bash
cd apps/mobile
npm install
cd ../..
```

---

## 12. Run Commands

### Development Mode (Local):

**Terminal 1 — Backend (FastAPI on Port 8000):**
```bash
# Windows
$env:PYTHONPATH='backend'; .\arc_venv\Scripts\uvicorn app.main:app --reload --port 8000
# Linux/macOS
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation automatically available at: `http://localhost:8000/docs`*

**Terminal 2 — Caregiver Web Portal (Port 3000):**
```bash
cd apps/caregiver-web
npm run dev
```
*Open `http://localhost:3000` in any browser.*

**Terminal 3 — Elder Mobile App (Expo Web / Mobile):**
```bash
cd apps/mobile
npm run web
```
*Open `http://localhost:8081` in any browser or scan QR code via Expo Go on iOS/Android.*

---

### Production Run with Docker Compose:
```bash
docker-compose up --build
```
This boots:
- PostgreSQL on `localhost:5432`
- FastAPI Backend on `localhost:8000`
- Caregiver Web Portal on `localhost:3000`

---

## 13. Test Commands

Run the comprehensive automated test suite (API endpoints, LangGraph cycle, multilingual voice interpretation, and PDF generation):

```bash
# Windows
$env:PYTHONPATH='backend'; .\arc_venv\Scripts\python.exe -m pytest backend/tests -v

# Linux/macOS
PYTHONPATH=backend pytest backend/tests -v
```

Run Caregiver Web production build verification:
```bash
cd apps/caregiver-web
npm run build
```

---

## 14. Known Limitations

To maintain the highest standards of engineering integrity, ARC clearly distinguishes current capabilities:

1. **Automatic Fall Detection (MOCK / SIMULATED)**:  
   Real-time accelerometer fall detection is simulated via interactive demo triggers. ARC does **not** make clinical claims regarding unvalidated accelerometer sensor heuristics.
2. **Carrier Calling (SIMULATED FOR DEMO)**:  
   Emergency calling opens a safe simulation modal with visible UI feedback to prevent unauthorized carrier dialing during evaluation.
3. **Medical Advice Boundary (STRICT ENFORCEMENT)**:  
   ARC tracks and visualizes vitals and adherence. It **never** provides autonomous diagnostic conclusions or alters medical dosages.
4. **Government Schemes Knowledge Base (MOCK / PUBLIC DATA)**:  
   Verified public benefits (IGNOAPS, PMVVY, Ayushman Bharat) are grounded from curated public catalogs with source references. Live government citizen portal integration is not implemented.

---

## 15. Future Roadmap

- [ ] **Wearable Sensor Integration**: Bluetooth Low Energy (BLE) connectivity for continuous pulse oximeters, smart rings, and continuous glucose monitors (CGM).
- [ ] **Distributed Task Queue with Redis**: Celery / Redis Streams for scheduled dose reminder notifications, missed check-in escalations, and automated SMS dispatch via Twilio.
- [ ] **WhatsApp & SMS Family Bridge**: Direct caregiver alerts and check-in summaries delivered to WhatsApp without requiring app installation.
- [ ] **Edge ML Fall Detection**: On-device CoreML / TensorFlow Lite fall classification using 3-axis accelerometer and gyroscope jerk analysis.
- [ ] **Offline Edge Voice**: Local on-device Whisper Tiny and Piper TTS execution for zero-connectivity rural scenarios.

---

*ARC — AI Responsive Companion*  
*Designed with care for the seniors we love.*
