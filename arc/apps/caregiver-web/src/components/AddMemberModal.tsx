import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { createCaregiverMember } from '../services/api.ts';

interface AddMemberModalProps {
  elderId: string;
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ elderId, isOpen, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('FAMILY_MEMBER');
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      setIsSubmitting(true);
      await createCaregiverMember({
        elder_id: elderId,
        name,
        relationship,
        phone,
        email: email || undefined,
        role,
        emergency_contact: isEmergencyContact,
        notification_permission: true,
        dashboard_access: true,
      });
      onAdded();
      onClose();
    } catch (err: any) {
      alert(`Error adding member: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Caregiver / Family Member</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.92rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.92rem',
                }}
              >
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Spouse">Spouse</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Doctor">Doctor</option>
                <option value="Caregiver">Caregiver</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.92rem',
                }}
              >
                <option value="PRIMARY_CAREGIVER">Primary Caregiver</option>
                <option value="FAMILY_MEMBER">Family Member</option>
                <option value="EMERGENCY_CONTACT">Emergency Contact</option>
                <option value="VIEW_ONLY">View Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98402 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.92rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.92rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <input
              type="checkbox"
              id="emergency_check"
              checked={isEmergencyContact}
              onChange={(e) => setIsEmergencyContact(e.target.checked)}
            />
            <label htmlFor="emergency_check" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Designate as an Emergency SOS contact
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <UserPlus size={16} /> Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
