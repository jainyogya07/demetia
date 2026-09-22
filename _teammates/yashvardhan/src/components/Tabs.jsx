import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const pageNames = {
  "/": "Home",
  "/brain-games": "Brain Games",
  "/talk-to-smriti": "Talk to Smriti",
  "/daily-routine": "Daily Routine",
  "/medicine-health": "Medicine & Health",
  "/memory-progress": "Memory Progress",
  "/care-circle": "My Care Circle",
  "/safety-location": "Safety & Location",
  "/memory-book": "Memory Book",
  "/language": "Language",
  "/help-support": "Help & Support",
  "/settings": "Settings",
};

function Tabs({ openTabs, setOpenTabs }) {
  const navigate = useNavigate();
  const location = useLocation();

  const closeTab = (event, path) => {
    event.stopPropagation();

    // Home tab should always remain available
    if (path === "/") return;

    const updatedTabs = openTabs.filter((tab) => tab.path !== path);

    setOpenTabs(updatedTabs);

    // If closing the currently active tab, go to Home
    if (location.pathname === path) {
      navigate("/");
    }
  };

  return (
    <div className="tabs-bar">
      {openTabs.map((tab) => (
        <button
          key={tab.path}
          className={`browser-tab ${
            location.pathname === tab.path ? "active-tab" : ""
          }`}
          onClick={() => navigate(tab.path)}
        >
          <span>{tab.name}</span>

          {tab.path !== "/" && (
            <X
              size={15}
              className="close-tab"
              onClick={(event) => closeTab(event, tab.path)}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;