import React, { useState } from 'react';
import { Play, Sparkles, Bell, AlertTriangle, Activity, Heart, CheckSquare } from 'lucide-react';
import { triggerDemoSimulation } from '../services/api.ts';

interface DemoControllerProps {
  elderId: string;
  onActionComplete: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({ elderId, onActionComplete }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const runSimulation = async (actionType: string, payload = {}) => {
    try {
      setLoadingAction(actionType);
      const res = await triggerDemoSimulation(actionType, payload, elderId);
      setLastMessage(res.message || 'Simulation completed');
      onActionComplete();
    } catch (e: any) {
      setLastMessage(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      style={{
        background: '#0F172A',
        color: '#F8FAFC',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '20px',
        border: '1px solid #334155',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#3B82F6', padding: '6px', borderRadius: '8px' }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#93C5FD' }}>
              Hackathon Demo Mode Controls
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Simulate events instantly without waiting for real scheduled times
            </div>
          </div>
        </div>

        {lastMessage && (
          <div style={{ background: '#1E293B', padding: '6px 14px', borderRadius: '8px', fontSize: '0.84rem', color: '#38BDF8' }}>
            {lastMessage}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#1E293B', color: '#F8FAFC', borderColor: '#334155' }}
          onClick={() => runSimulation('SIMULATE_MEDICINE_REMINDER')}
          disabled={loadingAction !== null}
        >
          <Bell size={14} /> Simulate Medicine Reminder
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#1E293B', color: '#FCD34D', borderColor: '#334155' }}
          onClick={() => runSimulation('SIMULATE_MISSED_MEDICINE')}
          disabled={loadingAction !== null}
        >
          <AlertTriangle size={14} /> Simulate Missed Medicine
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#1E293B', color: '#86EFAC', borderColor: '#334155' }}
          onClick={() => runSimulation('SIMULATE_DAILY_CHECKIN', { response: 'FINE' })}
          disabled={loadingAction !== null}
        >
          <CheckSquare size={14} /> Simulate Daily Check-In
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#7F1D1D', color: '#FCA5A5', borderColor: '#991B1B' }}
          onClick={() => runSimulation('SIMULATE_FALL')}
          disabled={loadingAction !== null}
        >
          <AlertTriangle size={14} /> Simulate Fall Event
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#991B1B', color: '#FFFFFF', borderColor: '#DC2626' }}
          onClick={() => runSimulation('SIMULATE_EMERGENCY')}
          disabled={loadingAction !== null}
        >
          <AlertTriangle size={14} /> Simulate Emergency SOS
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ background: '#1E293B', color: '#6EE7B7', borderColor: '#334155' }}
          onClick={() => runSimulation('ADD_HEALTH_READING')}
          disabled={loadingAction !== null}
        >
          <Activity size={14} /> Add Health Reading
        </button>
      </div>
    </div>
  );
};
