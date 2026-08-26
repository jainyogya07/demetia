import { CalendarDays, Volume2, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { getRoutineItems, pingLive, subscribeLive } from "../lib/liveState";

function DailyRoutine() {
  const { openModule } = useAppNav();
  const [, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const routine = getRoutineItems();

  const tellNext = () => {
    const nextTask = routine.find((item) => !item.completed);
    if (!nextTask) return;
    const text = `Your next activity is ${nextTask.title} at ${nextTask.time}`;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <section className="daily-routine-card">
      <div className="routine-header">
        <div className="routine-title">
          <CalendarDays size={25} />
          <h2>Today&apos;s Routine</h2>
        </div>
        <button type="button" className="tell-next-button" onClick={tellNext}>
          <Volume2 size={17} />
          Tell me what&apos;s next
        </button>
      </div>

      <div className="routine-list">
        {routine.map((item, index) => (
          <div className="routine-row" key={item.id}>
            <span className="routine-time">{item.time}</span>
            <div className="routine-timeline">
              <span className={`timeline-dot ${item.completed ? "completed-dot" : "pending-dot"}`} />
              {index !== routine.length - 1 && <span className="timeline-line" />}
            </div>
            {item.completed ? (
              <CheckCircle2 size={18} className="completed-icon" />
            ) : (
              <Circle size={18} className="pending-icon" />
            )}
            <span className="routine-task">{item.title}</span>
            <span className={`routine-status ${item.completed ? "completed" : "pending"}`}>
              {item.completed ? "Completed" : item.status === "due" ? "Due" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="view-routine-button"
        onClick={() => {
          pingLive();
          openModule("routine");
        }}
      >
        View Full Routine →
      </button>
    </section>
  );
}

export default DailyRoutine;
