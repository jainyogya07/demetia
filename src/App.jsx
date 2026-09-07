import React, { useState, useCallback, useEffect, useRef, Component } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Puzzle, CalendarDays, HeartPulse, LineChart,
  Users, MapPin, BookOpen, Languages, Settings, Bell, User,
  ShieldAlert, X, Plus, CloudOff, FileText, PanelLeft, PanelLeftClose, Menu, SquarePen,
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
import CaregiverAssessment from './pages/caregiver/CaregiverAssessment';
import DoctorLayout from './pages/doctor/DoctorLayout';
import {
  DoctorPatients, DoctorPatient, DoctorAlerts, DoctorReports,
  DoctorTasks, DoctorCalendar, DoctorProfile,
} from './pages/doctor/DoctorPages';
import BrandLogo from './components/BrandLogo';
import Footer from './components/Footer';
import MemoryBookPage from './pages/MemoryBookPage';
import AuthFlow from './pages/AuthFlow';
import { useAuth } from './context/AuthContext';
import VoiceToggle from './components/VoiceToggle';
import LanguageSwitcher from './components/LanguageSwitcher';
import SarthiAssistRuntime from './components/SarthiAssistModal';
import AlarmRuntime from './components/AlarmRuntime';
import RequireRole from './components/RequireRole';
import './components/SarthiAssistModal.css';
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

function UserWorkspace({ boot }) {
  const { t } = useI18n();
  const { prefs } = usePrefs();
  const { session, signOut, openAuth } = useAuth();
  const location = useLocation();
  const bootRef = useRef(false);
  const displayName = session?.name || prefs.profile.name || user.name;
  const [tabs, setTabs] = useState([{ ...MODULES[0], instanceId: 'home-main' }]);
  const [activeTabId, setActiveTabId] = useState('home-main');
  const [serviceFocus, setServiceFocus] = useState(null);
  const [aiIntent, setAiIntent] = useState(null);
  const [gameIntent, setGameIntent] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [showAssist, setShowAssist] = useState(false);
  const pendingAssistRef = useRef(false);
  const [assistMuted, setAssistMuted] = useState(false);
  const [, setAssistLive] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null);
  const tabsRef = useRef([{ ...MODULES[0], instanceId: 'home-main' }]);
  tabsRef.current = tabs;
  const openEmergency = useCallback(() => setShowEmergency(true), []);
  const currentModuleId = tabs.find((tab) => tab.instanceId === activeTabId)?.id || 'home';
  const greeting = greetingForHour();

  const moduleTitle = (id) => t(`modules.${id}`);
  const showTabs = tabs.length > 1;
  const navModules = MODULES.filter((mod) => !SIDEBAR_HIDDEN.has(mod.id) && !mod.isSpecial);
  const todayModules = navModules.slice(0, 6);
  const moreModules = navModules.slice(6);

  const openModule = useCallback((moduleId, options = {}) => {
    const moduleItem = MODULES.find((mod) => mod.id === moduleId);
    if (!moduleItem) return;

    const existingTab = tabsRef.current.find((tab) => tab.id === moduleItem.id);
    if (existingTab) {
      setActiveTabId(existingTab.instanceId);
    } else {
      const newInstanceId = `${moduleItem.id}-${Date.now()}`;
      const next = [...tabsRef.current, { ...moduleItem, instanceId: newInstanceId }];
      tabsRef.current = next;
      setTabs(next);
      setActiveTabId(newInstanceId);
    }

    if (moduleId === 'services') {
      setServiceFocus({
        serviceId: options.serviceId || null,
        ts: Date.now(),
      });
    }

    if (moduleId === 'ai') {
      setShowAssist(false);
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

  const handleOpenModule = (moduleItem) => {
    openModule(moduleItem.id, moduleItem.id === 'ai' ? { startVoice: true } : {});
  };

  const renderNavItem = (mod) => {
    const isActive = tabs.find((tab) => tab.id === mod.id && tab.instanceId === activeTabId);
    return (
      <a
        key={mod.id}
        href="#"
        className={`nav-item ${isActive ? 'active' : ''}`}
        title={moduleTitle(mod.id)}
        onClick={(e) => {
          e.preventDefault();
          handleOpenModule(mod);
          setRailOpen(false);
        }}
      >
        <mod.icon size={18} />
        <span className="ss-rail-copy">
          <span className="ss-rail-label">{moduleTitle(mod.id)}</span>
        </span>
      </a>
    );
  };

  const assistPaused = currentModuleId === 'ai' || (currentModuleId === 'games' && activeGameId === 'story-solver');
  const assistReady = Boolean(session?.verified);

  useEffect(() => {
    if (!session?.verified || !pendingAssistRef.current) return;
    pendingAssistRef.current = false;
    setShowAssist(true);
  }, [session?.verified]);

  const openAssist = useCallback(() => {
    if (assistPaused) return;
    setShowAssist(true);
  }, [assistPaused]);

  useEffect(() => {
    if (location.state?.moduleId) {
      openModule(location.state.moduleId, location.state.options || {});
    }
  }, [location.state, openModule]);

  useEffect(() => {
    if (bootRef.current) return;
    if (boot === 'talk') {
      bootRef.current = true;
      openModule('ai', { startVoice: true });
    }
    if (boot === 'stories') {
      bootRef.current = true;
      openModule('games', { gameId: 'story-solver' });
    }
    if (boot === 'assist') {
      bootRef.current = true;
      setShowAssist(true);
    }
  }, [boot, openModule]);

  const handleCloseTab = (e, instanceId) => {
    e.stopPropagation();

    const tabToClose = tabs.find((tab) => tab.instanceId === instanceId);
    if (!tabToClose || !tabToClose.closable) return;

    const newTabs = tabs.filter((tab) => tab.instanceId !== instanceId);
    tabsRef.current = newTabs;

    if (activeTabId === instanceId) {
      const closingIndex = tabs.findIndex((tab) => tab.instanceId === instanceId);
      const nextActiveIndex = closingIndex > 0 ? closingIndex - 1 : 0;
      setActiveTabId(newTabs[nextActiveIndex]?.instanceId || 'home-main');
    }

    setTabs(newTabs);
  };

  return (
    <AppNavContext.Provider value={{ openModule, serviceFocus, aiIntent, gameIntent, openEmergency, currentModuleId, openAssist, setActiveGameId, activeGameId }}>
    <div className={`app-container ss-theme ss-patient-shell${railCollapsed ? ' is-rail-collapsed' : ''}${railOpen ? ' is-rail-open' : ''}`}>
      {railOpen && (
        <button type="button" className="ss-rail-backdrop" aria-label="Close menu" onClick={() => setRailOpen(false)} />
      )}
      <aside className={`sidebar${railCollapsed ? ' is-collapsed' : ''}`}>
        <div className="sidebar-header">
          {railCollapsed ? (
            <button
              type="button"
              className="ss-rail-toggle"
              aria-label="Expand sidebar"
              onClick={() => setRailCollapsed(false)}
            >
              <PanelLeft size={18} />
            </button>
          ) : (
            <>
              <Link to="/" className="ss-brand-link" title="Smriti Saarthi">
                <BrandLogo rail compact={false} />
              </Link>
              <button
                type="button"
                className="ss-rail-toggle"
                aria-label="Collapse sidebar"
                onClick={() => {
                  if (window.matchMedia('(max-width: 860px)').matches) setRailOpen(false);
                  else setRailCollapsed(true);
                }}
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="ss-gpt-new"
          onClick={() => {
            handleOpenModule(MODULES[0]);
            setRailOpen(false);
          }}
        >
          <SquarePen size={16} />
          <span className="ss-rail-label">New day</span>
        </button>

        <div className="ss-gpt-scroll">
          <p className="ss-rail-kicker">Today</p>
          <nav className="sidebar-nav">
            {todayModules.map(renderNavItem)}
          </nav>
          <p className="ss-rail-kicker">More</p>
          <nav className="sidebar-nav">
            {moreModules.map(renderNavItem)}
          </nav>
          <p className="ss-rail-kicker">Open now</p>
          <nav className="sidebar-nav ss-gpt-recents">
            {tabs.map((tab) => (
              <a
                key={tab.instanceId}
                href="#"
                className={`nav-item ${tab.instanceId === activeTabId ? 'active' : ''}`}
                title={moduleTitle(tab.id)}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTabId(tab.instanceId);
                  setRailOpen(false);
                }}
              >
                <tab.icon size={16} />
                <span className="ss-rail-copy">
                  <span className="ss-rail-label">{moduleTitle(tab.id)}</span>
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="ss-emergency-nav" onClick={() => { openEmergency(); setRailOpen(false); }}>
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
            <button type="button" className="ss-mobile-more-btn" onClick={() => setRailOpen(true)}>
              <Menu size={18} />
              Menu
            </button>
            {session?.verified ? (
              <button type="button" className="ss-home-ghost" onClick={signOut}>
                Sign out
              </button>
            ) : (
              <button type="button" className="ss-home-ghost" onClick={() => openAuth('signup')}>
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
        <AlarmRuntime />
        <SarthiAssistRuntime
          panelOpen={showAssist}
          onPanelOpen={() => setShowAssist(true)}
          onPanelClose={() => setShowAssist(false)}
          paused={assistPaused}
          muted={assistMuted}
          onMutedChange={setAssistMuted}
          onLiveChange={setAssistLive}
          authenticated={assistReady}
          onNeedAuth={() => {
            pendingAssistRef.current = true;
            openAuth('signup', { gate: 'assist' });
          }}
        />

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
            const fill = tab.id === 'ai';
            return (
              <div
                key={tab.instanceId}
                className={[
                  'dashboard-scroll',
                  'ss-tab-pane',
                  fill ? 'dashboard-scroll-fill' : '',
                  isActive ? 'is-active' : 'is-hidden',
                ].filter(Boolean).join(' ')}
                hidden={!isActive}
              >
                {fill ? (
                  <TabErrorBoundary>
                    <Component />
                  </TabErrorBoundary>
                ) : (
                  <div className="ss-page-stack">
                    <TabErrorBoundary>
                      <Component />
                    </TabErrorBoundary>
                    <Footer />
                  </div>
                )}
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
  const { authOpen, closeAuth, authGate } = useAuth();
  if (!authOpen) return null;
  return (
    <div className="af-overlay" role="dialog" aria-label="Account">
      <button type="button" className="af-overlay-bg" onClick={closeAuth} aria-label="Close" />
      <AuthFlow variant="modal" onSkip={authGate === 'assist' ? undefined : closeAuth} requireAccount={authGate === 'assist'} />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/user" element={<RequireRole role="user" allowGuest><UserWorkspace /></RequireRole>} />
        <Route path="/talk" element={<RequireRole role="user" allowGuest><UserWorkspace boot="talk" /></RequireRole>} />
        <Route path="/assist" element={<RequireRole role="user" allowGuest><UserWorkspace boot="assist" /></RequireRole>} />
        <Route path="/stories" element={<RequireRole role="user" allowGuest><UserWorkspace boot="stories" /></RequireRole>} />
      <Route path="/caregiver" element={<RequireRole role="caregiver"><CaregiverLayout /></RequireRole>}>
        <Route index element={<CgOverview />} />
        <Route path="assessment" element={<CaregiverAssessment />} />
        <Route path="routine" element={<CgRoutine />} />
        <Route path="safety" element={<CgSafety />} />
        <Route path="progress" element={<CgProgress />} />
        <Route path="circle" element={<CgCircle />} />
        <Route path="documents" element={<CgDocuments />} />
        <Route path="calendar" element={<CgCalendar />} />
        <Route path="profile" element={<CgProfile />} />
        <Route path="settings" element={<CgSettings />} />
      </Route>
      <Route path="/doctor" element={<RequireRole role="doctor"><DoctorLayout /></RequireRole>}>
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
