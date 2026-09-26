import React from 'react';
import { MonthlyTrendItem } from '../../../../shared/schemas/index.ts';

interface MonthlyTrendChartProps {
  data: MonthlyTrendItem[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  return (
    <div className="arc-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Monthly Health Overview</h2>
          <div className="card-subtitle">4-week rolling averages for physician visits</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {data.map((w) => (
          <div
            key={w.week}
            style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {w.week}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg BP:</span>
                <span style={{ fontWeight: 700 }}>{w.avg_systolic}/{w.avg_diastolic}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg Heart Rate:</span>
                <span style={{ fontWeight: 700, color: '#E11D48' }}>{w.avg_heart_rate} bpm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg Sugar:</span>
                <span style={{ fontWeight: 700, color: '#D97706' }}>{w.avg_sugar} mg/dL</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
