import {
  Home,
  Brain,
  Mic,
  CalendarDays,
  Pill,
  BarChart3,
  Users,
  ShieldCheck,
  BookOpen,
  Globe,
  Headphones,
  Settings,
  PhoneCall,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; 

function Sidebar({ openTabs, setOpenTabs }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    {
      name: t("home"),
      path: "/",
      icon: Home,
    },
    {
      name: t("brainGames"),
      path: "/brain-games",
      icon: Brain,
    },
    {
      name: t("Talk to Smriti"),
      path: "/talk-to-smriti",
      icon: Mic,
    },
    {
      name: t("dailyRoutine"),
      path: "/daily-routine",
      icon: CalendarDays,
    },
    {
      name: t("medicineHealth"),
      path: "/medicine-health",
      icon: Pill,
    },
    {
      name: t("memoryProgress"),
      path: "/memory-progress",
      icon: BarChart3,
    },
    {
      name: t("careCircle"),
      path: "/care-circle",
      icon: Users,
    },
    {
      name: t("safetyLocation"),
      path: "/safety-location",
      icon: ShieldCheck,
    },
    {
      name: t("memoryBook"),
      path: "/memory-book",
      icon: BookOpen,
    },
    {
      name: "Language",
      path: "/language",
      icon: Globe,
    },
    {
      name: t("helpSupport"),
      path: "/help-support",
      icon: Headphones,
    },
    {
      name: t("settings"),
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (item) => {
    const tabAlreadyOpen = openTabs.some(
      (tab) => tab.path === item.path
    );

    if (!tabAlreadyOpen) {
      setOpenTabs([
        ...openTabs,
        {
          name: item.name,
          path: item.path,
        },
      ]);
    }

    navigate(item.path);
  };

  return (
    <aside className="sidebar">

      {/* LOGO / BRAND */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          🧠
        </div>

        <div>
          <h1>समवेती सारथी</h1>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              <Icon size={21} />

              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* EMERGENCY HELP */}
      <div className="emergency-card">
        <div className="emergency-icon">
          <PhoneCall size={26} />
        </div>

        <div className="emergency-content">
          <h3>Emergency Help</h3>
          <p>Tap to call for help</p>
          <strong>Helpline: 112 / 102 / 108</strong>
          <span>(Works offline)</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;