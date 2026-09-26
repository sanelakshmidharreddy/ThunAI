import React from 'react';
import { Users, Phone, Shield } from 'lucide-react';
import { CaregiverContact } from '../../../../shared/schemas/index.ts';

interface FamilyContactsCardProps {
  contacts: CaregiverContact[];
  onCallContact: (contact: CaregiverContact) => void;
}

export const FamilyContactsCard: React.FC<FamilyContactsCardProps> = ({ contacts, onCallContact }) => {
  return (
    <div className="arc-card">
      <div className="card-header">
        <div className="card-title-group">
          <div style={{ background: '#E0E7FF', padding: '8px', borderRadius: '10px' }}>
            <Users size={20} color="#4F46E5" />
          </div>
          <div>
            <h2 className="card-title">Family Circle & Caregivers</h2>
            <div className="card-subtitle">Designated support network</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {contacts.map((c) => (
          <div
            key={c.id}
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</span>
                {c.emergency_contact && (
                  <span className="badge badge-danger" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    <Shield size={10} /> SOS
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {c.relationship} • {c.phone}
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onCallContact(c)}>
              <Phone size={14} /> Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
