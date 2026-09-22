import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, LineChart, Users, FileText, Settings, Phone, UserRound, BrainCircuit, ClipboardList, Compass,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import HeaderProfileMenu from '../../components/HeaderProfileMenu';
import HeaderLanguageControl from '../../components/HeaderLanguageControl';
import RoleSwitcher from '../../components/RoleSwitcher';
import { getCaregiverProfile, subscribeCaregiverStore } from '../../lib/caregiverStore';
import DashAurora from '../../components/bits/DashAurora';
import BlurText from '../../components/bits/BlurText';
import RegionSceneryBackground from '../../components/RegionSceneryBackground';
import { useI18n } from '../../I18nContext';
import { AnimatePresence, motion } from 'motion/react';

const NAV_GROUPS = [
  {
    titleKey: 'nav.today',
    items: [
      { to: '/caregiver', end: true, icon: LayoutDashboard, labelKey: 'cgChrome.today' },
      { to: '/caregiver/routine', icon: CalendarDays, labelKey: 'cgChrome.routine' },
      { to: '/caregiver/calendar', icon: CalendarDays, labelKey: 'cgChrome.calendar' },
    ],
  },
  {
    titleKey: 'nav.care',
    items: [
      { to: '/caregiver/safety', icon: MapPin, labelKey: 'cgChrome.safety' },
      { to: '/caregiver/progress', icon: LineChart, labelKey: 'cgChrome.progress' },
      { to: '/caregiver/assessment', icon: ClipboardList, labelKey: 'cgChrome.checkin' },
      { to: '/caregiver/circle', icon: Users, labelKey: 'cgChrome.careCircle' },
    ],
  },
  {
    titleKey: 'nav.setup',
    items: [
      { to: '/caregiver/memory-journey', icon: Compass, labelKey: 'cgChrome.memoryJourney' },
      { to: '/caregiver/train-ai', icon: BrainCircuit, labelKey: 'cgChrome.trainAi' },
      { to: '/caregiver/documents', icon: FileText, labelKey: 'cgChrome.documents' },
      { to: '/caregiver/profile', icon: UserRound, labelKey: 'cgChrome.profile' },
      { to: '/caregiver/settings', icon: Settings, labelKey: 'cgChrome.settings' },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((group) => group.items);

const TITLE_KEYS = {
  '/caregiver': ['cgChrome.today', "Latveria’s day — tasks, safety, and how she is."],
  '/caregiver/routine': ['cgChrome.routine', 'What was due, what was taken, what is next for Latveria.'],
  '/caregiver/calendar': ['cgChrome.calendar', 'Meds, Dr. Sharma, ASHA — one week board.'],
  '/caregiver/safety': ['cgChrome.safety', 'Home zone and Latveria’s last check-in.'],
  '/caregiver/progress': ['cgChrome.progress', 'How Latveria’s week felt — support, not a diagnosis.'],
  '/caregiver/assessment': ['cgChrome.checkin', 'Cognitive notes for monitoring Latveria — not a diagnosis.'],
  '/caregiver/memory-journey': ['cgChrome.memoryJourney', 'Familiar routes and landmarks for Latveria.'],
  '/caregiver/train-ai': ['cgChrome.trainAi', 'Teach Care Agent household facts about Latveria.'],
  '/caregiver/circle': ['cgChrome.careCircle', 'Rina, Doom, Anita Das, Dr. Sharma — call from here.'],
  '/caregiver/documents': ['cgChrome.documents', 'Prescriptions Latveria’s circle can see.'],
  '/caregiver/profile': ['Profile', 'Rina Devi — primary caregiver.'],
  '/caregiver/settings': ['cgChrome.settings', 'Reminders, sharing, and preferences.'],
};

export default function CaregiverLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [profile, setProfile] = useState(() => getCaregiverProfile());
  const [titleKey, lead] = TITLE_KEYS[pathname] || TITLE_KEYS['/caregiver'];
  const title = titleKey.includes('.') ? t(titleKey) : titleKey;

  useEffect(() => subscribeCaregiverStore(() => setProfile(getCaregiverProfile())), []);

  return (
    <div className={`app-container ss-theme ss-lakeside ss-has-region-scenery ss-role-shell${railCollapsed ? ' is-rail-collapsed' : ''}`}>
      <RegionSceneryBackground />
      <aside className={`sidebar${railCollapsed ? ' is-collapsed' : ''}`}>
        <div className="sidebar-header ss-sidebar-identity-header">
          <button
            type="button"
            className="ss-brand-link ss-sidebar-identity-link ss-logo-toggle"
            title="Smriti Saarthi — toggle menu"
            aria-label={railCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setRailCollapsed((v) => !v)}
          >
            <BrandLogo rail logoOnly />
          </button>
          {!railCollapsed && <span className="ss-role-badge">{t('cgChrome.roleBadge')}</span>}
        </div>
        <div className="ss-gpt-scroll">
          {NAV_GROUPS.map((group) => (
            <div key={group.titleKey} className="sidebar-group-block">
              <p className="ss-rail-kicker">{t(group.titleKey)}</p>
              <nav className="sidebar-nav">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    title={t(item.labelKey)}
                  >
                    <item.icon size={18} />
                    <span className="ss-rail-label">{t(item.labelKey)}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
          <div className="sidebar-group-block">
            <div className="nav-group-title" style={{ marginTop: 16, marginBottom: 8, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 12 }}>Spatial Intelligence</div>
            <nav className="sidebar-nav">
              <NavLink 
                to="/caregiver/spatial-presence" 
                className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}
                title="Enter Patient's World"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>
                <span className="ss-rail-label">Spatial Presence</span>
              </NavLink>

              <NavLink 
                to="/caregiver/spatial-config" 
                className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}
                title="Familiar Places Config"
              >
                <MapPin size={20} />
                <span className="ss-rail-label">Spatial Config</span>
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="sidebar-footer">
          <a className="ss-emergency-nav" href="tel:112">
            <Phone size={18} />
            <div className="help-now-content">
              <span className="help-now-title">{t('cgChrome.emergencyHelp')}</span>
              <span className="help-now-sub">{t('cgChrome.emergencySub')}</span>
            </div>
          </a>
        </div>
      </aside>
      <main className="main-content">
        <DashAurora />
        <header className="top-bar ss-topbar ss-transparent-header">
          <div className="ss-header-left">
            <div className="ss-greeting-block">
              <BlurText text={title} className="ss-bits-title" tag="h1" delay={35} />
              <p>{lead}</p>
            </div>
            <RoleSwitcher compact />
          </div>
          <div className="top-bar-right ss-header-right">
            <HeaderLanguageControl compact />
            <button
              type="button"
              className="ss-ask-saarthi-hero-btn ss-role-patient-link is-compact"
              title={t('chrome.patientView')}
              onClick={() => navigate('/user')}
            >
              <div className="ss-saarthi-btn-copy">
                <span className="ss-saarthi-btn-main">{t('chrome.patientView')}</span>
              </div>
            </button>
            <HeaderProfileMenu
              name={profile.name}
              photoUrl={profile.photoUrl}
              onOpenSettings={() => navigate('/caregiver/settings')}
              onOpenAccount={() => navigate('/caregiver/profile')}
            />
          </div>
        </header>
        <nav className="ss-mobile-subnav" aria-label="Caregiver pages">
          {FLAT_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
