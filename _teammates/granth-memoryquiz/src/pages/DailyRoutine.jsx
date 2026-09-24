import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Pill,
  Droplets,
  Brain,
  Footprints,
  Utensils,
  Clock3,
  MoreHorizontal,
  Check,
  BellRing,
} from "lucide-react";

import "./DailyRoutine.css";

const DailyRoutine = () => {
  const schedule = [
    {
      time: "7:30 AM",
      title: "Morning Medicine",
      subtitle: "Take your prescribed medicine",
      type: "medicine",
      completed: true,
      icon: <Pill size={20} />,
    },
    {
      time: "9:00 AM",
      title: "Drink Water",
      subtitle: "Stay hydrated",
      type: "water",
      completed: true,
      icon: <Droplets size={20} />,
    },
    {
      time: "11:00 AM",
      title: "Brain Activity",
      subtitle: "Complete today's memory activity",
      type: "brain",
      completed: false,
      icon: <Brain size={20} />,
    },
    {
      time: "1:00 PM",
      title: "Lunch Time",
      subtitle: "Have a healthy meal",
      type: "meal",
      completed: false,
      icon: <Utensils size={20} />,
    },
    {
      time: "4:30 PM",
      title: "Evening Walk",
      subtitle: "Take a short walk outside",
      type: "walk",
      completed: false,
      icon: <Footprints size={20} />,
    },
    {
      time: "8:30 PM",
      title: "Night Medicine",
      subtitle: "Take your night medicine",
      type: "medicine",
      completed: false,
      icon: <Pill size={20} />,
    },
  ];

  return (
    <div className="daily-routine-page">

      {/* HEADER */}
      <div className="routine-header">
        <div>
          <div className="routine-label">
            <CalendarDays size={15} />
            TODAY'S SCHEDULE
          </div>

          <h1>Daily Routine</h1>

          <p>
            Stay healthy, active and on track with your daily activities.
          </p>
        </div>

        <button className="add-routine-btn">
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* STATS */}
      <div className="routine-stats">

        <div className="routine-stat">
          <div className="stat-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Completed Today</p>
            <h3>2 / 6</h3>
          </div>
        </div>

        <div className="routine-stat">
          <div className="stat-icon time-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <p>Next Activity</p>
            <h3>11:00 AM</h3>
          </div>
        </div>

        <div className="routine-stat">
          <div className="stat-icon">
            <Brain size={22} />
          </div>

          <div>
            <p>Today's Progress</p>
            <h3>33% Complete</h3>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="routine-content-grid">

        {/* LEFT: SCHEDULE */}
        <div className="schedule-card">

          <div className="card-heading">
            <div>
              <h2>Today's Schedule</h2>
              <p>Your activities planned for today</p>
            </div>

            <button className="more-btn">
              <MoreHorizontal size={22} />
            </button>
          </div>

          <div className="schedule-list">
            {schedule.map((item, index) => (
              <div className="schedule-item" key={index}>

                <div className="schedule-time">
                  {item.time}
                </div>

                <div className="timeline-line">
                  {item.completed ? (
                    <CheckCircle2
                      size={20}
                      className="timeline-icon completed"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="timeline-icon pending"
                    />
                  )}

                  {index !== schedule.length - 1 && (
                    <div className="line"></div>
                  )}
                </div>

                <div className="schedule-info">
                  <div className={`activity-icon ${item.type}`}>
                    {item.icon}
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>

                <div className="schedule-status">
                  {item.completed ? (
                    <span className="completed-text">Completed</span>
                  ) : (
                    <button className="mark-btn">
                      Mark Complete
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="routine-sidebar">

          {/* UP NEXT */}
          <div className="up-next-card">
            <div className="up-next-top">
              <Clock3 size={14} />
              UP NEXT
            </div>

            <div className="up-next-icon">
              <Brain size={28} />
            </div>

            <h2>Brain Activity</h2>

            <p>
              Complete today's memory exercise and keep your mind active.
            </p>

            <h3>11:00 AM</h3>

            <button>
              <Check size={17} />
              Mark Complete
            </button>
          </div>

          {/* REMINDERS */}
          <div className="reminders-card">

            <div className="card-heading">
              <div>
                <h2>Today's Reminders</h2>
                <p>Don't forget these activities</p>
              </div>
            </div>

            <div className="reminder-item">
              <div className="reminder-icon medicine">
                <Pill size={18} />
              </div>

              <div>
                <h4>Night Medicine</h4>
                <p>Take medicine at 8:30 PM</p>
              </div>
            </div>

            <div className="reminder-item">
              <div className="reminder-icon water">
                <Droplets size={18} />
              </div>

              <div>
                <h4>Stay Hydrated</h4>
                <p>Remember to drink water</p>
              </div>
            </div>

            <div className="reminder-item">
              <div className="reminder-icon brain">
                <Brain size={18} />
              </div>

              <div>
                <h4>Brain Exercise</h4>
                <p>Complete today's activity</p>
              </div>
            </div>

          </div>

          {/* WELLNESS */}
          <div className="wellness-card">
            <p>DAILY WELLNESS</p>

            <h3>You're doing great!</h3>

            <span>
              Keep following your routine for a healthy day.
            </span>

            <div className="wellness-progress">
              <div className="progress-track">
                <div className="progress-fill"></div>
              </div>

              <strong>33%</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyRoutine;