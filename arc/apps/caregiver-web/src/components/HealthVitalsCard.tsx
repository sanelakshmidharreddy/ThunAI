import React from 'react';
import { Heart, Activity, Droplets, TestTube, Info } from 'lucide-react';
import { DailyHealthSummary } from '../../../../shared/schemas/index.ts';

interface HealthVitalsCardProps {
  healthToday: DailyHealthSummary;
}

export const HealthVitalsCard: React.FC<HealthVitalsCardProps> = ({ healthToday }) => {
  return (
    <div className="arc-card">
      <div className="card-header">
        <div className="card-title-group">
          <div style={{ background: '#FEE2E2', padding: '8px', borderRadius: '10px' }}>
            <Activity size={20} color="#DC2626" />
          </div>
          <div>
            <h2 className="card-title">Recorded Vitals (Today)</h2>
            <div className="card-subtitle">Personal health tracking readings</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '14px' }}>
        {/* Heart Rate */}
        <div style={{ background: '#FFF1F2', padding: '14px', borderRadius: '12px', border: '1px solid #FFE4E6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E11D48', marginBottom: '4px' }}>
            <Heart size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Heart Rate</span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
            {healthToday.heart_rate.value} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>BPM</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Normal resting</div>
        </div>

        {/* Blood Pressure */}
        <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', marginBottom: '4px' }}>
            <Activity size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Blood Pressure</span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
            {healthToday.blood_pressure.systolic} / {healthToday.blood_pressure.diastolic}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>mmHg (Optimal)</div>
        </div>

        {/* Blood Sugar */}
        <div style={{ background: '#FEF3C7', padding: '14px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', marginBottom: '4px' }}>
            <Droplets size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Blood Sugar</span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
            {healthToday.blood_sugar.value} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>mg/dL</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Fasting reading</div>
        </div>

        {/* Creatinine */}
        <div style={{ background: '#F1F5F9', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', marginBottom: '4px' }}>
            <TestTube size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Creatinine</span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
            {healthToday.creatinine.value} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>mg/dL</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Within normal limits</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <Info size={14} />
        Tracking and caregiver communication only. Not a clinical diagnosis.
      </div>
    </div>
  );
};
