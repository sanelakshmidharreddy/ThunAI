import React from 'react';
import { AlertTriangle, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EmergencyEventItem } from '../../../../shared/schemas/index.ts';

interface EmergencyAlertsCardProps {
  activeEmergencies: EmergencyEventItem[];
  recentAlerts: Array<{ id: string; title: string; message: string; channel: string; created_at: string }>;
  onResolve: (id: string) => void;
}

export const EmergencyAlertsCard: React.FC<EmergencyAlertsCardProps> = ({
  activeEmergencies,
  recentAlerts,
  onResolve,
}) => {
  return (
    <div className="arc-card">
      <div className="card-header">
        <div className="card-title-group">
          <div style={{ background: '#FEE2E2', padding: '8px', borderRadius: '10px' }}>
            <ShieldAlert size={20} color="var(--danger)" />
          </div>
          <div>
            <h2 className="card-title">Emergency & Safety Alerts</h2>
            <div className="card-subtitle">Real-time SOS and fall detection telemetry</div>
          </div>
        </div>
      </div>

      {/* Active Emergencies Banner */}
      {activeEmergencies && activeEmergencies.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {activeEmergencies.map((em) => (
            <div
              key={em.id}
              style={{
                background: '#FEF2F2',
                border: '2px solid var(--danger)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} color="var(--danger)" />
                  <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '1.05rem' }}>
                    {em.event_type === 'POSSIBLE_FALL' ? 'POSSIBLE FALL DETECTED' : 'EMERGENCY SOS TRIGGERED'}
                  </span>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onResolve(em.id)}
                >
                  <CheckCircle2 size={14} /> Resolve Alert
                </button>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {em.notes || 'Immediate assistance requested by elder.'}
              </div>

              {em.latitude && em.longitude && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#475569' }}>
                  <MapPin size={14} color="var(--danger)" />
                  <span>Simulated GPS Location: {em.latitude.toFixed(4)}, {em.longitude.toFixed(4)} (Mylapore, Chennai)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #DCFCE7',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <CheckCircle2 size={18} color="var(--success)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534' }}>
            No active emergencies. Lakshmi is safe and protected.
          </span>
        </div>
      )}

      {/* Recent Alerts Feed */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Recent Caregiver Notifications
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentAlerts.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No recent notifications.</div>
          ) : (
            recentAlerts.map((a) => (
              <div
                key={a.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {a.title}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  {a.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
