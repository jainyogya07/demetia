import { useLanguage } from "../context/LanguageContext";
import {
  Menu,
  Globe2,
  WifiOff,
  Bell,
  ChevronDown,
  MapPin,
} from "lucide-react";

function Topbar() {
  const {
    language,
    setLanguage,
    t,
    detectedRegion,
    isAutoLanguage,
    enableAutomaticLanguage,
    locationLoading,
    setDemoRegion,
    isDemoLocation,
  } = useLanguage();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <header className="topbar">

      {/* MENU */}
      <button className="menu-button">
        <Menu size={25} />
      </button>

      {/* GREETING */}
      <div className="greeting-section">
        <h2>
          {t(greeting)}, Demo User 👋
        </h2>

        <span>
          Let's make your day meaningful.
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="topbar-right">

        {/* LANGUAGE */}
        <div className="language-selector">
          <Globe2 size={18} />

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value, true)
            }
          >
            <option value="en">
              English
            </option>

            <option value="hi">
              हिंदी
            </option>

            <option value="as">
              অসমীয়া
            </option>

            <option value="mni">
              Manipuri
            </option>

            <option value="kh">
              Khasi
            </option>

            <option value="mz">
              Mizo
            </option>

            <option value="bn">
              বাংলা
            </option>

            <option value="ne">
              नेपाली
            </option>
          </select>
        </div>

        {/* DETECTED REGION */}
        <div className="detected-region">

          <MapPin size={16} />

          <div>
            {locationLoading ? (
              <span>
                Detecting location...
              </span>
            ) : detectedRegion ? (
              <>
                <strong>
                  {detectedRegion}
                </strong>

                <span>
                  {isAutoLanguage
                    ? "Auto language"
                    : "Manual language"}
                </span>
              </>
            ) : (
              <span>
                Location unavailable
              </span>
            )}
          </div>

        </div>

        {/* USE MY REGION BUTTON */}
        {!isAutoLanguage && (
          <button
            className="use-region-button"
            onClick={enableAutomaticLanguage}
            title="Automatically select language based on your location"
          >
            <MapPin size={16} />
            Use my region
          </button>
        )}

        {/* DEMO LOCATION */}
        <div className="demo-location">

          <MapPin size={16} />

          <select
            value={isDemoLocation ? detectedRegion : ""}
            onChange={(e) => {
              if (e.target.value) {
                setDemoRegion(e.target.value);
              }
            }}
          >
            <option value="">
              Demo Location
            </option>

            <option value="Assam">
              Assam → Assamese
            </option>

            <option value="Arunachal Pradesh">
              Arunachal Pradesh → English
            </option>

            <option value="Manipur">
              Manipur → Manipuri
            </option>

            <option value="Meghalaya">
              Meghalaya → Khasi
            </option>

            <option value="Mizoram">
              Mizoram → Mizo
            </option>

            <option value="Nagaland">
              Nagaland → English
            </option>

            <option value="Tripura">
              Tripura → Bengali
            </option>

            <option value="Sikkim">
              Sikkim → Nepali
            </option>

          </select>

        </div>

        {/* OFFLINE STATUS */}
        <div className="offline-status">

          <WifiOff size={23} />

          <div>
            <strong>
              {t("You are Offline")}
            </strong>

            <span>
              {t(
                "Data will sync when internet is available"
              )}
            </span>
          </div>

        </div>

        {/* NOTIFICATIONS */}
        <button className="notification-button">

          <Bell size={23} />

          <span className="notification-badge">
            3
          </span>

          <small>
            {t("Alerts")}
          </small>

        </button>

        {/* PROFILE */}
        <div className="profile-section">

          <div className="profile-avatar">
            👵
          </div>

          <div className="profile-info">

            <strong>
              Demo User
            </strong>

            <span>
              {t("Patient")}
            </span>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}

export default Topbar;