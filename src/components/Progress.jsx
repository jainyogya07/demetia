import { BarChart3, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { getProgressSnapshot, subscribeLive } from "../lib/liveState";

function Progress() {
  const { openModule } = useAppNav();
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const snap = useMemo(() => getProgressSnapshot(), [tick]);
  const stats = [
    { label: "Activities Completed", value: `${snap.routineDone} / ${snap.routineTotal}` },
    { label: "Plays this week", value: String(snap.activities) },
    { label: "Accuracy", value: `${snap.accuracy}%` },
    { label: "Streak", value: `${snap.streak}d` },
  ];

  return (
    <section className="progress-card">
      <div className="progress-header">
        <div className="progress-title">
          <BarChart3 size={25} />
          <h2>This Week&apos;s Progress</h2>
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
          <strong>Care note</strong>
        </div>
        <p>
          {snap.todayPlays
            ? `A game is logged today. ${snap.routineDone} routine items marked.`
            : "No game logged yet today. A short past story is enough."}
        </p>
        <div className="insight-brain">🌿</div>
      </div>

      <button
        type="button"
        className="view-progress-button"
        onClick={() => openModule("progress")}
      >
        View Detailed Progress →
      </button>
    </section>
  );
}

export default Progress;
