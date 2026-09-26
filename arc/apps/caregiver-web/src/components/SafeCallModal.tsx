import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Mic } from 'lucide-react';

interface SafeCallModalProps {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeCallModal: React.FC<SafeCallModalProps> = ({
  contactName,
  relationship,
  phoneNumber,
  isOpen,
  onClose,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED'>('CONNECTING');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('CONNECTING');
      return;
    }

    const timer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1500);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          textAlign: 'center',
          background: '#0F172A',
          color: 'white',
          maxWidth: '380px',
        }}
      >
        <div style={{ margin: '0 auto 16px', width: '80px', height: '80px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={40} color="#94A3B8" />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{contactName}</h2>
        <div style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '8px' }}>
          {relationship} • {phoneNumber}
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: callStatus === 'CONNECTED' ? '#4ADE80' : '#FCD34D', marginBottom: '24px' }}>
          {callStatus === 'CONNECTING' ? 'Calling...' : `Connected (${formatSeconds(callDuration)})`}
        </div>

        <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '28px' }}>
          ℹ️ Safe Simulated Call Session (No real carrier dial initiated in demo environment)
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={onClose}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(220, 38, 38, 0.4)',
            }}
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
