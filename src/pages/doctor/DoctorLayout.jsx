import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, FileBarChart, Bell, Phone, CheckSquare, CalendarDays, UserRound } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import HeaderProfileMenu from '../../components/HeaderProfileMenu';
import HeaderLanguageControl from '../../components/HeaderLanguageControl';
import { DR_CLINIC, DR_PATIENTS } from '../../data/doctorPlaceholders';
import DashAurora from '../../components/bits/DashAurora';
import Reveal from '../../components/bits/Reveal';
import ClickSpark from '../../components/bits/ClickSpark';
import BlurText from '../../components/bits/BlurText';
import Magnet from '../../components/bits/Magnet';
import heroCalmLake from '../../assets/hero-calm-lake.png';

const NAV_GROUPS = [
  {
    title: 'CLINIC',
    items: [
      { to: '/doctor', end: true, icon: Users, label: 'Patients' },
      { to: '/doctor/tasks', icon: CheckSquare, label: 'Tasks' },
      { to: '/doctor/calendar', icon: CalendarDays, label: 'Calendar' },
    ],
  },
  {
    title: 'REVIEW',
    items: [
      { to: '/doctor/alerts', icon: Bell, label: 'Safety alerts' },
      { to: '/doctor/reports', icon: FileBarChart, label: 'Reports' },
      { to: '/doctor/profile', icon: UserRound, label: 'My profile' },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((group) => group.items);

const lakesideStyle = {
  backgroundImage: `url(${heroCalmLake})`,
  backgroundSize: 'cover',
  backgroundPosition: '52% 38%',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
};

export default function DoctorLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
    lead = 'Work to close today.';
  } else if (pathname.startsWith('/doctor/calendar')) {
    title = 'Calendar';
    lead = 'OPD, home visits, and Tele-MANAS.';
  } else if (pathname.startsWith('/doctor/profile')) {
    title = 'Profile';
    lead = `${DR_CLINIC.title} · ${DR_CLINIC.hospital}`;
  } else if (patient) {
    title = patient.name;
    lead = `Last visit ${patient.lastVisit} · ${patient.stage}`;
  }

  return (
    <ClickSpark className="app-container ss-theme ss-lakeside ss-role-shell" style={lakesideStyle}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link"><BrandLogo /></Link>
          <span className="ss-role-badge">Doctor</span>
        </div>
        <div className="ss-gpt-scroll">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="sidebar-group-block">
              <p className="ss-rail-kicker">{group.title}</p>
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
                  >
                    <item.icon size={18} />
                    <span className="ss-rail-label">{item.label}</span>
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
          <div className="ss-greeting-block">
            <BlurText text={title} className="ss-bits-title" tag="h1" delay={35} />
            <p>{lead}</p>
          </div>
          <div className="top-bar-right">
            <HeaderLanguageControl />
            <Magnet>
              <Link to="/user" className="ss-ask-saarthi-hero-btn ss-role-patient-link">
                <span className="ss-saarthi-btn-copy">
                  <span className="ss-saarthi-btn-main">Patient view</span>
                  <span className="ss-saarthi-btn-sub">Same calm home</span>
                </span>
              </Link>
            </Magnet>
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
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-scroll">
          <Reveal key={pathname}>
            <Outlet />
          </Reveal>
        </div>
      </main>
    </ClickSpark>
  );
}
