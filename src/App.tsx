import React, { useState, useCallback, useEffect, useRef, Component } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Puzzle, CalendarDays, Landmark, LineChart,
  Users, MapPin, BookOpen, Settings, Bell, User,
  ShieldAlert, X, Plus, CloudOff, FileText, Menu, SquarePen, HelpCircle, Info, Map
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
import './components/NewLayout.css';
import logoMark from './assets/smriti-saarthi-logo.png';
import RegionSceneryBackground from './components/RegionSceneryBackground';
import RegionScenerySync from './components/RegionScenerySync';
import SchemesPage from './pages/Schemes';
import MyDocuments from './MyDocuments';
import AICompanion from './AICompanion';
import SettingsPage from './pages/Settings';
import SupportCreditsPage from './pages/SupportCreditsPage';
import UserDashboard from './pages/UserDashboard';
import DailyRoutinePage from './pages/DailyRoutine';
import MemoryProgressPage from './pages/MemoryProgress';
import CareCirclePage from './pages/CareCircle';
import HomeLanding from './pages/HomeLanding';
import KeypadPhone from './pages/KeypadPhone';
import CaregiverLayout from './pages/caregiver/CaregiverLayout';
import { caregiverChildRoutes } from './pages/caregiver/caregiverRoutes';
import SpatialPresence from './pages/caregiver/SpatialPresence';
import NotificationsPage from './pages/NotificationsPage';
import DoctorLayout from './pages/doctor/DoctorLayout';
import {
  DoctorPatients, DoctorPatient, DoctorAlerts, DoctorReports,
  DoctorTasks, DoctorCalendar, DoctorProfile,
} from './pages/doctor/DoctorPages';
import Footer from './components/Footer';
import MemoryBookPage from './pages/MemoryBookPage';
import MemoryQuiz from './components/MemoryQuiz';
import Guide from './components/Guide';
import AlarmRuntime from './components/AlarmRuntime';
import AuthFlow from './pages/AuthFlow';
import { useAuth } from './context/AuthContext';
import SaarthiRadialMenu from './components/SaarthiRadialMenu';
import AboutUsModal from './components/AboutUsModal';
import companionPortrait from './assets/infinity_pfp.jpg';
import SarthiAssistRuntime from './components/SarthiAssistModal';
import './components/SarthiAssistModal.css';
import { user } from './data/user';
import { AppNavContext, type AppNavOptions } from './AppNavContext';
import { notifyCompanionOpen } from './lib/voiceBus';
import { useI18n } from './I18nContext';
import { usePrefs } from './PrefsContext';
import { EMERGENCY_LINES } from './i18n';
import { memoryQuizDoneToday, markMemoryQuizDay, saveMemoryQuizResult, seedMemoryQuizForDemo } from './lib/memoryQuiz';
import { applyMemoryQuizToAssessment } from './lib/assessmentStore';
import JainQuoteCarousel from './components/JainQuoteCarousel';
import HeaderProfileMenu from './components/HeaderProfileMenu';
import HeaderLanguageControl from './components/HeaderLanguageControl';
import NotificationBell from './components/NotificationBell';
import RoleSwitcher from './components/RoleSwitcher';
import { startUpcomingAlarmWatcher } from './lib/upcomingAlarmNotifier';
import DashAurora from './components/bits/DashAurora';
import { motion } from 'motion/react';

const SIDEBAR_WIDTH_KEY = 'ss-sidebar-width';
const SIDEBAR_DEFAULT = 188;
const SIDEBAR_MIN = 160;
const SIDEBAR_MAX = 280;

function readSidebarWidth() {
  try {
    const raw = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
    if (Number.isFinite(raw) && raw >= SIDEBAR_MIN && raw <= SIDEBAR_MAX) return raw;
  } catch {
    /* ignore */
  }
  return SIDEBAR_DEFAULT;
}

class QuizErrorBoundary extends Component<{ onClose?: () => void; children?: React.ReactNode }, { error: Error | null }> {
  constructor(props: { onClose?: () => void; children?: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="memory-quiz-overlay">
          <div className="memory-quiz-card memory-quiz-complete">
            <h1>Memory check saved</h1>
            <p className="memory-monitoring-text">Continue to the dashboard.</p>
            <button
              type="button"
              className="memory-continue-button"
              onClick={() => {
                this.props.onClose?.();
                this.setState({ error: null });
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

class TabErrorBoundary extends Component<{ children?: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
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

const SmritiPlaceholder = ({ title, description }: { title: string; description: string }) => (
  <div className="ss-module-page">
    <p className="section-label">Coming next</p>
    <h2>{title}</h2>
    <p className="granth-page-lead">{description}</p>
  </div>
);

const SIDEBAR_HIDDEN = new Set(['support-credits', 'services', 'medicine']);
const MODULE_ALIASES = { medicine: 'schemes', services: 'schemes' };

const MODULES: Array<{
  id: string;
  icon: typeof Home;
  component: React.ComponentType;
  closable: boolean;
  isSpecial?: boolean;
}> = [
  { id: 'home', icon: Home, component: UserDashboard, closable: false },
  { id: 'games', icon: Puzzle, component: BrainGames, closable: true },
  { id: 'ai', icon: MessageSquare, component: AICompanion, closable: true },
  { id: 'routine', icon: CalendarDays, component: DailyRoutinePage, closable: true },
  { id: 'schemes', icon: Landmark, component: SchemesPage, closable: true },
  { id: 'memory-book', icon: BookOpen, component: MemoryBookPage, closable: true },
  { id: 'care-circle', icon: Users, component: CareCirclePage, closable: true },
  { id: 'safety', icon: MapPin, component: SafetyLocation, closable: true },
  { id: 'spatial', icon: Map, component: SpatialPresence, closable: true },
  { id: 'progress', icon: LineChart, component: MemoryProgressPage, closable: true },
  { id: 'documents', icon: FileText, component: MyDocuments, closable: true },
  { id: 'settings', icon: Settings, component: SettingsPage, closable: true },
];

function LiveNetworkStatus() {
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`ss-live-badge ${online ? 'is-live' : 'is-offline'}`}
      role="status"
      title={online ? 'System: Connected & syncing live' : 'System: Offline mode active'}
    >
      <span className="ss-pulse-dot" />
      <span className="ss-live-text">{online ? 'Live' : 'Offline'}</span>
    </div>
  );
}

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

const SIDEBAR_GROUPS = [
  {
    titleKey: 'nav.today',
    items: [
      { id: 'home', labelKey: 'nav.home', icon: Home },
      { id: 'routine', labelKey: 'nav.myDay', icon: CalendarDays },
    ],
  },
  {
    titleKey: 'nav.memory',
    items: [
      { id: 'memory-book', labelKey: 'nav.memoryBook', icon: BookOpen },
      { id: 'games', labelKey: 'nav.brainGames', icon: Puzzle },
    ],
  },
  {
    titleKey: 'nav.care',
    items: [
      { id: 'care-circle', labelKey: 'nav.careCircle', icon: Users },
      { id: 'safety', labelKey: 'nav.safety', icon: MapPin },
    ],
  },
  {
    titleKey: 'nav.support',
    items: [
      { id: 'documents', labelKey: 'nav.documents', icon: FileText },
      { id: 'schemes', labelKey: 'nav.schemes', icon: Landmark },
      { id: 'spatial', labelKey: 'modules.spatial', icon: Map },
      { id: 'progress', labelKey: 'nav.progress', icon: LineChart },
    ],
  },
];

function UserWorkspace({ boot }: { boot?: string }) {
  const { t } = useI18n();
  const { prefs } = usePrefs();
  const { session, openAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const bootRef = useRef(false);
  const displayName = session?.name || prefs.profile.name || user.name;
  const [tabs, setTabs] = useState([{ ...MODULES[0], instanceId: 'home-main' }]);
  const [activeTabId, setActiveTabId] = useState('home-main');
  const [serviceFocus, setServiceFocus] = useState<{ serviceId?: string | null; ts: number } | null>(null);
  const [aiIntent, setAiIntent] = useState<{ startVoice?: boolean; ts: number } | null>(null);
  const [gameIntent, setGameIntent] = useState<{ gameId?: string | null; ts: number } | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(readSidebarWidth);
  const [sidebarResizing, setSidebarResizing] = useState(false);
  const [showAssist, setShowAssist] = useState(false);
  const pendingAssistRef = useRef(false);
  const [, setAssistLive] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [showMemoryQuiz, setShowMemoryQuiz] = useState(() => {
    try {
      const row = seedMemoryQuizForDemo();
      applyMemoryQuizToAssessment(row, row.patientId);
    } catch {
      /* local seed still writes the quiz result */
    }
    return true;
  });
  const [showGuide, setShowGuide] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const tabsRef = useRef([{ ...MODULES[0], instanceId: 'home-main' }]);
  tabsRef.current = tabs;
  const activeTabIdRef = useRef(activeTabId);
  activeTabIdRef.current = activeTabId;
  const skipHistoryRef = useRef(false);
  const seededHistoryRef = useRef(false);
  const openEmergency = useCallback(() => setShowEmergency(true), []);
  const currentModuleId = tabs.find((tab) => tab.instanceId === activeTabId)?.id || 'home';

  const moduleTitle = (id) => t(`modules.${id}`);
  const showTabs = tabs.length > 1;

  const activateModule = useCallback((moduleId: string, options: AppNavOptions = {}) => {
    const resolvedId = MODULE_ALIASES[moduleId] || moduleId;
    const moduleItem = MODULES.find((mod) => mod.id === resolvedId);
    if (!moduleItem) return null;

    const existingTab = tabsRef.current.find((tab) => tab.id === moduleItem.id);
    let instanceId;
    if (existingTab) {
      instanceId = existingTab.instanceId;
      setActiveTabId(existingTab.instanceId);
    } else {
      instanceId = `${moduleItem.id}-${Date.now()}`;
      const next = [...tabsRef.current, { ...moduleItem, instanceId }];
      tabsRef.current = next;
      setTabs(next);
      setActiveTabId(instanceId);
    }

    if (resolvedId === 'schemes' || moduleId === 'services' || moduleId === 'medicine') {
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

    return instanceId;
  }, []);

  const openModule = useCallback((moduleId: string, options: AppNavOptions = {}) => {
    const resolvedId = MODULE_ALIASES[moduleId] || moduleId;
    const moduleItem = MODULES.find((mod) => mod.id === resolvedId);
    if (!moduleItem) return;

    const prevId = tabsRef.current.find((tab) => tab.instanceId === activeTabIdRef.current)?.id || 'home';
    activateModule(resolvedId, options);

    if (skipHistoryRef.current) return;

    const sameModule = prevId === resolvedId && location.state?.moduleId === resolvedId;
    const onlyIntentRefresh = sameModule && (options.startVoice || options.gameId || options.serviceId || options.initialQuery);
    if (sameModule && !onlyIntentRefresh) return;

    navigate('/user', {
      state: {
        moduleId: resolvedId,
        options: {
          startVoice: options.startVoice || false,
          gameId: options.gameId || null,
          serviceId: options.serviceId || null,
        },
      },
      replace: sameModule,
    });
  }, [activateModule, navigate, location.state?.moduleId]);

  const handleOpenModule = (moduleItem) => {
    openModule(moduleItem.id, moduleItem.id === 'ai' ? { startVoice: true } : {});
  };

  const assistPaused = showMemoryQuiz || currentModuleId === 'ai' || (currentModuleId === 'games' && activeGameId === 'story-solver');
  const assistReady = true;

  useEffect(() => {
    if (!session?.verified || !pendingAssistRef.current) return;
    pendingAssistRef.current = false;
    setShowAssist(true);
  }, [session?.verified]);

  const openAssist = useCallback(() => {
    if (assistPaused) return;
    setShowAssist(true);
  }, [assistPaused]);

  const openMemoryQuiz = useCallback(() => setShowMemoryQuiz(true), []);
  const openGuide = useCallback(() => setShowGuide(true), []);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
    } catch {
      /* ignore */
    }
  }, [sidebarWidth]);

  useEffect(() => {
    if (!sidebarResizing) return undefined;
    const onMove = (event) => {
      const x = event.touches?.[0]?.clientX ?? event.clientX;
      if (!Number.isFinite(x)) return;
      setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(x))));
    };
    const onUp = () => setSidebarResizing(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [sidebarResizing]);

  // Seed history so the first Back from a module returns to Home (not landing).
  useEffect(() => {
    if (seededHistoryRef.current) return;
    if (location.pathname !== '/user' && location.pathname !== '/talk' && location.pathname !== '/assist' && location.pathname !== '/stories') return;
    seededHistoryRef.current = true;
    if (!location.state?.moduleId) {
      navigate(location.pathname || '/user', {
        replace: true,
        state: { moduleId: 'home', options: {} },
      });
    }
  }, [location.pathname, location.state?.moduleId, navigate]);

  // Browser Back / Forward restores the previous module tab inside /user.
  useEffect(() => {
    const moduleId = location.state?.moduleId;
    if (!moduleId) return;
    skipHistoryRef.current = true;
    activateModule(moduleId, location.state.options || {});
    skipHistoryRef.current = false;
  }, [location.key, location.state, activateModule]);

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
    if (boot === 'schemes') {
      bootRef.current = true;
      openModule('schemes');
    }
  }, [boot, openModule]);

  const handleCloseTab = (e, instanceId) => {
    e.stopPropagation();

    const tabToClose = tabs.find((tab) => tab.instanceId === instanceId);
    if (!tabToClose || !tabToClose.closable) return;

    const newTabs = tabs.filter((tab) => tab.instanceId !== instanceId);
    tabsRef.current = newTabs;

    let nextModuleId = 'home';
    if (activeTabId === instanceId) {
      const closingIndex = tabs.findIndex((tab) => tab.instanceId === instanceId);
      const nextActiveIndex = closingIndex > 0 ? closingIndex - 1 : 0;
      const nextTab = newTabs[nextActiveIndex];
      setActiveTabId(nextTab?.instanceId || 'home-main');
      nextModuleId = nextTab?.id || 'home';
    } else {
      nextModuleId = tabs.find((tab) => tab.instanceId === activeTabId)?.id || 'home';
    }

    setTabs(newTabs);
    navigate('/user', {
      replace: true,
      state: { moduleId: nextModuleId, options: {} },
    });
  };

  return (
    <AppNavContext.Provider value={{ openModule, serviceFocus, aiIntent, gameIntent, openEmergency, currentModuleId, openAssist, openMemoryQuiz, openGuide, setActiveGameId, activeGameId }}>
    <div
      className={`app-container ss-theme ss-patient-shell ss-lakeside ss-has-region-scenery ${currentModuleId === 'home' ? 'is-home-route' : ''} ${railCollapsed ? ' is-rail-collapsed' : ''}${railOpen ? ' is-rail-open' : ''}${sidebarResizing ? ' is-sidebar-resizing' : ''}`}
      style={{ ['--ss-sidebar-width']: `${railCollapsed ? 72 : sidebarWidth}px` } as React.CSSProperties}
    >
      <RegionSceneryBackground />
      {railOpen && (
        <button type="button" className="ss-rail-backdrop" aria-label="Close menu" onClick={() => setRailOpen(false)} />
      )}
      <aside className={`sidebar${railCollapsed ? ' is-collapsed' : ''}`}>
        {!railCollapsed && (
          <button
            type="button"
            className="ss-sidebar-resize"
            aria-label="Resize sidebar"
            onPointerDown={(event) => {
              event.preventDefault();
              setSidebarResizing(true);
            }}
          />
        )}
        <div className="sidebar-header">
          <motion.div
            className="ss-sidebar-brand-block is-logo-only"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="ss-brand-link ss-new-brand-link ss-sidebar-identity-link ss-logo-toggle"
              title="Smriti Saarthi — toggle menu"
              aria-label={railCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => {
                if (window.matchMedia('(max-width: 860px)').matches) {
                  setRailOpen((open) => !open);
                  return;
                }
                setRailCollapsed((collapsed) => !collapsed);
              }}
            >
              <div className="ss-new-brand-icon">
                <img
                  src={logoMark}
                  alt="Smriti Saarthi"
                  className={`ss-new-brand-logo${railCollapsed ? ' ss-rail-collapsed-logo' : ''}`}
                  draggable={false}
                />
              </div>
            </button>
            {!railCollapsed && (
              <button
                type="button"
                className="ss-about-us-btn ss-about-us-inline"
                onClick={() => setShowAboutUs(true)}
                aria-label={t('nav.aboutUs')}
                title={t('nav.aboutUs')}
              >
                <Info size={13} aria-hidden="true" />
                <span className="ss-about-us-text">{t('nav.aboutUs')}</span>
              </button>
            )}
          </motion.div>
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
          <span className="ss-rail-label">{t('chrome.newDay')}</span>
        </button>

        <div className="ss-gpt-scroll">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.titleKey} className="sidebar-group-block">
              <p className="ss-rail-kicker">{t(group.titleKey)}</p>
              <nav className="sidebar-nav">
                {group.items.map((item) => {
                  const isActive = (activeTabId === item.id) || (item.id === 'home' && activeTabId === 'home-main');
                  const Icon = item.icon;
                  const label = t(item.labelKey);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        openModule(item.id);
                        setRailOpen(false);
                      }}
                      aria-label={label}
                    >
                      <Icon size={20} />
                      <span className="ss-rail-copy">
                        <span className="ss-rail-label">{label}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="nav-item ss-settings-nav"
            onClick={() => {
              openModule('settings');
              setRailOpen(false);
            }}
            aria-label={t('nav.settings')}
          >
            <Settings size={18} />
            <span className="ss-rail-copy">
              <span className="ss-rail-label">{t('nav.settings')}</span>
            </span>
          </button>
          <button type="button" className="ss-emergency-nav" onClick={() => { openEmergency(); setRailOpen(false); }}>
            <ShieldAlert size={18} />
            <div className="help-now-content">
              <span className="help-now-title">{t('chrome.emergencyHelp')}</span>
              <span className="help-now-sub">{t('chrome.emergencySub')}</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <DashAurora />
        <SaarthiRadialMenu />
        <header className="top-bar ss-topbar ss-transparent-header">
          <div className="ss-header-left">
            <button
              type="button"
              className="ss-mobile-more-btn"
              onClick={() => setRailOpen(true)}
              aria-label={t('chrome.openMenu')}
            >
              <Menu size={22} />
            </button>
            <button
              type="button"
              className="ss-ask-saarthi-hero-btn"
              onClick={openAssist}
              aria-label={t('chrome.askSaarthi')}
              title={t('chrome.askSaarthi')}
            >
              <div className="ss-saarthi-avatar-wrap">
                <img src={companionPortrait} alt="" className="ss-saarthi-avatar-img" />
                <span className="ss-saarthi-breath-ring" />
              </div>
              <div className="ss-saarthi-btn-copy">
                <span className="ss-saarthi-btn-main">{t('chrome.askSaarthi')}</span>
              </div>
            </button>
            <RoleSwitcher compact />
          </div>

          <div className="ss-header-center">
            <JainQuoteCarousel compact />
          </div>

          <div className="ss-header-right">
            <NotificationBell historyPath="/notifications" />
            <HeaderLanguageControl compact />
            <HeaderProfileMenu
              name={displayName}
              onOpenSettings={() => openModule('settings')}
              onOpenAccount={() => openModule('settings')}
            />
          </div>
        </header>
        {showEmergency && <EmergencyPanel onClose={() => setShowEmergency(false)} />}
        <AboutUsModal open={showAboutUs} onClose={() => setShowAboutUs(false)} />
        <SarthiAssistRuntime
          panelOpen={showAssist}
          onPanelOpen={() => setShowAssist(true)}
          onPanelClose={() => setShowAssist(false)}
          paused={assistPaused}
          onLiveChange={setAssistLive}
          authenticated={assistReady}
          showFab={false}
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
                onClick={() => {
                  setActiveTabId(tab.instanceId);
                  navigate('/user', {
                    state: { moduleId: tab.id, options: {} },
                  });
                }}
              >
                <tab.icon size={14} className="tab-icon" />
                {moduleTitle(tab.id)}
                {tab.closable && (
                  <div className="tab-close" title="Close this tab" onClick={(e) => handleCloseTab(e, tab.instanceId)}>
                    <X size={14} />
                  </div>
                )}
              </div>
            ))}
            {tabs.length > 2 && (
              <button
                type="button"
                className="tab-clear-others"
                title="Close all extra tabs"
                onClick={() => {
                  const activeTab = tabs.find((t) => t.instanceId === activeTabId);
                  const keep = [
                    tabs[0],
                    ...(activeTab && activeTab.id !== tabs[0].id ? [activeTab] : []),
                  ];
                  tabsRef.current = keep;
                  setTabs(keep);
                }}
              >
                Clear extra tabs
              </button>
            )}
          </div>
        )}

        <div className="tab-contents-wrapper">
          {tabs.map((tab) => {
            const Component = tab.component;
            const isActive = activeTabId === tab.instanceId;
            const fill = tab.id === 'ai' || tab.id === 'spatial';
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
          {t('chrome.dockHome')}
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'ai' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'ai'))}>
          <MessageSquare size={22} />
          {t('chrome.dockSpeak')}
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'games' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'games'))}>
          <Puzzle size={22} />
          {t('chrome.dockGames')}
        </button>
        <button type="button" className={tabs.find((tab) => tab.id === 'routine' && tab.instanceId === activeTabId) ? 'is-on' : ''} onClick={() => handleOpenModule(MODULES.find((m) => m.id === 'routine'))}>
          <CalendarDays size={22} />
          {t('chrome.dockRoutine')}
        </button>
        <button type="button" className="dock-emergency" onClick={openEmergency}>
          <ShieldAlert size={22} />
          {t('chrome.dockHelp')}
        </button>
      </nav>
      {showMemoryQuiz && (
        <QuizErrorBoundary
          onClose={() => {
            markMemoryQuizDay();
            setShowMemoryQuiz(false);
          }}
        >
          <MemoryQuiz
            onComplete={(result) => {
              try {
                if (result) {
                  saveMemoryQuizResult(result);
                  applyMemoryQuizToAssessment(result, result.patientId || 'aita');
                } else {
                  markMemoryQuizDay();
                }
              } catch {
                markMemoryQuizDay();
              }
              setShowMemoryQuiz(false);
            }}
            onSkip={() => {
              markMemoryQuizDay();
              setShowMemoryQuiz(false);
            }}
          />
        </QuizErrorBoundary>
      )}
      <AlarmRuntime />
      {showGuide && (
        <Guide onClose={() => setShowGuide(false)} />
      )}
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
  useEffect(() => startUpcomingAlarmWatcher(), []);

  return (
    <>
      <RegionScenerySync />
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/keypad" element={<KeypadPhone />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/notifications" element={<NotificationsPage standalone />} />
        <Route path="/user" element={<UserWorkspace />} />
        <Route path="/schemes" element={<UserWorkspace boot="schemes" />} />
        <Route path="/medicine-health" element={<UserWorkspace boot="schemes" />} />
        <Route path="/talk" element={<UserWorkspace boot="talk" />} />
        <Route path="/assist" element={<UserWorkspace boot="assist" />} />
        <Route path="/stories" element={<UserWorkspace boot="stories" />} />
        <Route path="/spatial-analysis" element={<SpatialPresence />} />
        <Route path="/safe-journey" element={<SpatialPresence />} />
      <Route path="/caregiver" element={<CaregiverLayout />}>
        {caregiverChildRoutes()}
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
