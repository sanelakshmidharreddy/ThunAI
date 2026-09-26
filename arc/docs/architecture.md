# ARC (AI Responsive Companion) — System Architecture

> **Tagline:** "Speak. Connect. Stay Safe."  
> **Core Principle:** "Do not make the elderly learn technology. Make the technology adapt to the elderly."

---

## 1. High-Level Conceptual Architecture

```
                    ┌────────────────────────────────────────┐
                    │               ARC MOBILE               │
                    │        React Native / Expo App         │
                    │ (Voice-First, Large Buttons, i18n)     │
                    └───────────────────┬────────────────────┘
                                        │
                         Voice Audio / Text / Button Taps
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │             VOICE GATEWAY              │
                    │   STT (Whisper/Sarvam/Device)          │
                    │   TTS (Sarvam/Device High Clarity)     │
                    └───────────────────┬────────────────────┘
                                        │
                              Transcribed Utterance
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │           PYDANTIC AI AGENT            │
                    │   - Intent Classification (22 intents) │
                    │   - Medical Entity Preservation        │
                    │   - Multilingual Detection (en,ta,hi,te│
                    │   - Strict Schema Validation           │
                    └───────────────────┬────────────────────┘
                                        │
                                Validated Intent
                                        │
                                        ▼
                    ┌────────────────────────────────────────┐
                    │          LANGGRAPH ORCHESTRATOR        │
                    │      Stateful Finite State Machine     │
                    └───────┬─────────┬─────────┬────────────┘
                            │         │         │
               ┌────────────┘         │         └────────────┐
               ▼                      ▼                      ▼
        ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
        │Medicine Agent│       │Emergency Agt │       │Caregiver Agt │
        │+ Health Agent│       │+ Fall Sensor │       │+ Family Dial │
        └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
               │                      │                      │
               ▼                      ▼                      ▼
        ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
        │Medicine Tools│       │  SOS Tools   │       │ Calling Tools│
        └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
               │                      │                      │
               └──────────────────────┼──────────────────────┘
                                      │
                                      ▼
                    ┌────────────────────────────────────────┐
                    │               CONFIRMATION             │
                    │         Elder Audio / UI Response      │
                    └─────────────────┬──────────────────────┘
                                      │
                                      ▼
                    ┌────────────────────────────────────────┐
                    │          DATABASE / PERSISTENCE        │
                    │ PostgreSQL / SQLAlchemy 2.0 (Async)    │
                    └─────────────────┬──────────────────────┘
                                      │
                                      ▼
                    ┌────────────────────────────────────────┐
                    │          CAREGIVER DASHBOARD           │
                    │       React 18 + Vite Web App          │
                    │ (Real-time telemetry, PDF report, SOS) │
                    └────────────────────────────────────────┘
```

---

## 2. Voice Pipeline & Provider Abstraction

ARC abstracts both Speech-to-Text (STT) and Text-to-Speech (TTS) behind clear provider interfaces:

```
Microphone → Voice Gateway → STTProvider → IntentAgent → LangGraph → Deterministic Tools → TTSProvider → Audio Speaker
```

### Provider Matrix
1. **Device Provider (`backend/app/voice/providers/device.py`):**
   - Coordinates client-side native Web Speech API and Expo Speech.
   - Low latency, zero cloud cost, works offline/locally.
2. **Sarvam AI Provider (`backend/app/voice/providers/sarvam.py`):**
   - High-fidelity natural voice recognition and synthesis for Indian languages (Tamil, Hindi, Telugu).
3. **Whisper Provider (`backend/app/voice/providers/whisper.py`):**
   - OpenAI Whisper-compatible endpoints or self-hosted Whisper instances.

---

## 3. AI Safety & Responsibilities

### AI Is Authorized To:
- Understand natural language in English, Tamil, Hindi, and Telugu.
- Detect spoken and text language.
- Extract structured entities (time, dosage, systolic/diastolic BP, sugar values).
- Route tasks through LangGraph state nodes.
- Generate concise, gentle, elder-friendly spoken feedback.

### AI Is Prohibited From:
- Diagnosing clinical diseases independently.
- Inventing or hallucinating medical readings.
- Altering prescription dosages.
- Determining on its own that an elder definitely has a clinical illness.
- Executing dangerous or irreversible actions without explicit confirmation.
- Fabricating government scheme eligibility.

---

## 4. LangGraph State Machine

The orchestration uses LangGraph `StateGraph(ElderState)` with typed state:
- `intent_extractor`: Extracts structured `IntentResult`.
- `node_router`: Evaluates intent and conditionally delegates to `medicine_node`, `emergency_node`, `caregiver_node`, `health_node`, `government_node`, or `confirmation_node`.
- Deterministic tools handle database mutations and alert dispatches.
- `confirmation_node`: Finalizes localized audio and visual output.
