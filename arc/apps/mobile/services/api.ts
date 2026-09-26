/**
 * Mobile API Service connecting to ARC FastAPI Backend.
 */
import { LanguageCode } from '../../../shared/schemas/index.ts';

const API_BASE = 'http://localhost:8000/api/v1';

export async function interpretVoiceOrText(
  elderId: string,
  text: string,
  language: LanguageCode = 'en'
): Promise<any> {
  const res = await fetch(`${API_BASE}/voice/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      elder_id: elderId,
      text,
      language,
      source: 'mobile_voice',
    }),
  });
  if (!res.ok) {
    throw new Error(`Voice interpretation failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchElderData(elderId: string): Promise<any> {
  const [medsRes, healthRes, checkinRes, emergencyRes] = await Promise.all([
    fetch(`${API_BASE}/medicines/${elderId}/today`).then((r) => r.json()).catch(() => null),
    fetch(`${API_BASE}/health/${elderId}/daily`).then((r) => r.json()).catch(() => null),
    fetch(`${API_BASE}/checkins/${elderId}/today`).then((r) => r.json()).catch(() => null),
    fetch(`${API_BASE}/emergency/${elderId}`).then((r) => r.json()).catch(() => null),
  ]);

  return {
    medicines: medsRes,
    health: healthRes,
    checkin: checkinRes,
    emergency: emergencyRes,
  };
}

export async function submitCheckInApi(elderId: string, response: string, note?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/checkins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      elder_id: elderId,
      response,
      note,
    }),
  });
  return res.json();
}

export async function triggerSosApi(elderId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/emergency/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      elder_id: elderId,
      event_type: 'SOS',
      source: 'tap',
      latitude: 13.0827,
      longitude: 80.2707,
    }),
  });
  return res.json();
}

export async function markMedicineTakenApi(eventId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/medicines/${eventId}/taken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acknowledged_by: 'elder_tap' }),
  });
  return res.json();
}

export async function markMedicineSkipApi(eventId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/medicines/${eventId}/skip`, {
    method: 'POST',
  });
  return res.json();
}

export async function triggerDemoSimulationApi(actionType: string, payload = {}, elderId = 'elder-lakshmi-01'): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/simulate-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      elder_id: elderId,
      action_type: actionType,
      payload,
    }),
  });
  return res.json();
}

export async function fetchCaregiverContacts(elderId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/caregivers/${elderId}`);
  return res.json();
}

export async function fetchGovernmentSchemes(query = ''): Promise<any> {
  const res = await fetch(`${API_BASE}/government/schemes?query=${encodeURIComponent(query)}`);
  return res.json();
}
