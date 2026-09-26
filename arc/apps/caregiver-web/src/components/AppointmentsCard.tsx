import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface AppointmentsCardProps {
  appointment?: {
    doctor: string;
    specialty: string;
    date: string;
    location?: string;
  };
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <div className="arc-card">
      <div className="card-header">
        <div className="card-title-group">
          <div style={{ background: '#FEF3C7', padding: '8px', borderRadius: '10px' }}>
            <Calendar size={20} color="#D97706" />
          </div>
          <div>
            <h2 className="card-title">Upcoming Appointment</h2>
            <div className="card-subtitle">Scheduled doctor consultation</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#92400E', marginBottom: '4px' }}>
          {appointment.doctor}
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#B45309', marginBottom: '8px' }}>
          {appointment.specialty}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#78350F' }}>
          <Calendar size={14} />
          <span>{appointment.date}</span>
        </div>
        {appointment.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#78350F', marginTop: '4px' }}>
            <MapPin size={14} />
            <span>{appointment.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};
