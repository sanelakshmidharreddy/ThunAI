import React, { useState, useEffect, useCallback } from 'react';
import { CaregiverDashboardData, CaregiverContact } from '../../../shared/schemas/index.ts';
import { fetchCaregiverDashboard, resolveEmergencyEvent } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { StatusBanner } from './components/StatusBanner.tsx';
import { MedicineCard } from './components/MedicineCard.tsx';
import { HealthVitalsCard } from './components/HealthVitalsCard.tsx';
import { WeeklyTrendChart } from './charts/WeeklyTrendChart.tsx';
import { MonthlyTrendChart } from './charts/MonthlyTrendChart.tsx';
import { EmergencyAlertsCard } from './components/EmergencyAlertsCard.tsx';
import { FamilyContactsCard } from './components/FamilyContactsCard.tsx';
import { AppointmentsCard } from './components/AppointmentsCard.tsx';
import { DemoController } from './components/DemoController.tsx';
import { AddMemberModal } from './components/AddMemberModal.tsx';
import { SafeCallModal } from './components/SafeCallModal.tsx';

const DEMO_ELDER_ID = 'elder-lakshmi-01';

export const App: React.FC = () => {
  const [data, setData] = useState<CaregiverDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [callModalInfo, setCallModalInfo] = useState<{ isOpen: boolean; name: string; relation: string; phone: string }>({
    isOpen: false,
    name: '',
    relation: '',
    phone: '',
  });

  const loadData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setIsRefreshing(true);
      const dash = await fetchCaregiverDashboard(DEMO_ELDER_ID);
      setData(dash);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to ARC backend.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh periodically to reflect live elder actions
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleResolveAlert = async (eventId: string) => {
    try {
      await resolveEmergencyEvent(eventId, 'Resolved via Caregiver Dashboard');
      loadData(true);
    } catch (err: any) {
      alert(`Could not resolve alert: ${err.message}`);
    }
  };

  const handleCallElder = () => {
    if (!data) return;
    setCallModalInfo({
      isOpen: true,
      name: data.elder_name,
      relation: 'Mother',
      phone: data.elder_phone || '+91 98401 23456',
    });
  };

  const handleCallContact = (c: CaregiverContact) => {
    setCallModalInfo({
      isOpen: true,
      name: c.name,
      relation: c.relationship,
      phone: c.phone,
    });
  };

  if (loading && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
            Loading ARC Caregiver Portal...
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Connecting to healthcare gateway</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        elderId={DEMO_ELDER_ID}
        onRefresh={() => loadData(false)}
        onOpenAddMember={() => setIsAddMemberOpen(true)}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        {/* Hackathon Demo Controller Bar */}
        <DemoController elderId={DEMO_ELDER_ID} onActionComplete={() => loadData(true)} />

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px' }}>
            {error} (Ensure ARC backend is running on port 8000)
          </div>
        )}

        {data && (
          <>
            {/* Status Banner */}
            <StatusBanner
              elderName={data.elder_name}
              elderAge={data.elder_age}
              overallStatus={data.overall_status}
              statusMessage={data.status_message}
              lastCheckIn={data.last_check_in}
              onCallElder={handleCallElder}
            />

            {/* Grid Layout */}
            <div className="dashboard-grid">
              {/* Emergency Alerts (Full Width if active) */}
              <div className="col-12">
                <EmergencyAlertsCard
                  activeEmergencies={data.active_emergencies}
                  recentAlerts={data.recent_alerts}
                  onResolve={handleResolveAlert}
                />
              </div>

              {/* Medicine Adherence */}
              <div className="col-6">
                <MedicineCard summary={data.medicine_summary} />
              </div>

              {/* Health Vitals */}
              <div className="col-6">
                <HealthVitalsCard healthToday={data.health_today} />
              </div>

              {/* Weekly Trend */}
              <div className="col-8">
                <WeeklyTrendChart data={data.weekly_health} />
              </div>

              {/* Upcoming Appointment */}
              <div className="col-4">
                <AppointmentsCard appointment={data.upcoming_appointment} />
              </div>

              {/* Monthly Overview */}
              <div className="col-8">
                <MonthlyTrendChart data={data.monthly_health} />
              </div>

              {/* Family Contacts */}
              <div className="col-4">
                <FamilyContactsCard contacts={data.family_contacts} onCallContact={handleCallContact} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add Member Modal */}
      <AddMemberModal
        elderId={DEMO_ELDER_ID}
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdded={() => loadData(true)}
      />

      {/* Safe Simulated Call Modal */}
      <SafeCallModal
        contactName={callModalInfo.name}
        relationship={callModalInfo.relation}
        phoneNumber={callModalInfo.phone}
        isOpen={callModalInfo.isOpen}
        onClose={() => setCallModalInfo((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
