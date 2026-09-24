import { ShieldCheck, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { useLanguage } from "../context/LanguageContext";
import { loadCheckIns, minutesSince, subscribeLive } from "../lib/liveState";

function SafetyStatus() {
  const { openModule } = useAppNav();
  const { t } = useLanguage();
  const [, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const last = loadCheckIns()[0];
  const mins = minutesSince(last?.at);

  return (
    <div className="safety-status-card ss-calm-safety-card">
      <div className="section-title">
        <div className="title-icon ss-calm-safety-icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2>You&apos;re safe</h2>
          <p className="ss-safety-subtitle">Care circle connected &amp; watching gently</p>
        </div>
      </div>

      <div className="safety-content">
        <div className="safety-item">
          <MapPin size={18} />
          <div>
            <span className="safety-label">Home Sanctuary</span>
            <strong>Home Zone — Zoo Road</strong>
          </div>
        </div>

        <div className="safety-item">
          <Clock size={18} />
          <div>
            <span className="safety-label">Last check-in</span>
            <strong>{mins == null ? 'Just now' : mins < 1 ? 'Just now' : `${mins} min ago`}</strong>
          </div>
        </div>

        <div className="safety-good ss-calm-safe-good">
          <span className="status-dot ss-safe-green-dot"></span>
          <span>All calm &amp; secure</span>
        </div>

        <button
          type="button"
          className="view-members-btn"
          onClick={() => openModule("safety")}
        >
          <MapPin size={16} />
          {t("openSafety")}
        </button>
      </div>
    </div>
  );
}

export default SafetyStatus;
