import {
  Menu,
  Globe,
  WifiOff,
  Bell,
  ChevronDown,
} from "lucide-react";

import "./Header.css";

export default function Header({ toggleSidebar }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={26} />
        </button>

        <div className="header-brand">
          <div className="brand-logo">🧠</div>

          <div className="brand-text">
            <h1>Smriti Saathi</h1>
            <span>Your Care. Our Support.</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="welcome-text">
          <h2>☀️ Good Afternoon, Demo User 👋</h2>
          <p>Aji apunar din tu bhal hok. Aai ami xate achu.</p>
        </div>
      </div>

      <div className="header-right">
        <button className="header-language">
          <Globe size={19} />
          English
          <ChevronDown size={16} />
        </button>

        <div className="offline-status">
          <WifiOff size={23} />

          <div>
            <strong>You are Offline</strong>
            <span>Data will sync when internet is available</span>
          </div>
        </div>

        <button className="alerts-button">
          <div className="alert-icon">
            <Bell size={23} />
            <span className="notification-count">3</span>
          </div>
          <small>Alerts</small>
        </button>

        <div className="header-profile">
          <div className="profile-avatar">👩‍🦳</div>

          <div className="profile-info">
            <strong>Demo User</strong>
            <span>Patient</span>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>
    </header>
  );
}