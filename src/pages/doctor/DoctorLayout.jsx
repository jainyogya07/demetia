import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { Users, FileBarChart, Bell, Phone, CheckSquare, CalendarDays, UserRound } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AvatarSlot from '../../components/AvatarSlot';
import { LiveDot } from '../../components/clinic/LiveChrome';
import { DR_CLINIC, DR_LIVE, DR_PATIENTS } from '../../data/doctorPlaceholders';
import DashAurora from '../../components/bits/DashAurora';
import Reveal from '../../components/bits/Reveal';

const NAV = [
  { to: '/doctor', end: true, icon: Users, label: 'Patients' },
  { to: '/doctor/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/doctor/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/doctor/alerts', icon: Bell, label: 'Safety alerts' },
  { to: '/doctor/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/doctor/profile', icon: UserRound, label: 'My profile' },
];

export default function DoctorLayout() {
  const { pathname } = useLocation();
  const patientId = pathname.split('/')[3];
  const patient = DR_PATIENTS.find((row) => row.id === patientId);

  let title = 'Patients';
  let lead = `${DR_CLINIC.site} — review and notes, not a diagnosis.`;
  if (pathname.startsWith('/doctor/alerts')) {
    title = 'Safety alerts';
    lead = 'Watch items from home and the care circle.';
  } else if (pathname.startsWith('/doctor/reports')) {
    title = 'Reports';
    lead = 'Exports for the file — support, not a verdict.';
  } else if (pathname.startsWith('/doctor/tasks')) {
    title = 'Tasks';
    lead = 'Work to close today — MMSE, caregiver call, meds, Tele-MANAS.';
  } else if (pathname.startsWith('/doctor/calendar')) {
    title = 'Clinic calendar';
    lead = 'OPD, home visits, and Tele-MANAS for this week.';
  } else if (pathname.startsWith('/doctor/profile')) {
    title = 'Clinician file';
    lead = `${DR_CLINIC.title} · ${DR_CLINIC.hospital}`;
  } else if (patient) {
    title = patient.name;
    lead = `Last visit ${patient.lastVisit} · ${patient.stage}`;
  }

  return (
    <div className="app-container ss-theme">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link"><BrandLogo /></Link>
          <span className="ss-role-badge">Doctor</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => {
                const onChart = item.to === '/doctor' && pathname.startsWith('/doctor/patients');
                return `nav-item ${isActive || onChart ? 'active' : ''}`;
              }}
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
              <span className="help-now-title">Clinic emergency</span>
              <span className="help-now-sub">112 · local casualty</span>
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
              <span>Updated {DR_LIVE.lastSync}</span>
            </span>
            <LanguageSwitcher />
            <Link to="/doctor/profile" className="top-action profile ss-profile">
              <AvatarSlot name={DR_CLINIC.name} photoUrl={DR_CLINIC.photoUrl} size={32} />
              <span>{DR_CLINIC.name}</span>
            </Link>
          </div>
        </header>
        <nav className="ss-mobile-subnav" aria-label="Doctor pages">
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
