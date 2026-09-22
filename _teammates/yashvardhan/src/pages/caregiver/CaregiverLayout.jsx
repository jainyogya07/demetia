import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, LineChart, Users, FileText, Settings, Phone, UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AvatarSlot from '../../components/AvatarSlot';
import { LiveDot } from '../../components/clinic/LiveChrome';
import { CG_LIVE, CG_PROFILE, CG_PATIENT } from '../../data/caregiverPlaceholders';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/caregiver', end: true, icon: LayoutDashboard, label: 'Today' },
  { to: '/caregiver/routine', icon: CalendarDays, label: 'Routine & medicines' },
  { to: '/caregiver/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/caregiver/safety', icon: MapPin, label: 'Safety & location' },
  { to: '/caregiver/progress', icon: LineChart, label: 'Progress' },
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
  '/caregiver/circle': ['Care circle', 'Family, ASHA, clinic — call from here.'],
  '/caregiver/documents': ['Shared documents', 'Prescriptions and papers the circle can see.'],
  '/caregiver/profile': ['Your file', 'The person holding this household clock.'],
  '/caregiver/settings': ['Settings', 'Reminders, sharing, and how this space behaves.'],
};

export default function CaregiverLayout() {
  const { pathname } = useLocation();
  const { session } = useAuth();
  const [title, lead] = TITLES[pathname] || TITLES['/caregiver'];
  const patientName = session?.linkedPatient?.name || CG_PATIENT.name;
  const caregiverName = session?.name || CG_PROFILE.name;
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const code = session?.householdCode;
    if (!code) return undefined;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/auth-api/alarms/${code}`);
        const data = await res.json();
        if (!cancelled && data?.events) setAlarms(data.events);
      } catch {
        /* offline */
      }
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [session?.householdCode]);

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
        <header className="top-bar ss-topbar">
          <div className="ss-greeting-block">
            <h1>{title}</h1>
            <p>
              {lead}
              {session?.householdCode ? ` · Linked household ${session.householdCode}` : ''}
            </p>
          </div>
          <div className="top-bar-right">
            <span className="os-header-live">
              <LiveDot />
              <span>Updated {CG_LIVE.lastSync}</span>
            </span>
            <LanguageSwitcher />
            <Link to="/caregiver/profile" className="top-action profile ss-profile">
              <AvatarSlot name={caregiverName} photoUrl={CG_PROFILE.photoUrl} size={32} />
              <span>{caregiverName} · caring for {patientName}</span>
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
          {alarms[0] && (
            <div className="os-card" style={{ margin: '12px 16px 0', padding: 14 }}>
              <p className="os-kicker">Patient alarm feed</p>
              <p style={{ margin: 0 }}>
                <strong>{alarms[0].title || alarms[0].alarmId}</strong>
                {' · '}
                {alarms[0].action}
                {alarms[0].at ? ` · ${new Date(alarms[0].at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : ''}
              </p>
            </div>
          )}
          <Outlet context={{ patientName, householdCode: session?.householdCode, alarms }} />
        </div>
      </main>
    </div>
  );
}
