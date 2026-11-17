import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Users, FileBarChart, Bell, Phone, CheckSquare, CalendarDays, UserRound } from 'lucide-react';
import { useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import HeaderProfileMenu from '../../components/HeaderProfileMenu';
import HeaderLanguageControl from '../../components/HeaderLanguageControl';
import NotificationBell from '../../components/NotificationBell';
import RoleSwitcher from '../../components/RoleSwitcher';
import { DR_CLINIC, DR_PATIENTS } from '../../data/doctorPlaceholders';
import DashAurora from '../../components/bits/DashAurora';
import ClickSpark from '../../components/bits/ClickSpark';
import BlurText from '../../components/bits/BlurText';
import RegionSceneryBackground from '../../components/RegionSceneryBackground';
import { useI18n } from '../../I18nContext';
import { AnimatePresence, motion } from 'motion/react';

const NAV_GROUPS = [
  {
    titleKey: 'nav.clinic',
    items: [
      { to: '/doctor', end: true, icon: Users, labelKey: 'nav.patients' },
      { to: '/doctor/tasks', icon: CheckSquare, labelKey: 'nav.tasks' },
      { to: '/doctor/calendar', icon: CalendarDays, labelKey: 'cgChrome.calendar' },
    ],
  },
  {
    titleKey: 'nav.review',
    items: [
      { to: '/doctor/alerts', icon: Bell, labelKey: 'nav.safetyAlerts' },
      { to: '/doctor/reports', icon: FileBarChart, labelKey: 'nav.reports' },
      { to: '/doctor/profile', icon: UserRound, labelKey: 'cgChrome.profile' },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((group) => group.items);

export default function DoctorLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [railCollapsed, setRailCollapsed] = useState(false);
  const patientId = pathname.split('/')[3];
  const patient = DR_PATIENTS.find((row) => row.id === patientId);

  let title = t('nav.patients');
  let lead = `${DR_CLINIC.site} — Latveria, Binod, Moni in your care. Review and notes, not a diagnosis.`;
  if (pathname.startsWith('/doctor/alerts')) {
    title = t('nav.safetyAlerts');
    lead = 'Watch items from home and the care circle.';
  } else if (pathname.startsWith('/doctor/reports')) {
    title = t('nav.reports');
    lead = 'Exports for the file — support, not a verdict.';
  } else if (pathname.startsWith('/doctor/tasks')) {
    title = t('nav.tasks');
    lead = 'Work to close today for people you know by name.';
  } else if (pathname.startsWith('/doctor/calendar')) {
    title = t('cgChrome.calendar');
    lead = 'OPD, home visits, and Tele-MANAS.';
  } else if (pathname.startsWith('/doctor/profile')) {
    title = t('cgChrome.profile');
    lead = `${DR_CLINIC.title} · ${DR_CLINIC.hospital}`;
  } else if (patient) {
    title = patient.name;
    lead = `${patient.village} · last visit ${patient.lastVisit} · ${patient.stage}`;
  }

  return (
    <ClickSpark className={`app-container ss-theme ss-lakeside ss-has-region-scenery ss-role-shell${railCollapsed ? ' is-rail-collapsed' : ''}`}>
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
          {!railCollapsed && <span className="ss-role-badge">{t('connectedCare.doctor')}</span>}
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
                    className={({ isActive }) => {
                      const onChart = item.to === '/doctor' && pathname.startsWith('/doctor/patients');
                      return `nav-item ${isActive || onChart ? 'active' : ''}`;
                    }}
                    title={t(item.labelKey)}
                  >
                    <item.icon size={18} />
                    <span className="ss-rail-label">{t(item.labelKey)}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <a className="ss-emergency-nav" href="tel:112">
            <Phone size={18} />
            <div className="help-now-content">
              <span className="help-now-title">Clinic emergency</span>
              <span className="help-now-sub">112 · local casualty</span>
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
            <NotificationBell historyPath="/caregiver/notifications" />
            <HeaderProfileMenu
              name={DR_CLINIC.name}
              photoUrl={DR_CLINIC.photoUrl}
              onOpenSettings={() => navigate('/doctor/profile')}
              onOpenAccount={() => navigate('/doctor/profile')}
            />
          </div>
        </header>
        <nav className="ss-mobile-subnav" aria-label="Doctor pages">
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
    </ClickSpark>
  );
}
