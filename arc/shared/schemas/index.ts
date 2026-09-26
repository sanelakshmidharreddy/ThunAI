/**
 * Shared Type Definitions between ARC Mobile (Elder App) and ARC Caregiver Web.
 */

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te';

export type OverallStatus = 'DOING_WELL' | 'ATTENTION_NEEDED' | 'EMERGENCY_ACTIVE';

export type CheckInResponse = 'FINE' | 'NEED_HELP' | 'NOT_WELL' | 'URGENT_HELP';

export type MedicineStatus = 'PENDING' | 'TAKEN' | 'MISSED' | 'SKIPPED';

export type EmergencyEventType = 'SOS' | 'POSSIBLE_FALL' | 'MEDICAL_ASSISTANCE' | 'NO_RESPONSE' | 'OTHER';

export interface ElderProfile {
  id: string;
  full_name: string;
  age: number;
  gender?: string;
  preferred_language: LanguageCode;
  primary_phone?: string;
  address?: string;
  emergency_notes?: string;
}

export interface CaregiverContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  role: 'PRIMARY_CAREGIVER' | 'FAMILY_MEMBER' | 'EMERGENCY_CONTACT' | 'VIEW_ONLY';
  notification_permission: boolean;
  emergency_contact: boolean;
  dashboard_access: boolean;
  avatar_url?: string;
  tel_uri?: string;
}

export interface MedicineItem {
  id: string;
  elder_id: string;
  medicine_name: string;
  dosage: string;
  dosage_unit: string;
  frequency: string;
  scheduled_times: string;
  instructions?: string;
  active: boolean;
}

export interface MedicineEventItem {
  id: string;
  medicine_id: string;
  elder_id: string;
  medicine_name?: string;
  dosage?: string;
  dosage_info?: string;
  scheduled_at: string;
  status: MedicineStatus;
  taken_at?: string;
  missed_at?: string;
  instructions?: string;
}

export interface MedicineStatusSummary {
  total_scheduled: number;
  taken_count: number;
  missed_count: number;
  pending_count: number;
  adherence_percentage: number;
  events: MedicineEventItem[];
}

export interface HealthReadingItem {
  id?: string;
  elder_id: string;
  type: 'BLOOD_PRESSURE' | 'BLOOD_SUGAR' | 'HEART_RATE' | 'PULSE' | 'CREATININE';
  value?: number;
  unit: string;
  systolic?: number;
  diastolic?: number;
  recorded_at: string;
  source: string;
  notes?: string;
}

export interface DailyHealthSummary {
  heart_rate: { value: number; unit: string; recorded_at: string };
  blood_pressure: { systolic: number; diastolic: number; unit: string; recorded_at: string };
  blood_sugar: { value: number; unit: string; recorded_at: string };
  creatinine: { value: number; unit: string; recorded_at: string };
}

export interface WeeklyTrendItem {
  day: string;
  systolic: number;
  diastolic: number;
  heart_rate: number;
  blood_sugar: number;
}

export interface MonthlyTrendItem {
  week: string;
  avg_systolic: number;
  avg_diastolic: number;
  avg_heart_rate: number;
  avg_sugar: number;
}

export interface EmergencyEventItem {
  id: string;
  elder_id: string;
  event_type: EmergencyEventType;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CANCELLED';
  source: string;
  notes?: string;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface CaregiverDashboardData {
  elder_id: string;
  elder_name: string;
  elder_age: number;
  elder_phone?: string;
  overall_status: OverallStatus;
  status_message: string;
  last_check_in?: {
    time: string;
    response: CheckInResponse;
    mood_score: number;
    note?: string;
  };
  medicine_summary: MedicineStatusSummary;
  health_today: DailyHealthSummary;
  weekly_health: WeeklyTrendItem[];
  monthly_health: MonthlyTrendItem[];
  upcoming_appointment?: {
    doctor: string;
    specialty: string;
    date: string;
    location?: string;
  };
  recent_alerts: Array<{
    id: string;
    title: string;
    message: string;
    channel: string;
    is_read: boolean;
    created_at: string;
  }>;
  active_emergencies: EmergencyEventItem[];
  family_contacts: CaregiverContact[];
}

export interface IntentResult {
  intent: string;
  confidence: number;
  language: LanguageCode;
  entities: Record<string, any>;
  requires_confirmation: boolean;
  response_text: string;
  action_executed: boolean;
  action_payload?: Record<string, any>;
  suggested_route?: string;
}
