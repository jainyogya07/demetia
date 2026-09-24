import { CalendarDays, Volume2, CheckCircle2, Circle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function DailyRoutine() {
  const {t} = useLanguage();
  const routine = [
    {
      time: "7:30 AM",
      task: "Morning Medicine",
      status: "Completed"
    },
    {
      time: "9:00 AM",
      task: "Drink Water",
      status: "Completed"
    },
    {
      time: "1:00 PM",
      task: "Lunch Time",
      status: "Pending"
    },
    {
      time: "4:00 PM",
      task: "Brain Activity",
      status: "Pending"
    },
    {
      time: "7:00 PM",
      task: "Evening Walk",
      status: "Pending"
    },
    {
      time: "8:30 PM",
      task: "Night Medicine",
      status: "Pending"
    }
  ];

  const tellNext = () => {
    const nextTask = routine.find(
      (item) => item.status === "Pending"
    );

    if (!nextTask) return;

    const text = `Your next activity is ${nextTask.task} at ${nextTask.time}`;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.85;

      window.speechSynthesis.speak(speech);
    } else {
      alert(text);
    }
  };

  return (
    <section className="daily-routine-card">

      <div className="routine-header">

        <div className="routine-title">
          <CalendarDays size={25} />

          <h2>{t("todaysRoutine")}</h2>
        </div>

        <button
          className="tell-next-button"
          onClick={tellNext}
        >
          <Volume2 size={17} />
          {t("tellMeNext")}
        </button>

      </div>

      <div className="routine-list">

        {routine.map((item, index) => (
          <div
            className="routine-row"
            key={item.task}
          >

            <span className="routine-time">
              {item.time}
            </span>

            <div className="routine-timeline">
              <span
                className={`timeline-dot ${
                  item.status === "Completed"
                    ? "completed-dot"
                    : "pending-dot"
                }`}
              ></span>

              {index !== routine.length - 1 && (
                <span className="timeline-line"></span>
              )}
            </div>

            {item.status === "Completed" ? (
              <CheckCircle2
                size={18}
                className="completed-icon"
              />
            ) : (
              <Circle
                size={18}
                className="pending-icon"
              />
            )}

            <span className="routine-task">
              {item.task}
            </span>

            <span
              className={`routine-status ${
                item.status === "Completed"
                  ? "completed"
                  : "pending"
              }`}
            >
              {item.status}
            </span>

          </div>
        ))}

      </div>

      <button className="view-routine-button">
        {t("viewFullRoutine")}
      </button>

    </section>
  );
}

export default DailyRoutine;