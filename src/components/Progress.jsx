import { BarChart3, Lightbulb } from "lucide-react";

function Progress() {
  const stats = [
    {
      label: "Activities Completed",
      value: "5 / 7"
    },
    {
      label: "Average Engagement",
      value: "↑ 12%"
    },
    {
      label: "Memory Score",
      value: "Stable"
    },
    {
      label: "Attention Level",
      value: "Good"
    }
  ];

  return (
    <section className="progress-card">

      <div className="progress-header">
        <div className="progress-title">
          <BarChart3 size={25} />
          <h2>This Week's Progress</h2>
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
          <strong>Smriti Insight</strong>
        </div>

        <p>
          You are doing great! Your memory game performance is stable
          this week. Keep staying active and happy.
        </p>

        <div className="insight-brain">
          🧠
        </div>

      </div>

      <button className="view-progress-button">
        View Detailed Progress →
      </button>

    </section>
  );
}

export default Progress;