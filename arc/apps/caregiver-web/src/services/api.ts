/**
 * Caregiver Web API Client connecting to ARC FastAPI Backend.
 */
import { CaregiverDashboardData } from '../../../../shared/schemas/index.ts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function fetchCaregiverDashboard(elderId = 'elder-lakshmi-01'): Promise<CaregiverDashboardData> {
  const res = await fetch(`${API_BASE}/caregivers/${elderId}/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to load dashboard: ${res.statusText}`);
  }
  return res.json();
}

export async function seedDemoData(): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/seed`);
  return res.json();
}

export async function triggerDemoSimulation(actionType: string, payload = {}, elderId = 'elder-lakshmi-01'): Promise<any> {
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

export async function createCaregiverMember(memberData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/caregivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  return res.json();
}

export async function resolveEmergencyEvent(eventId: string, notes = 'Resolved by caregiver'): Promise<any> {
  const res = await fetch(`${API_BASE}/emergency/${eventId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'RESOLVED', notes }),
  });
  return res.json();
}

export function getReportDownloadUrl(elderId = 'elder-lakshmi-01'): string {
  return `${API_BASE}/reports/${elderId}/download-pdf`;
}
