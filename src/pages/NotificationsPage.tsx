import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Stethoscope,
  Sparkles,
  Clock,
  FileText,
  Landmark,
  CheckCheck,
  Trash2,
  Search,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  subscribeNotifications,
  triggerDemoNotification,
} from '../lib/notificationStore';
import { bffFetch } from '../lib/bff';
import './NotificationsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All Notifications', icon: Bell },
  { id: 'alarms', label: 'Alarms & Reminders', icon: Clock },
  { id: 'doctor', label: 'Doctor & Notes', icon: Stethoscope },
  { id: 'ai', label: 'AI Agent Training', icon: Sparkles },
  { id: 'docs', label: 'Documents & Rx', icon: FileText },
  { id: 'schemes', label: 'Govt Schemes', icon: Landmark },
  { id: 'unread', label: 'Unread Only', icon: CheckCheck },
];

function getCategoryConfig(type) {
  switch (type) {
    case 'doctor':
      return {
        label: 'Doctor & Clinic',
        badgeClass: 'badge-doctor',
        icon: Stethoscope,
        iconWrapClass: 'icon-wrap-doctor',
      };
    case 'ai_train':
      return {
        label: 'AI Care Agent',
        badgeClass: 'badge-ai',
        icon: Sparkles,
        iconWrapClass: 'icon-wrap-ai',
      };
    case 'alarm':
      return {
        label: 'Routine Alarm',
        badgeClass: 'badge-alarm',
        icon: AlertTriangle,
        iconWrapClass: 'icon-wrap-alarm',
      };
    case 'alarm_upcoming':
      return {
        label: 'Upcoming Reminder',
        badgeClass: 'badge-upcoming',
        icon: Clock,
        iconWrapClass: 'icon-wrap-upcoming',
      };
    case 'document':
      return {
        label: 'Medical Document',
        badgeClass: 'badge-doc',
        icon: FileText,
        iconWrapClass: 'icon-wrap-doc',
      };
    case 'scheme':
      return {
        label: 'Government Scheme',
        badgeClass: 'badge-scheme',
        icon: Landmark,
        iconWrapClass: 'icon-wrap-scheme',
      };
    case 'circle_message':
      return {
        label: 'Care Circle',
        badgeClass: 'badge-circle',
        icon: MessageSquare,
        iconWrapClass: 'icon-wrap-circle',
      };
    default:
      return {
        label: 'System Notice',
        badgeClass: 'badge-system',
        icon: Bell,
        iconWrapClass: 'icon-wrap-system',
      };
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  let rel = '';
  if (diffSec < 60) rel = 'Just now';
  else if (diffSec < 3600) rel = `${Math.floor(diffSec / 60)}m ago`;
  else if (diffSec < 86400) rel = `${Math.floor(diffSec / 3600)}h ago`;
  else rel = `${Math.floor(diffSec / 86400)}d ago`;

  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${rel} • ${dateStr}, ${timeStr}`;
}

export default function NotificationsPage({ standalone = false }: { standalone?: boolean }) {
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const demoRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bffFetch('/api/v1/inbox/summary');
    return subscribeNotifications((list) => {
      setNotifications(list);
    });
  }, []);

  useEffect(() => {
    if (!demoMenuOpen) return undefined;
    const onMouseDown = (e) => {
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDemoMenuOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [demoMenuOpen]);

  // Compute stat counts
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const alarms = notifications.filter((n) => n.type === 'alarm' || n.type === 'alarm_upcoming').length;
    const doctor = notifications.filter((n) => n.type === 'doctor' || n.type === 'circle_message').length;
    const ai = notifications.filter((n) => n.type === 'ai_train').length;
    const schemes = notifications.filter((n) => n.type === 'scheme').length;
    return { total, unread, alarms, doctor, ai, schemes };
  }, [notifications]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeCategory === 'unread' && item.read) return false;
      if (activeCategory === 'alarms' && item.type !== 'alarm' && item.type !== 'alarm_upcoming') return false;
      if (activeCategory === 'doctor' && item.type !== 'doctor' && item.type !== 'circle_message') return false;
      if (activeCategory === 'ai' && item.type !== 'ai_train') return false;
      if (activeCategory === 'docs' && item.type !== 'document') return false;
      if (activeCategory === 'schemes' && item.type !== 'scheme') return false;

      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.message?.toLowerCase().includes(query);
        const actionMatch = item.actionLabel?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !actionMatch) return false;
      }

      return true;
    });
  }, [notifications, activeCategory, priorityFilter, searchQuery]);

  const handleActionClick = (item) => {
    if (!item.read) markAsRead(item.id);
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  return (
    <div className={`ss-notifications-page-shell${standalone ? ' is-standalone' : ''}`}>
      <div className="ss-notif-page-inner">
        {/* Top Header */}
        <div className="ss-notif-page-header">
          <div className="ss-notif-page-header-text">
            {standalone && (
              <button
                type="button"
                className="ss-notif-back-btn"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            )}
            <div className="ss-notif-page-title-row">
              <div className="ss-notif-page-icon-badge">
                <Bell size={24} />
              </div>
              <div>
                <h1 className="ss-notif-page-title">Notification History & Alerts</h1>
                <p className="ss-notif-page-sub">
                  Track doctor messages, AI assistant updates, medication alarms, upcoming reminders, and welfare schemes.
                </p>
              </div>
            </div>
          </div>

          <div className="ss-notif-page-header-actions">
            {stats.unread > 0 && (
              <button
                type="button"
                className="ss-notif-btn-secondary"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck size={16} />
                <span>Mark All Read</span>
              </button>
            )}

            <div className="ss-notif-demo-dropdown-container" ref={demoRef}>
              <button
                type="button"
                className="ss-notif-btn-primary"
                aria-expanded={demoMenuOpen}
                onClick={() => setDemoMenuOpen((v) => !v)}
              >
                <PlusCircle size={16} />
                <span>Simulate Demo Event</span>
              </button>

              {demoMenuOpen && (
                <>
                  <div
                    className="ss-notif-demo-backdrop"
                    onClick={() => setDemoMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="ss-notif-page-demo-menu" role="menu">
                    <div className="ss-demo-menu-title">Trigger Live Notification:</div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('alarm_upcoming');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <Clock size={14} className="c-upcoming" />
                    <span>Upcoming Alarm (30m reminder)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('alarm');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <AlertTriangle size={14} className="c-alarm" />
                    <span>Routine Alarm Fired</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('doctor');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <Stethoscope size={14} className="c-doctor" />
                    <span>Doctor Message / Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('ai_train');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <Sparkles size={14} className="c-ai" />
                    <span>Caregiver Trained AI Agent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('document');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <FileText size={14} className="c-doc" />
                    <span>Prescription / Document Updated</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('scheme');
                      setDemoMenuOpen(false);
                    }}
                  >
                    <Landmark size={14} className="c-scheme" />
                    <span>New Government Welfare Scheme</span>
                  </button>
                </div>
              </>
            )}
          </div>

            {notifications.length > 0 && (
              <button
                type="button"
                className="ss-notif-btn-danger"
                onClick={() => {
                  if (window.confirm('Clear all notifications from history?')) {
                    clearAllNotifications();
                  }
                }}
                title="Clear all notifications"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="ss-notif-stats-grid">
          <div className="ss-notif-stat-card" onClick={() => setActiveCategory('all')}>
            <div className="ss-stat-num">{stats.total}</div>
            <div className="ss-stat-lbl">Total Alerts</div>
          </div>
          <div className="ss-notif-stat-card is-unread-card" onClick={() => setActiveCategory('unread')}>
            <div className="ss-stat-num">{stats.unread}</div>
            <div className="ss-stat-lbl">Unread</div>
          </div>
          <div className="ss-notif-stat-card" onClick={() => setActiveCategory('alarms')}>
            <div className="ss-stat-num">{stats.alarms}</div>
            <div className="ss-stat-lbl">Alarms & Reminders</div>
          </div>
          <div className="ss-notif-stat-card" onClick={() => setActiveCategory('doctor')}>
            <div className="ss-stat-num">{stats.doctor}</div>
            <div className="ss-stat-lbl">Doctor Notes</div>
          </div>
          <div className="ss-notif-stat-card" onClick={() => setActiveCategory('ai')}>
            <div className="ss-stat-num">{stats.ai}</div>
            <div className="ss-stat-lbl">AI Agent Trained</div>
          </div>
          <div className="ss-notif-stat-card" onClick={() => setActiveCategory('schemes')}>
            <div className="ss-stat-num">{stats.schemes}</div>
            <div className="ss-stat-lbl">Govt Schemes</div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="ss-notif-filter-bar">
          <div className="ss-notif-search-wrap">
            <Search size={16} className="ss-search-icon" />
            <input
              type="text"
              className="ss-notif-search-input"
              placeholder="Search notifications by keyword, doctor, medicine, or scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ss-search-clear"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="ss-notif-category-tabs">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`ss-cat-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Cards List */}
        <div className="ss-notif-cards-list">
          {filteredNotifications.length === 0 ? (
            <div className="ss-notif-no-results">
              <CheckCheck size={48} className="ss-empty-icon" />
              <h3>No Notifications Found</h3>
              <p>
                {searchQuery || activeCategory !== 'all' || priorityFilter !== 'all'
                  ? 'No notifications match your active search or filter criteria.'
                  : 'You have no notifications in your history.'}
              </p>
              {(searchQuery || activeCategory !== 'all' || priorityFilter !== 'all') && (
                <button
                  type="button"
                  className="ss-reset-filters-btn"
                  onClick={() => {
                    setActiveCategory('all');
                    setPriorityFilter('all');
                    setSearchQuery('');
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const cfg = getCategoryConfig(item.type);
              const Icon = cfg.icon;
              return (
                <div
                  key={item.id}
                  className={`ss-history-card${!item.read ? ' is-unread' : ''}${item.priority === 'high' ? ' is-high' : ''}`}
                  onClick={() => handleActionClick(item)}
                >
                  <div className={`ss-history-icon-box ${cfg.iconWrapClass}`}>
                    <Icon size={20} />
                  </div>

                  <div className="ss-history-card-body">
                    <div className="ss-history-meta-top">
                      <div className="ss-history-badges-row">
                        <span className={`ss-type-badge ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                        {item.priority === 'high' && (
                          <span className="ss-priority-badge-high">High Priority</span>
                        )}
                        {!item.read && <span className="ss-unread-pill">New</span>}
                      </div>
                      <span className="ss-history-timestamp">{formatDate(item.time)}</span>
                    </div>

                    <h3 className="ss-history-card-title">{item.title}</h3>
                    <p className="ss-history-card-desc">{item.message}</p>

                    {item.actionLabel && (
                      <div className="ss-history-action-row">
                        <span className="ss-history-action-cta">
                          <span>{item.actionLabel}</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ss-history-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="ss-history-btn-icon"
                      title={item.read ? 'Mark as unread' : 'Mark as read'}
                      onClick={() => markAsRead(item.id)}
                    >
                      <CheckCheck size={16} />
                    </button>
                    <button
                      type="button"
                      className="ss-history-btn-icon is-del"
                      title="Remove notification"
                      onClick={() => removeNotification(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
