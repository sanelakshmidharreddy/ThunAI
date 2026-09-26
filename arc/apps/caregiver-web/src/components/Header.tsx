import React from 'react';
import { HeartHandshake, Download, UserPlus, RefreshCw } from 'lucide-react';
import { getReportDownloadUrl } from '../services/api.ts';

interface HeaderProps {
  elderId: string;
  onRefresh: () => void;
  onOpenAddMember: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ elderId, onRefresh, onOpenAddMember, isRefreshing }) => {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand">
          <div className="brand-icon">
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="brand-title">ARC Caregiver Portal</div>
            <div className="brand-tagline">AI Responsive Companion — Speak. Connect. Stay Safe.</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            Refresh
          </button>

          <a
            href={getReportDownloadUrl(elderId)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            download
          >
            <Download size={15} />
            Download PDF Report
          </a>

          <button className="btn btn-primary btn-sm" onClick={onOpenAddMember}>
            <UserPlus size={15} />
            Add Member
          </button>
        </div>
      </div>
    </header>
  );
};
