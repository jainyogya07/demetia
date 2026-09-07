import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  HeartHandshake,
  BriefcaseBusiness,
  Scale,
  FileText,
  Users,
  Ticket,
  Package,
  Settings,
  HandCoins,
  ShieldCheck,
} from "lucide-react";

function Sidebar() {
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={19} />,
    },
    {
      name: "AI Companion",
      path: "/ai-companion",
      icon: <Bot size={19} />,
    },
    {
      name: "Services & Credits",
      path: "/services",
      icon: <BriefcaseBusiness size={19} />,
    },
    {
      name: "Support Credits",
      path: "/support-credits",
      icon: <HandCoins size={19} />,
    },
    {
      name: "Cases & Disputes",
      path: "/cases",
      icon: <Scale size={19} />,
    },
    {
      name: "My Documents",
      path: "/documents",
      icon: <FileText size={19} />,
    },
    {
      name: "Community",
      path: "/community",
      icon: <Users size={19} />,
    },
    {
      name: "Work & Independence",
      path: "/work",
      icon: <BriefcaseBusiness size={19} />,
    },
    {
      name: "Support Tickets",
      path: "/tickets",
      icon: <Ticket size={19} />,
    },
    {
      name: "Order History",
      path: "/orders",
      icon: <Package size={19} />,
    },
  ];

  return (
    <aside className="sidebar">

      {/* =========================
          BRAND
      ========================= */}

      <div className="brand">
        <div className="brand-icon">
          <HeartHandshake size={18} />
        </div>

        <div>
          <h2>Saheli Sahaay</h2>

          <p>Support. Empowerment. Independence.</p>
        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            {item.icon}

            <span>{item.name}</span>
          </NavLink>

          
        ))}
      </nav>

      {/* =========================
          BOTTOM SECTION
      ========================= */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="consent"
        >
          <ShieldCheck size={18} />

          <span>Privacy & Consent</span>
        </button>

        <NavLink
          to="/settings"
          className="settings"
        >
          <Settings size={18} />

          <span>Settings</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;