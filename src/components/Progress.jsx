import { BarChart3, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { useLanguage } from "../context/LanguageContext";
import { getProgressSnapshot, subscribeLive } from "../lib/liveState";

function Progress() {
  const { openModule } = useAppNav();
  const { t } = useLanguage();
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const snap = useMemo(() => getProgressSnapshot(), [tick]);
  const stats = [
    { label: t("activitiesCompleted"), value: `${snap.routineDone} / ${snap.routineTotal}` },
    { label: t("playsThisWeek"), value: String(snap.activities) },
    { label: t("accuracyLabel"), value: `${snap.accuracy}%` },
    { label: t("streakLabel"), value: `${snap.streak}d` },
  ];

  return (
    <section className="progress-card">
      <div className="progress-header">
        <div className="progress-title">
          <BarChart3 size={25} />
          <h2>{t("weeklyProgress")}</h2>
        </div>
      </div>

      <div className="progress-stats">
        {stats.map((stat) => (
          <div className="stat-box" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="smriti-insight">
        <div className="insight-heading">
          <Lightbulb size={18} />
          <strong>{t("smritiInsight")}</strong>
        </div>
        <p>
          {snap.todayPlays ? t("insightHasPlay") : t("insightNoPlay")}
        </p>
        <div className="insight-brain">🌿</div>
      </div>

      <button
        type="button"
        className="view-progress-button"
        onClick={() => openModule("progress")}
      >
        {t("viewDetailedProgress")}
      </button>
    </section>
  );
}

export default Progress;
