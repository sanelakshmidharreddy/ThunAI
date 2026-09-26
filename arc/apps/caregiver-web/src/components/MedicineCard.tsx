import React from 'react';
import { Pill, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { MedicineStatusSummary } from '../../../../shared/schemas/index.ts';

interface MedicineCardProps {
  summary: MedicineStatusSummary;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ summary }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TAKEN':
        return <CheckCircle2 size={16} color="var(--success)" />;
      case 'MISSED':
        return <AlertCircle size={16} color="var(--danger)" />;
      case 'SKIPPED':
        return <XCircle size={16} color="var(--warning)" />;
      default:
        return <Clock size={16} color="var(--text-muted)" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TAKEN':
        return <span className="badge badge-success">Taken</span>;
      case 'MISSED':
        return <span className="badge badge-danger">Missed</span>;
      case 'SKIPPED':
        return <span className="badge badge-warning">Skipped</span>;
      default:
        return <span className="badge" style={{ background: '#E2E8F0', color: '#475569' }}>Pending</span>;
    }
  };

  return (
    <div className="arc-card">
      <div className="card-header">
        <div className="card-title-group">
          <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px' }}>
            <Pill size={20} color="var(--primary)" />
          </div>
          <div>
            <h2 className="card-title">Medicine Adherence</h2>
            <div className="card-subtitle">Daily dose schedule & compliance</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            {summary.taken_count} / {summary.total_scheduled}
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Doses Taken Today</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '18px' }}>
        <div
          style={{
            width: `${summary.adherence_percentage}%`,
            height: '100%',
            background: summary.missed_count > 0 ? 'var(--warning)' : 'var(--success)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {summary.events.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '16px' }}>
            No scheduled medications recorded for today.
          </div>
        ) : (
          summary.events.map((event) => {
            const timeStr = new Date(event.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusIcon(event.status)}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                      {event.medicine_name || 'Prescribed Tablet'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {event.dosage_info || '1 tablet'} • {timeStr}
                    </div>
                  </div>
                </div>
                <div>{getStatusBadge(event.status)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
