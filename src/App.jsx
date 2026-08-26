import React, { useState, useCallback, Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Home, MessageSquare, Puzzle, CalendarDays, HeartPulse, LineChart,
  Users, MapPin, BookOpen, Languages, Settings, Bell, User,
  ShieldAlert, X, Plus, CloudOff, FileText,
} from 'lucide-react';
import SafetyLocation from './pages/SafetyLocation';
import BrainGames from './games/BrainGames';
import './App.css';
import './granth-pages.css';
import './granth-dashboard.css';
import './granth-home-extras.css';
import './smriti-dashboard.css';
import './editorial-theme.css';
import './patient-mobile.css';
import ServicesCredits from './ServicesCredits';
import MyDocuments from './MyDocuments';
import AICompanion from './AICompanion';
import SettingsPage from './pages/Settings';
import SupportCreditsPage from './pages/SupportCreditsPage';
import UserDashboard from './pages/UserDashboard';
import DailyRoutinePage from './pages/DailyRoutine';
import MemoryProgressPage from './pages/MemoryProgress';
import CareCirclePage from './pages/CareCircle';
import HomeLanding from './pages/HomeLanding';
import CaregiverLayout from './pages/caregiver/CaregiverLayout';
import {
  CgOverview, CgRoutine, CgSafety, CgProgress, CgCircle, CgDocuments, CgSettings,
  CgCalendar, CgProfile,
} from './pages/caregiver/CaregiverPages';
import DoctorLayout from './pages/doctor/DoctorLayout';
import {
  DoctorPatients, DoctorPatient, DoctorAlerts, DoctorReports,
  DoctorTasks, DoctorCalendar, DoctorProfile,
} from './pages/doctor/DoctorPages';
import BrandLogo from './components/BrandLogo';
import MemoryBookPage from './pages/MemoryBookPage';
import AuthFlow from './pages/AuthFlow';
import { useAuth } from './context/AuthContext';
import VoiceToggle from './components/VoiceToggle';
import LanguageSwitcher from './components/LanguageSwitcher';
import { user } from './data/user';
import { greetingForHour } from './data/patientDashboard';
import { AppNavContext } from './AppNavContext';
import { notifyCompanionOpen } from './lib/voiceBus';
import { useI18n } from './I18nContext';
import { usePrefs } from './PrefsContext';
import { EMERGENCY_LINES } from './i18n';

class TabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="ss-module-page">
          <p className="section-label">Could not open</p>
          <h2>This screen failed to load</h2>
          <p className="granth-page-lead">{this.state.error.message || 'Unknown error'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const SmritiPlaceholder = ({ title, description }) => (
  <div className="ss-module-page">
    <p className="section-label">Coming next</p>
    <h2>{title}</h2>
    <p className="granth-page-lead">{description}</p>
  </div>
);

const SIDEBAR_HIDDEN = new Set(['support-credits', 'services']);

const MODULES = [
  { id: 'home', icon: Home, component: UserDashboard, closable: false },
  { id: 'games', icon: Puzzle, component: BrainGames, closable: true },
  { id: 'ai', icon: MessageSquare, component: AICompanion, closable: true },
  { id: 'routine', icon: CalendarDays, component: DailyRoutinePage, closable: true },
  { id: 'medicine', icon: HeartPulse, component: ServicesCredits, closable: true },
  { id: 'progress', icon: LineChart, component: MemoryProgressPage, closable: true },
  { id: 'care-circle', icon: Users, component: CareCirclePage, closable: true },
  { id: 'safety', icon: MapPin, component: SafetyLocation, closable: true },
  { id: 'memory-book', icon: BookOpen, component: MemoryBookPage, closable: true },
  { id: 'language', icon: Languages, component: () => (
    <SmritiPlaceholder
      title="Language & Accessibility"
      description="Assamese, Khasi, Mizo, Manipuri, Bodo, Hindi, and English — plus large type and high contrast. Use the header language menu and Settings for now."
    />
  ), closable: true },
  { id: 'services', icon: HeartPulse, component: ServicesCredits, closable: true },
  { id: 'support-credits', icon: HeartPulse, component: SupportCreditsPage, closable: true },
  { id: 'documents', icon: FileText, component: MyDocuments, closable: true },
  { id: 'settings', icon: Settings, component: SettingsPage, closable: true },
  { id: 'help', icon: ShieldAlert, component: () => (
    <SmritiPlaceholder
      title="Emergency Help"
      description="Use the red Emergency Help button in the sidebar to call 112, Elderline, or Tele-MANAS."
    />
  ), closable: true, isSpecial: true },
];

function EmergencyPanel({ onClose }) {
  const { t } = useI18n();

  return (
    <div className="emergency-overlay" onClick={onClose} role="presentation">
      <div
        className="emergency-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-panel-title"
      >
        <div className="emergency-panel-header">
          <div>
            <span className="emergency-label">{t('emergency.label')}</span>
            <h2 id="emergency-panel-title">{t('emergency.title')}</h2>
            <p>{t('emergency.lead')}</p>
          </div>
          <button type="button" className="emergency-close" onClick={onClose} aria-label={t('emergency.close')}>
            ×
          </button>
        </div>
        <div className="emergency-list">
          {EMERGENCY_LINES.map((line) => {
            const href = line.href || `tel:${line.tel}`;
            const actionLabel = line.action === 'whatsapp' ? t('emergency.whatsapp') : t('emergency.call');
            return (
              <div className="emergency-card" key={line.id}>
                <div className="emergency-card-icon">{line.icon}</div>
                <div className="emergency-card-content">
                  <h3>{t(line.titleKey)}</h3>
                  <p>{t(line.descKey)}</p>
                  <strong>{line.number}</strong>
                </div>
                <a href={href} className="emergency-call-button" target={line.href ? '_blank' : undefined} rel={line.href ? 'noreferrer' : undefined}>
                  {actionLabel}
                </a>
              </div>
            );
          })}
        </div>
        <p className="emergency-footer">
          {t('emergency.footer')}
        </p>
      </div>
    </div>
  );
}

function UserWorkspace() {
  const { t } = useI18n();
  const { prefs } = usePrefs();
  const { session, signOut, openAuth } = useAuth();
  const displayName = session?.name || prefs.profile.name || user.name;
  const [tabs, setTabs] = useState([{ ...MODULES[0], instanceId: 'home-main' }]);
  const [activeTabId, setActiveTabId] = useState('home-main');
  const [serviceFocus, setServiceFocus] = useState(null);
  const [aiIntent, setAiIntent] = useState(null);
  const [gameIntent, setGameIntent] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const openEmergency = useCallback(() => setShowEmergency(true), []);
  const greeting = greetingForHour();

  const moduleTitle = (id) => t(`modules.${id}`);
  const showTabs = tabs.length > 1;

  const handleOpenModule = (moduleItem) => {
    if (moduleItem.id === 'ai') notifyCompanionOpen();
    const existingTab = tabs.find((tTab) => tTab.id === moduleItem.id);
    if (existingTab) {
      setActiveTabId(existingTab.instanceId);
    } else {
      const newInstanceId = `${moduleItem.id}-${Date.now()}`;
      setTabs([...tabs, { ...moduleItem, instanceId: newInstanceId }]);
      setActiveTabId(newInstanceId);
    }
  };

  const openModule = useCallback((moduleId, options = {}) => {
    const moduleItem = MODULES.find((mod) => mod.id === moduleId);
    if (!moduleItem) return;

    setTabs((prev) => {
      const existingTab = prev.find((tab) => tab.id === moduleItem.id);
      if (existingTab) {
        setActiveTabId(existingTab.instanceId);
        return prev;
      }
      const newInstanceId = `${moduleItem.id}-${Date.now()}`;
      setActiveTabId(newInstanceId);
      return [...prev, { ...moduleItem, instanceId: newInstanceId }];
    });

    if (moduleId === 'services') {
      setServiceFocus({
        serviceId: options.serviceId || null,
        ts: Date.now(),
      });
    }

    if (moduleId === 'ai') {
      notifyCompanionOpen();
      setAiIntent({
        startVoice: !!options.startVoice,
        ts: Date.now(),
      });
    }

    if (moduleId === 'games') {
      setGameIntent({
        gameId: options.gameId || null,
        ts: Date.now(),
      });
    }
  }, []);

  const handleCloseTab = (e, instanceId) => {
    e.stopPropagation();

    const tabToClose = tabs.find((tab) => tab.instanceId === instanceId);
    if (!tabToClose || !tabToClose.closable) return;

    const newTabs = tabs.filter((tab) => tab.instanceId !== instanceId);

    if (activeTabId === instanceId) {
      const closingIndex = tabs.findIndex((tab) => tab.instanceId === instanceId);
      const nextActiveIndex = closingIndex > 0 ? closingIndex - 1 : 0;
      setActiveTabId(newTabs[nextActiveIndex]?.instanceId || 'home-main');
    }

    setTabs(newTabs);
  };

  return (
    <AppNavContext.Provider value={{ openModule, serviceFocus, aiIntent, gameIntent, openEmergency }}>
    <div className="app-container ss-theme ss-patient-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link">
            <BrandLogo />
          </Link>
        </div>

        <nav className="sidebar-nav">
          {MODULES.filter((mod) => !SIDEBAR_HIDDEN.has(mod.id) && !mod.isSpecial).map((mod) => {
            const isActive = tabs.find((tab) => tab.id === mod.id && tab.instanceId === activeTabId);
            return (
              <a
                key={mod.id}
                href="#"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleOpenModule(mod); }}
              >
                <mod.icon size={18} />
                {moduleTitle(mod.id)}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="ss-emergency-nav" onClick={openEmergency}>
            <ShieldAlert size={18} />
            <div className="help-now-content">
              <span className="help-now-title">Emergency Help</span>
              <span className="help-now-sub">Call for immediate support</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar ss-topbar">
          <div className="ss-greeting-block">
            <h1>{greeting}, {displayName}</h1>
            <p>A quiet day. Medicine, a little game, a little talk.</p>
          </div>
          <div className="top-bar-right">
            <button type="button" className="ss-mobile-more-btn" onClick={() => setShowMoreNav(true)}>
              All screens
            </button>
            {session?.verified ? (
              <button type="button" className="ss-home-ghost" onClick={signOut}>
                Sign out
              </button>
            ) : (
              <button type="button" className="ss-home-ghost" onClick={() => openAuth('login')}>
                Sign in
              </button>
            )}
            <VoiceToggle />
            <LanguageSwitcher />
            <div className="ss-offline-chip">
              <CloudOff size={16} />
              <span>Offline Mode — Data will sync later.</span>
            </div>
            <div className="top-action ss-bell">
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </div>
            <div className="top-action profile ss-profile">
              {prefs.profile.photoDataUrl ? (
                <img className="top-profile-photo" src={prefs.profile.photoDataUrl} alt="" />
              ) : (
                <span className="ss-profile-fallback"><User size={16} /></span>
              )}
              <span>{displayName} — Patient</span>
            </div>
          </div>
        </header>
        {showEmergency && <EmergencyPanel onClose={() => setShowEmergency(false)} />}

        {showTabs && (
          <div className="tab-system">
            {tabs.map((tab) => (
              <div
                key={tab.instanceId}
                className={`tab ${activeTabId === tab.instanceId ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.instanceId)}
              >
                <tab.icon size={14} className="tab-icon" />
                {moduleTitle(tab.id)}
                {tab.closable && (
                  <div className="tab-close" onClick={(e) => handleCloseTab(e, tab.instanceId)}>
                    <X size={14} />
                  </div>
                )}
              </div>
            ))}
            <div className="tab-add" title="Open new tab">
              <Plus size={16} />
            </div>
          </div>
        )}

        <div className="tab-contents-wrapper">
          {tabs.map((tab) => {
            const Component = tab.component;
            const isActive = activeTabId === tab.instanceId;
            return (
              <div
                key={tab.instanceId}
                className={[
                  'dashboard-scroll',
                  'ss-tab-pane',
                  tab.id === 'ai' ? 'dashboard-scroll-fill' : '',
                  isActive ? 'is-active' : 'is-hidden',
                ].filter(Boolean).join(' ')}
                hidden={!isActive}
              >
                <TabErrorBoundary>
                  <Component />
                </TabErrorBoundary>
              </div>
            );
          })}
        </div>
      </main>

      {showMoreNav && (
        <div className="ss-more-sheet" role="dialog" aria-label="More screens">
          <button type="button" className="ss-more-backdrop" onClick={() => setShowMoreNav(false)} aria-label="Close" />
          <div className="ss-more-panel">
            <p className="ss-more-kicker">Everything</p>
            <h2>Open a screen</h2>
            <div className="ss-more-grid">
              {MODULES.filter((mod) => !SIDEBAR_HIDDEN.has(mod.id) && !mod.isSpecial).map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  className="ss-more-tile"
                  onClick={() => {
                    handleOpenModule(mod);
                    setShowMoreNav(false);
                  }}
                >
                  <mod.icon size={22} />
                  {moduleTitle(mod.id)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="ss-mobile-dock" aria-label="Quick actions">
        <button type="button" className={tabs.find((tab) => tab.id === 'home' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES[0])}>
          <Home size={22} />
          Home
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'ai' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'ai'))}>
          <MessageSquare size={22} />
          Speak
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'games' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'games'))}>
          <Puzzle size={22} />
          Games
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'routine' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'routine'))}>
          <CalendarDays size={22} />
          Routine
        </button>
        <button type="button" className="dock-emergency" onClick={openEmergency}>
          <ShieldAlert size={22} />
          Help
        </button>
      </nav>
    </div>
    </AppNavContext.Provider>
  );
}

function SignInPage() {
  return (
    <div className="ss-theme" style={{ minHeight: '100vh' }}>
      <AuthFlow variant="page" />
    </div>
  );
}

function AuthModal() {
  const { authOpen, closeAuth } = useAuth();
  if (!authOpen) return null;
  return (
    <div className="af-overlay" role="dialog" aria-label="Account">
      <button type="button" className="af-overlay-bg" onClick={closeAuth} aria-label="Close" />
      <AuthFlow variant="modal" onSkip={closeAuth} />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/user" element={<UserWorkspace />} />
      <Route path="/caregiver" element={<CaregiverLayout />}>
        <Route index element={<CgOverview />} />
        <Route path="routine" element={<CgRoutine />} />
        <Route path="safety" element={<CgSafety />} />
        <Route path="progress" element={<CgProgress />} />
        <Route path="circle" element={<CgCircle />} />
        <Route path="documents" element={<CgDocuments />} />
        <Route path="calendar" element={<CgCalendar />} />
        <Route path="profile" element={<CgProfile />} />
        <Route path="settings" element={<CgSettings />} />
      </Route>
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorPatients />} />
        <Route path="alerts" element={<DoctorAlerts />} />
        <Route path="reports" element={<DoctorReports />} />
        <Route path="tasks" element={<DoctorTasks />} />
        <Route path="calendar" element={<DoctorCalendar />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="patients/:patientId/:tab" element={<DoctorPatient />} />
        <Route path="patients/:patientId" element={<DoctorPatient />} />
      </Route>
    </Routes>
      <AuthModal />
    </>
  );
}

export default App;
