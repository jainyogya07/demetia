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
    <div className="safety-status-card">
      <div className="section-title">
        <div className="title-icon">
          <ShieldCheck size={20} />
        </div>
        <h2>{t("safetyStatus")}</h2>
      </div>

      <div className="safety-content">
        <div className="safety-item">
          <MapPin size={18} />
          <div>
            <span className="safety-label">{t("safeZone")}</span>
            <strong>{t("homeZone")} — Zoo Road</strong>
          </div>
        </div>

        <div className="safety-item">
          <Clock size={18} />
          <div>
            <span className="safety-label">{t("lastCheckIn")}</span>
            <strong>{mins == null ? t("notYetToday") : mins < 1 ? t("justNow") : `${mins} min`}</strong>
          </div>
        </div>

        <div className="safety-good">
          <span className="status-dot"></span>
          <span>{mins != null && mins < 180 ? t("allGood") : t("waitingCheckIn")}</span>
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
