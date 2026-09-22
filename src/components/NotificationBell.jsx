import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  X,
  Stethoscope,
  Sparkles,
  Clock,
  FileText,
  Landmark,
  ExternalLink,
  Trash2,
  ChevronRight,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
  subscribeNotifications,
  triggerDemoNotification,
} from '../lib/notificationStore';
import './NotificationBell.css';

function getIconForType(type) {
  switch (type) {
    case 'doctor':
      return <Stethoscope size={16} className="notif-icon-doc" />;
    case 'ai_train':
      return <Sparkles size={16} className="notif-icon-ai" />;
    case 'alarm':
      return <AlertCircle size={16} className="notif-icon-alarm" />;
    case 'alarm_upcoming':
      return <Clock size={16} className="notif-icon-upcoming" />;
    case 'document':
      return <FileText size={16} className="notif-icon-docu" />;
    case 'scheme':
      return <Landmark size={16} className="notif-icon-scheme" />;
    default:
      return <Bell size={16} className="notif-icon-default" />;
  }
}

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export default function NotificationBell({ historyPath }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [filter, setFilter] = useState('all');
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const targetHistoryPath =
    historyPath ||
    (location.pathname.startsWith('/doctor')
      ? '/doctor/alerts'
      : location.pathname.startsWith('/caregiver')
        ? '/caregiver/notifications'
        : '/notifications');

  useEffect(() => {
    return subscribeNotifications((updated) => {
      setNotifications(updated);
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onMousedown = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
        setShowDemoMenu(false);
      }
    };
    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setShowDemoMenu(false);
      }
    };
    document.addEventListener('mousedown', onMousedown);
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('keydown', onKeydown);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasHighPriorityUnread = notifications.some(
    (n) => !n.read && (n.priority === 'high' || n.type === 'alarm' || n.type === 'alarm_upcoming')
  );

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'alarms') return item.type === 'alarm' || item.type === 'alarm_upcoming';
    if (filter === 'doctor') return item.type === 'doctor' || item.type === 'circle_message';
    if (filter === 'ai') return item.type === 'ai_train';
    if (filter === 'schemes') return item.type === 'scheme';
    return true;
  });

  const previewList = filteredNotifications.slice(0, 6);

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.actionUrl) {
      setOpen(false);
      navigate(item.actionUrl);
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate(targetHistoryPath);
  };

  return (
    <div className={`ss-notification-bell-wrap${open ? ' is-open' : ''}`} ref={bellRef}>
      <button
        type="button"
        className={`ss-notification-bell-btn${unreadCount > 0 ? ' has-unread' : ''}`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
          setShowDemoMenu(false);
        }}
        title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'Notifications'}
      >
        <Bell size={19} className="ss-bell-icon" />
        {unreadCount > 0 && (
          <span className="ss-notif-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {hasHighPriorityUnread && <span className="ss-notif-pulse" />}
      </button>

      {open && (
        <div className="ss-notification-popover" role="dialog" aria-label="Notifications Panel">
          <div className="ss-notif-popover-header">
            <div className="ss-notif-header-title">
              <div className="ss-notif-title-row">
                <Bell size={17} />
                <strong>Notifications</strong>
              </div>
              {unreadCount > 0 && (
                <span className="ss-notif-unread-pill">{unreadCount} new</span>
              )}
            </div>
            <div className="ss-notif-header-actions">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="ss-notif-header-btn"
                  title="Mark all as read"
                  onClick={() => markAllAsRead()}
                >
                  <CheckCheck size={15} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                className="ss-notif-icon-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="ss-notif-filter-pills">
            <button
              type="button"
              className={`ss-filter-pill${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              className={`ss-filter-pill${filter === 'unread' ? ' is-active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              className={`ss-filter-pill${filter === 'alarms' ? ' is-active' : ''}`}
              onClick={() => setFilter('alarms')}
            >
              Alarms
            </button>
            <button
              type="button"
              className={`ss-filter-pill${filter === 'doctor' ? ' is-active' : ''}`}
              onClick={() => setFilter('doctor')}
            >
              Doctor
            </button>
            <button
              type="button"
              className={`ss-filter-pill${filter === 'ai' ? ' is-active' : ''}`}
              onClick={() => setFilter('ai')}
            >
              AI Train
            </button>
            <button
              type="button"
              className={`ss-filter-pill${filter === 'schemes' ? ' is-active' : ''}`}
              onClick={() => setFilter('schemes')}
            >
              Schemes
            </button>
          </div>

          <div className="ss-notif-list-container">
            {previewList.length === 0 ? (
              <div className="ss-notif-empty-state">
                <CheckCheck size={32} className="ss-notif-empty-icon" />
                <p className="ss-notif-empty-text">
                  {filter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications in this filter.'}
                </p>
              </div>
            ) : (
              previewList.map((item) => (
                <div
                  key={item.id}
                  className={`ss-notif-item${!item.read ? ' is-unread' : ''}${item.priority === 'high' ? ' is-high-priority' : ''}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className={`ss-notif-item-icon ss-notif-icon-wrap ss-type-${item.type}`}>
                    {getIconForType(item.type)}
                  </div>
                  <div className="ss-notif-item-body">
                    <div className="ss-notif-item-top">
                      <span className="ss-notif-item-title">{item.title}</span>
                      <span className="ss-notif-item-time">{formatRelativeTime(item.time)}</span>
                    </div>
                    <p className="ss-notif-item-desc">{item.message}</p>
                    {item.actionLabel && (
                      <div className="ss-notif-item-action-link">
                        <span>{item.actionLabel}</span>
                        <ChevronRight size={13} />
                      </div>
                    )}
                  </div>
                  <div className="ss-notif-item-end">
                    {!item.read && <span className="ss-notif-item-dot" title="Unread" />}
                    <button
                      type="button"
                      className="ss-notif-item-del-btn"
                      title="Remove notification"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(item.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="ss-notif-popover-footer">
            <button
              type="button"
              className="ss-notif-footer-history-btn"
              onClick={handleViewAll}
            >
              <span>View full notification history</span>
              <ExternalLink size={14} />
            </button>

            <div className="ss-notif-demo-quickwrap">
              <button
                type="button"
                className="ss-notif-demo-toggle"
                onClick={() => setShowDemoMenu((v) => !v)}
                title="Simulate events for testing"
              >
                <PlusCircle size={13} />
                <span>Test events</span>
              </button>

              {showDemoMenu && (
                <div className="ss-notif-demo-dropdown">
                  <div className="ss-demo-head">Simulate Event Notification:</div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('alarm_upcoming');
                      setShowDemoMenu(false);
                    }}
                  >
                    🔔 Upcoming Alarm (30m reminder)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('alarm');
                      setShowDemoMenu(false);
                    }}
                  >
                    ⏰ Fired Routine Alarm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('doctor');
                      setShowDemoMenu(false);
                    }}
                  >
                    🩺 Doctor Note / Message
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('ai_train');
                      setShowDemoMenu(false);
                    }}
                  >
                    ✨ AI Agent Trained
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('document');
                      setShowDemoMenu(false);
                    }}
                  >
                    📄 Prescription / Doc Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDemoNotification('scheme');
                      setShowDemoMenu(false);
                    }}
                  >
                    🏛️ New Government Scheme
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
