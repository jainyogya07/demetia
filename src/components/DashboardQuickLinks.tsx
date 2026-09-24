import React from 'react';
import { BookOpen, Leaf, Users, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { useI18n } from '../I18nContext';
import './DashboardQuickLinks.css';

const LINKS = [
  { id: 'memory', titleKey: 'quickLinks.memoryTitle', subKey: 'quickLinks.memorySub', icon: BookOpen, color: '#8b6fa3' },
  { id: 'routine', titleKey: 'quickLinks.routineTitle', subKey: 'quickLinks.routineSub', icon: Leaf, color: '#2a7c6a' },
  { id: 'care', titleKey: 'quickLinks.careTitle', subKey: 'quickLinks.careSub', icon: Users, color: '#a3886f' },
  { id: 'safety', titleKey: 'quickLinks.safetyTitle', subKey: 'quickLinks.safetySub', icon: ShieldCheck, color: '#2a7c6a' },
  { id: 'progress', titleKey: 'quickLinks.progressTitle', subKey: 'quickLinks.progressSub', icon: TrendingUp, color: '#2f74c0' },
];

function DashboardQuickLinks({ onNav }) {
  const { t } = useI18n();

  return (
    <div className="dash-quick-links">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <button
            key={link.id}
            type="button"
            className="quick-link-card"
            onClick={() => onNav && onNav(link.id)}
          >
            <div className="quick-link-icon-wrap" style={{ color: link.color }}>
              <Icon size={22} />
            </div>
            <div className="quick-link-content">
              <strong>{t(link.titleKey)}</strong>
              <span>{t(link.subKey)}</span>
            </div>
            <ChevronRight className="quick-link-arrow" size={16} />
          </button>
        );
      })}
    </div>
  );
}

export default DashboardQuickLinks;
