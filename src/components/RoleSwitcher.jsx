import { useLocation, useNavigate } from 'react-router-dom';
import { User, HeartHandshake, Stethoscope } from 'lucide-react';

const ROLES = [
  { id: 'user', label: 'User', path: '/user', icon: User },
  { id: 'caregiver', label: 'Caregiver', path: '/caregiver', icon: HeartHandshake },
  { id: 'doctor', label: 'Doctor', path: '/doctor', icon: Stethoscope },
];

function roleFromPath(pathname) {
  if (pathname.startsWith('/caregiver')) return 'caregiver';
  if (pathname.startsWith('/doctor')) return 'doctor';
  return 'user';
}

function RoleSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const active = roleFromPath(location.pathname);

  return (
    <div className="ss-role-switch" role="tablist" aria-label="Switch dashboard mode">
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
          >
            <Icon size={14} />
            <span>{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default RoleSwitcher;
