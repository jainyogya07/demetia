import { useState } from "react";

function Topbar() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <>
      {/* =========================
          TOPBAR
      ========================= */}

      <header className="topbar">

        {/* LEFT SIDE */}
        <div className="topbar-left">
          <h1>Saheli Sahaay</h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="topbar-actions">

          {/* EMERGENCY HELP */}
          <button
            type="button"
            className="emergency-help-button"
            onClick={() => setShowEmergency(true)}
          >
            <span>🚨</span>
            <span>Emergency Help</span>
          </button>

          <button
            className= "topup-header-button">
              <span> + </span>
              Top up Credits
          </button>

          {/* LANGUAGE */}
          <button
            type="button"
            className="topbar-button language-button"
            onClick={() =>
              setLanguage(
                language === "English"
                  ? "Hindi"
                  : "English"
              )
            }
          >
            🌐
            <span>{language}</span>
          </button>

          {/* NOTIFICATION */}
          <button
            type="button"
            className="topbar-button notification"
          >
            🔔

            <span className="notification-count">
              3
            </span>
          </button>

          {/* PROFILE */}
          <button
            type="button"
            className="profile-button"
          >
            <span className="profile-avatar">
              P
            </span>

            <span>Demo User</span>

            <span>⌄</span>
          </button>

        </div>

      </header>

      {/* =========================
          EMERGENCY POPUP
      ========================= */}

      {showEmergency && (
        <div
          className="emergency-overlay"
          onClick={() => setShowEmergency(false)}
        >

          <div
            className="emergency-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}
            <div className="emergency-panel-header">

              <div>
                <span className="emergency-label">
                  EMERGENCY SUPPORT
                </span>

                <h2>
                  How can we help?
                </h2>

                <p>
                  Choose a helpline below to get
                  immediate support.
                </p>
              </div>

              <button
                type="button"
                className="emergency-close"
                onClick={() =>
                  setShowEmergency(false)
                }
              >
                ×
              </button>

            </div>

            {/* HELPLINES */}
            <div className="emergency-list">

              {/* TELE-MANAS */}
              <div className="emergency-card">

                <div className="emergency-card-icon">
                  🧠
                </div>

                <div className="emergency-card-content">

                  <h3>
                    Tele-MANAS
                  </h3>

                  <p>
                    24/7 mental health support
                  </p>

                  <strong>
                    14416
                  </strong>

                </div>

                <a
                  href="tel:14416"
                  className="emergency-call-button"
                >
                  📞 Call
                </a>

              </div>

              {/* EMERGENCY SERVICES */}
              <div className="emergency-card">

                <div className="emergency-card-icon">
                  🚨
                </div>

                <div className="emergency-card-content">

                  <h3>
                    Emergency Services
                  </h3>

                  <p>
                    For immediate emergency assistance
                  </p>

                  <strong>
                    112
                  </strong>

                </div>

                <a
                  href="tel:112"
                  className="emergency-call-button"
                >
                  📞 Call
                </a>

              </div>

            </div>

            {/* FOOTER */}
            <p className="emergency-footer">
              If you are in immediate danger, please
              contact the appropriate emergency service
              or seek help from someone nearby.
            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default Topbar;