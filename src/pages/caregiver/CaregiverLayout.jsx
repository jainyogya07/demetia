import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, LineChart, Users, FileText, Settings, Phone, UserRound, BrainCircuit, ClipboardList, Compass,
} from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import HeaderProfileMenu from '../../components/HeaderProfileMenu';
import HeaderLanguageControl from '../../components/HeaderLanguageControl';
import { CG_PROFILE, CG_PATIENT } from '../../data/caregiverPlaceholders';
import DashAurora from '../../components/bits/DashAurora';
import Reveal from '../../components/bits/Reveal';
import ClickSpark from '../../components/bits/ClickSpark';
import BlurText from '../../components/bits/BlurText';
import Magnet from '../../components/bits/Magnet';
import heroCalmLake from '../../assets/hero-calm-lake.png';
import { useI18n } from '../../I18nContext';

const NAV_GROUPS = [
  {
    title: 'TODAY',
    items: [
      { to: '/caregiver', end: true, icon: LayoutDashboard, labelKey: 'cgChrome.today' },
      { to: '/caregiver/routine', icon: CalendarDays, labelKey: 'cgChrome.routine' },
      { to: '/caregiver/calendar', icon: CalendarDays, labelKey: 'cgChrome.calendar' },
    ],
  },
  {
    title: 'CARE',
    items: [
      { to: '/caregiver/safety', icon: MapPin, labelKey: 'cgChrome.safety' },
      { to: '/caregiver/progress', icon: LineChart, labelKey: 'cgChrome.progress' },
      { to: '/caregiver/assessment', icon: ClipboardList, labelKey: 'cgChrome.checkin' },
      { to: '/caregiver/circle', icon: Users, labelKey: 'cgChrome.careCircle' },
    ],
  },
  {
    title: 'SETUP',
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
  '/caregiver': ['cgChrome.today', 'Tasks, safety, and the person in front of you.'],
  '/caregiver/routine': ['cgChrome.routine', 'What was due, what was taken, what is next.'],
  '/caregiver/calendar': ['cgChrome.calendar', 'Meds, doctor, ASHA — one week board.'],
  '/caregiver/safety': ['cgChrome.safety', 'Home zone and last check-in.'],
  '/caregiver/progress': ['cgChrome.progress', 'How the week felt — support, not a diagnosis.'],
  '/caregiver/assessment': ['cgChrome.checkin', 'Cognitive notes for monitoring, not a diagnosis.'],
  '/caregiver/memory-journey': ['cgChrome.memoryJourney', 'Familiar routes and landmarks for the patient.'],
  '/caregiver/train-ai': ['cgChrome.trainAi', 'Teach Care Agent household facts.'],
  '/caregiver/circle': ['cgChrome.careCircle', 'Family, ASHA, clinic — call from here.'],
  '/caregiver/documents': ['cgChrome.documents', 'Prescriptions the circle can see.'],
  '/caregiver/profile': ['Profile', 'Your caregiver file.'],
  '/caregiver/settings': ['cgChrome.settings', 'Reminders, sharing, and preferences.'],
};

const lakesideStyle = {
  backgroundImage: `url(${heroCalmLake})`,
  backgroundSize: 'cover',
  backgroundPosition: '52% 38%',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
};

export default function CaregiverLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [titleKey, lead] = TITLE_KEYS[pathname] || TITLE_KEYS['/caregiver'];
  const title = titleKey.includes('.') ? t(titleKey) : titleKey;

  return (
    <ClickSpark className="app-container ss-theme ss-lakeside ss-role-shell" style={lakesideStyle}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link"><BrandLogo /></Link>
          <span className="ss-role-badge">{t('cgChrome.roleBadge')}</span>
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
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
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
              <span className="help-now-title">{t('cgChrome.emergencyHelp')}</span>
              <span className="help-now-sub">{t('cgChrome.emergencySub')}</span>
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
                  <span className="ss-saarthi-btn-main">{t('chrome.patientView')}</span>
                  <span className="ss-saarthi-btn-sub">{CG_PATIENT.relation || t('chrome.openDashboard')}</span>
                </span>
              </Link>
            </Magnet>
            <HeaderProfileMenu
              name={CG_PROFILE.name}
              photoUrl={CG_PROFILE.photoUrl}
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
          <Reveal key={pathname}>
            <Outlet />
          </Reveal>
        </div>
      </main>
    </ClickSpark>
  );
}
