import React, { useState } from 'react';
import { WeeklyTrendItem } from '../../../../shared/schemas/index.ts';

interface WeeklyTrendChartProps {
  data: WeeklyTrendItem[];
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<'bp' | 'hr' | 'sugar'>('bp');

  return (
    <div className="arc-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">7-Day Health Trend</h2>
          <div className="card-subtitle">Daily fluctuations across this week</div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn btn-sm ${metric === 'bp' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMetric('bp')}
          >
            Blood Pressure
          </button>
          <button
            className={`btn btn-sm ${metric === 'hr' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMetric('hr')}
          >
            Heart Rate
          </button>
          <button
            className={`btn btn-sm ${metric === 'sugar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMetric('sugar')}
          >
            Blood Sugar
          </button>
        </div>
      </div>

      {/* Interactive SVG Bar & Line Chart */}
      <div style={{ width: '100%', height: '180px', marginTop: '10px' }}>
        <svg viewBox="0 0 700 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="40" y1="30" x2="680" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
          <line x1="40" y1="80" x2="680" y2="80" stroke="#E2E8F0" strokeDasharray="4 4" />
          <line x1="40" y1="130" x2="680" y2="130" stroke="#E2E8F0" strokeDasharray="4 4" />

          {data.map((item, idx) => {
            const x = 70 + idx * 95;
            let val = 0;
            let label = '';
            let barColor = 'var(--primary)';

            if (metric === 'bp') {
              val = item.systolic;
              label = `${item.systolic}/${item.diastolic}`;
              barColor = '#0F766E';
            } else if (metric === 'hr') {
              val = item.heart_rate;
              label = `${item.heart_rate} bpm`;
              barColor = '#E11D48';
            } else {
              val = item.blood_sugar;
              label = `${item.blood_sugar} mg/dL`;
              barColor = '#D97706';
            }

            // Normalize height between 30 and 130
            const height = Math.min(100, Math.max(20, (val - 50) * 1.0));
            const y = 140 - height;

            return (
              <g key={item.day}>
                {/* Bar */}
                <rect
                  x={x - 18}
                  y={y}
                  width="36"
                  height={height}
                  rx="6"
                  fill={barColor}
                  opacity="0.85"
                />
                {/* Value on top */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#1E293B"
                >
                  {label}
                </text>
                {/* Day label on bottom */}
                <text
                  x={x}
                  y="162"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#64748B"
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
