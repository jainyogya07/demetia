import { ShieldCheck, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { loadCheckIns, minutesSince, subscribeLive } from "../lib/liveState";

function SafetyStatus() {
  const { openModule } = useAppNav();
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
        <h2>Safety Status</h2>
      </div>

      <div className="safety-content">
        <div className="safety-item">
          <MapPin size={18} />
          <div>
            <span className="safety-label">Safe Zone</span>
            <strong>Home — Zoo Road</strong>
          </div>
        </div>

        <div className="safety-item">
          <Clock size={18} />
          <div>
            <span className="safety-label">Last Check-in</span>
            <strong>{mins == null ? "Not yet today" : mins < 1 ? "Just now" : `${mins} min ago`}</strong>
          </div>
        </div>

        <div className="safety-good">
          <span className="status-dot"></span>
          <span>{mins != null && mins < 180 ? "All Good" : "Waiting for a check-in"}</span>
        </div>

        <button
          type="button"
          className="view-members-btn"
          onClick={() => openModule("safety")}
        >
          <MapPin size={16} />
          Open Safety
        </button>
      </div>
    </div>
  );
}

export default SafetyStatus;
