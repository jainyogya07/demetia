import {
  Brain,
  TrendingUp,
  CalendarDays,
  Target,
  CheckCircle2,
  Clock3,
  Award,
  Lightbulb,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { getProgressSnapshot, subscribeLive } from "../lib/liveState";
import { loadMemoryQuizResult } from "../lib/memoryQuiz";
import "./MemoryProgress.css";

const MemoryProgress = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const snap = useMemo(() => getProgressSnapshot(), [tick]);
  const quiz = useMemo(() => loadMemoryQuizResult(), [tick]);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return dayNames[d.getDay()];
  });

  const skills = [
    {
      name: "Memory",
      score: Math.min(92, snap.overall + 2),
      change: snap.todayPlays ? `+${snap.todayPlays * 3}%` : "today",
      type: "memory",
    },
    {
      name: "Attention",
      score: 72,
      change: "+5%",
      type: "attention",
    },
    {
      name: "Pattern Recognition",
      score: 84,
      change: "+11%",
      type: "pattern",
    },
    {
      name: "Recall",
      score: 69,
      change: "+4%",
      type: "recall",
    },
  ];

  const activities = [
    {
      name: "Remember the Picture",
      category: "Memory",
      score: "82%",
      date: "Today",
      difficulty: "Easy",
    },
    {
      name: "Find the Pattern",
      category: "Pattern Recognition",
      score: "88%",
      date: "Yesterday",
      difficulty: "Medium",
    },
    {
      name: "Remember the Names",
      category: "Recall",
      score: "74%",
      date: "23 Aug",
      difficulty: "Easy",
    },
    {
      name: "Focus & Match",
      category: "Attention",
      score: "79%",
      date: "22 Aug",
      difficulty: "Medium",
    },
  ];

  return (
    <div className="memory-progress-page">

      {/* HEADER */}
      <div className="memory-progress-header">
        <div>
          <div className="memory-progress-label">
            <Brain size={15} />
            COGNITIVE WELLNESS
          </div>

          <h1>Memory Progress</h1>

          <p>
            Track memory, attention and cognitive activities over time.
          </p>
        </div>

        <div className="progress-period">
          <CalendarDays size={17} />
          This Week
        </div>
      </div>

      {quiz && (
        <div className="overview-card" style={{ marginBottom: 18 }}>
          <div className="overview-icon">
            <Brain size={23} />
          </div>
          <div>
            <p>Today’s memory check</p>
            <h2>{quiz.percentage ?? Math.round(((quiz.score || 0) / (quiz.totalQuestions || 1)) * 100)}%</h2>
            <span>{quiz.score}/{quiz.totalQuestions} · not a diagnosis</span>
          </div>
        </div>
      )}


      {/* OVERVIEW CARDS */}
      <div className="progress-overview">

        <div className="overview-card main-score-card">
          <div className="overview-icon">
            <Brain size={23} />
          </div>

          <div>
            <p>Overall Progress</p>
            <h2>{snap.overall}%</h2>

            <span className="positive-change">
              <TrendingUp size={14} />
              {snap.todayPlays} play{snap.todayPlays === 1 ? "" : "s"} today
            </span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon green">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <p>Activities Completed</p>
            <h2>{snap.activities}</h2>
            <span>of {snap.planned} planned this week</span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon orange">
            <Target size={23} />
          </div>

          <div>
            <p>Accuracy</p>
            <h2>{snap.accuracy}%</h2>
            <span>Across logged plays</span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon purple">
            <Award size={23} />
          </div>

          <div>
            <p>Current Streak</p>
            <h2>{snap.streak} Days</h2>
            <span>Routine or a game</span>
          </div>
        </div>

      </div>


      {/* MAIN GRID */}
      <div className="memory-progress-grid">

        {/* LEFT */}
        <div className="progress-main-column">

          {/* WEEKLY TREND */}
          <div className="progress-card weekly-card">

            <div className="progress-card-header">
              <div>
                <h2>Weekly Cognitive Progress</h2>
                <p>Your activity performance over the past 7 days</p>
              </div>

              <div className="trend-badge">
                <TrendingUp size={15} />
                Improving
              </div>
            </div>


            <div className="chart-area">

              <div className="chart-y-axis">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="chart-content">

                <div className="chart-lines">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <div className="chart-bars">
                  {snap.weekBars.map((height, i) => (
                    <div className={`chart-day ${i === 6 ? "today" : ""}`} key={labels[i]}>
                      <div className="bar-wrapper">
                        <div className="chart-bar" style={{ height: `${height}%` }} />
                      </div>
                      <span>{labels[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* COGNITIVE SKILLS */}
          <div className="progress-card skills-card">

            <div className="progress-card-header">
              <div>
                <h2>Cognitive Skills</h2>
                <p>Current performance by activity type</p>
              </div>
            </div>

            <div className="skills-list">

              {skills.map((skill) => (
                <div className="skill-row" key={skill.name}>

                  <div className="skill-name">
                    <span>{skill.name}</span>

                    <strong>{skill.score}%</strong>
                  </div>

                  <div className="skill-progress">
                    <div
                      className={`skill-fill ${skill.type}`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>

                  <span className="skill-change">
                    {skill.change}
                  </span>

                </div>
              ))}

            </div>
          </div>


          {/* RECENT ACTIVITIES */}
          <div className="progress-card activities-card">

            <div className="progress-card-header">
              <div>
                <h2>Recent Activities</h2>
                <p>Your latest cognitive exercises</p>
              </div>
            </div>

            <div className="activities-table">

              <div className="activity-table-header">
                <span>Activity</span>
                <span>Category</span>
                <span>Score</span>
                <span>Date</span>
                <span>Level</span>
              </div>

              {(snap.recent.length ? snap.recent : activities).map((activity, index) => (
                <div
                  className="activity-table-row"
                  key={activity.id || index}
                >
                  <strong>{activity.title || activity.name}</strong>

                  <span>{activity.category}</span>

                  <strong className="activity-score">
                    {activity.score != null ? `${activity.score}${String(activity.score).includes("%") ? "" : "%"}` : "—"}
                  </strong>

                  <span>{activity.at ? new Date(activity.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : activity.date}</span>

                  <span className="difficulty">
                    {activity.difficulty || "Played"}
                  </span>
                </div>
              ))}

            </div>
          </div>

        </div>


        {/* RIGHT COLUMN */}
        <div className="progress-side-column">

          {/* INSIGHT */}
          <div className="insight-card">

            <div className="insight-icon">
              <Lightbulb size={23} />
            </div>

            <p className="insight-label">
              CARE NOTE
            </p>

            <h2>{snap.todayPlays ? "A game is on the book today" : "A quiet day so far"}</h2>

            <p className="insight-text">
              {snap.routineDone} routine items marked. This is a household log — not a diagnosis.
            </p>

            <div className="insight-tip">
              <strong>Today's suggestion</strong>

              <span>
                Try a short memory activity when you feel relaxed
                and comfortable.
              </span>
            </div>

          </div>


          {/* TODAY'S GOAL */}
          <div className="goal-card">

            <div className="goal-header">
              <div>
                <p>DAILY GOAL</p>
                <h2>3 Activities</h2>
              </div>

              <Target size={23} />
            </div>

            <div className="goal-progress">

              <div className="goal-progress-track">
                <div className="goal-progress-fill" />
              </div>

              <strong>{Math.min(3, snap.todayPlays)} / 3</strong>

            </div>

            <span className="goal-message">
              One more activity to complete today's goal.
            </span>

          </div>


          {/* STREAK */}
          <div className="streak-card">

            <div className="streak-icon">
              <Award size={23} />
            </div>

            <p>MEMORY STREAK</p>

            <h2>{snap.streak} Days</h2>

            <span>
              Days in a row with a marked routine item or a game.
            </span>

          </div>


          {/* CAREGIVER NOTE */}
          <div className="caregiver-card">

            <div className="caregiver-title">
              <Clock3 size={18} />
              Caregiver View
            </div>

            <p>
              Performance data can help family members and
              health workers understand activity patterns over time.
            </p>

            <button>
              View Activity Summary
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MemoryProgress;