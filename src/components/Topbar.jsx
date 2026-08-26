import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import {
  Menu,
  Globe2,
  WifiOff,
  Bell,
  ChevronDown
} from "lucide-react";

function Topbar() {
  const {language, setLanguage,t} = useLanguage();
  const languages = [
    {code:"en", name:"English"},
    {code:"as", name:"অসমীয়া"},
    {code:"kh", name:"Khasi"},
    {code:"hi", name:"हिंदी"},

  ]
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <header className="topbar">

      <button className="menu-button">
        <Menu size={25} />
      </button>

      <div className="greeting-section">
        <h2>{greeting}, Demo User 👋</h2>
        <p>Aji apunar din tu bhal hok. Aai ami xate achu.</p>
        <span>Let's make your day meaningful.</span>
      </div>

      <div className="topbar-right">

        <div className="language-selector">
          <Globe2 size={20} />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="অসমীয়া">অসমীয়া</option>
            <option value="Khasi">Khasi</option>
            <option value="Mizo">Mizo</option>
            <option value="Manipuri">Manipuri</option>
            <option value="Bodo">Bodo</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="offline-status">
          <WifiOff size={23} />

          <div>
            <strong>You are Offline</strong>
            <span>Data will sync when internet is available</span>
          </div>
        </div>

        <button className="notification-button">
          <Bell size={23} />
          <span className="notification-badge">3</span>
          <small>Alerts</small>
        </button>

        <div className="profile-section">
          <div className="profile-avatar">
            👵
          </div>

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

export default Topbar;