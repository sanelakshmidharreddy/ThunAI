import React from 'react';
import { Phone, Clock, Smile, AlertCircle, AlertTriangle } from 'lucide-react';
import { OverallStatus } from '../../../../shared/schemas/index.ts';

interface StatusBannerProps {
  elderName: string;
  elderAge: number;
  overallStatus: OverallStatus;
  statusMessage: string;
  lastCheckIn?: {
    time: string;
    response: string;
    note?: string;
  };
  onCallElder: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  elderName,
  elderAge,
  overallStatus,
  statusMessage,
  lastCheckIn,
  onCallElder,
}) => {
  const getStatusBadge = () => {
    switch (overallStatus) {
      case 'EMERGENCY_ACTIVE':
        return (
          <span className="badge badge-danger">
            <span className="status-dot emergency" /> Emergency Active
          </span>
        );
      case 'ATTENTION_NEEDED':
        return (
          <span className="badge badge-warning">
            <span className="status-dot attention" /> Attention Needed
          </span>
        );
      default:
        return (
          <span className="badge badge-success">
            <span className="status-dot doing_well" /> Doing Well
          </span>
        );
    }
  };

  const getCheckInMoodLabel = (response?: string) => {
    switch (response) {
      case 'FINE':
        return '😊 Feeling Fine';
      case 'NEED_HELP':
        return '😐 Needs Help';
      case 'NOT_WELL':
        return '😟 Not Feeling Well';
      case 'URGENT_HELP':
        return '🆘 Urgent Help Requested';
      default:
        return '⏳ Awaiting Check-In';
    }
  };

  return (
    <div
      className="arc-card"
      style={{
        borderLeft:
          overallStatus === 'EMERGENCY_ACTIVE'
            ? '6px solid var(--danger)'
            : overallStatus === 'ATTENTION_NEEDED'
            ? '6px solid var(--warning)'
            : '6px solid var(--success)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{elderName}</h1>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>({elderAge} years old)</span>
            {getStatusBadge()}
          </div>
          <p style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {statusMessage}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {lastCheckIn && (
            <div style={{ textAlign: 'right', borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Today's Morning Check-In
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {getCheckInMoodLabel(lastCheckIn.response)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                at {lastCheckIn.time}
              </div>
            </div>
          )}

          <button className="btn btn-primary" onClick={onCallElder}>
            <Phone size={18} />
            Call {elderName}
          </button>
        </div>
      </div>
    </div>
  );
};
