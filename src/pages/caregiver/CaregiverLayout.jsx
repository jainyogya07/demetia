import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, LineChart, Users, FileText, Settings, Phone, UserRound, BrainCircuit, ClipboardList,
} from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AvatarSlot from '../../components/AvatarSlot';
import { LiveDot } from '../../components/clinic/LiveChrome';
import { CG_LIVE, CG_PROFILE, CG_PATIENT } from '../../data/caregiverPlaceholders';
import DashAurora from '../../components/bits/DashAurora';
import Reveal from '../../components/bits/Reveal';

const NAV = [
  { to: '/caregiver', end: true, icon: LayoutDashboard, label: 'Today' },
  { to: '/caregiver/routine', icon: CalendarDays, label: 'Routine & medicines' },
  { to: '/caregiver/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/caregiver/safety', icon: MapPin, label: 'Safety & location' },
  { to: '/caregiver/progress', icon: LineChart, label: 'Progress' },
  { to: '/caregiver/assessment', icon: ClipboardList, label: 'Cognitive check-in' },
  { to: '/caregiver/train-ai', icon: BrainCircuit, label: 'Train AI Agent' },
  { to: '/caregiver/circle', icon: Users, label: 'Care circle' },
  { to: '/caregiver/documents', icon: FileText, label: 'Documents' },
  { to: '/caregiver/profile', icon: UserRound, label: 'My profile' },
  { to: '/caregiver/settings', icon: Settings, label: 'Settings' },
];

const TITLES = {
  '/caregiver': ['Today', 'A working family-care day — tasks, safety, the person in front of you.'],
  '/caregiver/routine': ['Routine & medicines', 'What was due, what was taken, what is next.'],
  '/caregiver/calendar': ['Calendar', 'Meds, doctor, ASHA — the week on one board.'],
  '/caregiver/safety': ['Safety & location', 'Caregiver view of the home zone and last check-in.'],
  '/caregiver/progress': ['Progress & engagement', 'How the week felt — support, not a diagnosis.'],
  '/caregiver/assessment': ['Cognitive check-in', 'FAQ-10 plus motor telemetry. Severity is monitoring, not a diagnosis.'],
  '/caregiver/train-ai': ['Train AI Agent', 'Teach the Care Agent specific facts and preferences to personalize patient assistance.'],
  '/caregiver/circle': ['Care circle', 'Family, ASHA, clinic — call from here.'],
  '/caregiver/documents': ['Shared documents', 'Prescriptions and papers the circle can see.'],
  '/caregiver/profile': ['Your file', 'The person holding this household clock.'],
  '/caregiver/settings': ['Settings', 'Reminders, sharing, and how this space behaves.'],
};

export default function CaregiverLayout() {
  const { pathname } = useLocation();
  const [title, lead] = TITLES[pathname] || TITLES['/caregiver'];

  return (
    <div className="app-container ss-theme">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link"><BrandLogo /></Link>
          <span className="ss-role-badge">Caregiver</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a className="ss-emergency-nav" href="tel:112">
            <Phone size={18} />
            <div className="help-now-content">
              <span className="help-now-title">Emergency Help</span>
              <span className="help-now-sub">112 · Elderline · Tele-MANAS</span>
            </div>
          </a>
        </div>
      </aside>
      <main className="main-content">
        <DashAurora />
        <header className="top-bar ss-topbar">
          <div className="ss-greeting-block">
            <h1>{title}</h1>
            <p>{lead}</p>
          </div>
          <div className="top-bar-right">
            <span className="os-header-live">
              <LiveDot />
              <span>Updated {CG_LIVE.lastSync}</span>
            </span>
            <LanguageSwitcher />
            <Link to="/caregiver/profile" className="top-action profile ss-profile">
              <AvatarSlot name={CG_PROFILE.name} photoUrl={CG_PROFILE.photoUrl} size={32} />
              <span>{CG_PROFILE.name} · {CG_PATIENT.relation}</span>
            </Link>
          </div>
        </header>
        <nav className="ss-mobile-subnav" aria-label="Caregiver pages">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-scroll">
          <Reveal>
            <Outlet />
          </Reveal>
        </div>
      </main>
    </div>
  );
}
