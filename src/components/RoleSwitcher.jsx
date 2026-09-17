import { useLocation, useNavigate } from 'react-router-dom';
import { User, HeartHandshake, Stethoscope } from 'lucide-react';
import { useI18n } from '../I18nContext';

const ROLES = [
  { id: 'user', labelKey: 'connectedCare.patient', path: '/user', icon: User },
  { id: 'caregiver', labelKey: 'connectedCare.caregiver', path: '/caregiver', icon: HeartHandshake },
  { id: 'doctor', labelKey: 'connectedCare.doctor', path: '/doctor', icon: Stethoscope },
];

function roleFromPath(pathname) {
  if (pathname.startsWith('/caregiver')) return 'caregiver';
  if (pathname.startsWith('/doctor')) return 'doctor';
  return 'user';
}

function RoleSwitcher({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const active = roleFromPath(location.pathname);

  return (
    <div className={`ss-role-switch${compact ? ' is-compact' : ''}`} role="tablist" aria-label="Switch dashboard">
      {ROLES.map((role) => {
        const Icon = role.icon;
        const isActive = active === role.id;
        return (
          <button
            key={role.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ss-role-chip ${isActive ? 'active' : ''}`}
            onClick={() => navigate(role.path)}
            title={t(role.labelKey)}
          >
            <Icon size={14} />
            {!compact && <span>{t(role.labelKey)}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default RoleSwitcher;
