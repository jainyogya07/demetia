import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const pageNames = {
  "/": "Home",
  "/ai-companion": "AI Companion",
  "/support-plan": "My Support Plan",
  "/services": "Services & Credits",
  "/cases": "Cases & Disputes",
  "/documents": "My Documents",
  "/community": "Community",
  "/work": "Work & Independence",
  "/tickets": "Support Tickets",
  "/orders": "Order History",
};

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const [tabs, setTabs] = useState([
    {
      name: "Home",
      path: "/",
    },
  ]);

  const openPage = (path) => {
    const name = pageNames[path] || "Page";

    setTabs((currentTabs) => {
      const alreadyOpen = currentTabs.some(
        (tab) => tab.path === path
      );

      if (alreadyOpen) {
        return currentTabs;
      }

      return [
        ...currentTabs,
        {
          name,
          path,
        },
      ];
    });

    navigate(path);
  };

  const closeTab = (path) => {
    if (path === "/") {
      return;
    }

    setTabs((currentTabs) => {
      const index = currentTabs.findIndex(
        (tab) => tab.path === path
      );

      const updatedTabs = currentTabs.filter(
        (tab) => tab.path !== path
      );

      if (currentPath === path) {
        const nextTab =
          updatedTabs[index] ||
          updatedTabs[index - 1] ||
          updatedTabs[0];

        navigate(nextTab.path);
      }

      return updatedTabs;
    });
  };

  return (
    <div className="app">

      <Sidebar onNavigate={openPage} />

      <main className="main">

        <Topbar />

        {/* APPLICATION TABS */}
        <div className="page-tabs">

          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={`page-tab ${
                currentPath === tab.path
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate(tab.path)}
            >
              <span>{tab.name}</span>

              {tab.path !== "/" && (
                <button
                  className="tab-close"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.path);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button className="new-tab-button">
            +
          </button>

        </div>

        <div className="page-content">
          <Outlet />
        </div>

      </main>
    </div>
  );
}

export default Layout;