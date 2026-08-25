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

import "./MemoryProgress.css";

const MemoryProgress = () => {
  const skills = [
    {
      name: "Memory",
      score: 78,
      change: "+8%",
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


      {/* OVERVIEW CARDS */}
      <div className="progress-overview">

        <div className="overview-card main-score-card">
          <div className="overview-icon">
            <Brain size={23} />
          </div>

          <div>
            <p>Overall Progress</p>
            <h2>76%</h2>

            <span className="positive-change">
              <TrendingUp size={14} />
              7% from last week
            </span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon green">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <p>Activities Completed</p>
            <h2>18</h2>
            <span>of 21 planned</span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon orange">
            <Target size={23} />
          </div>

          <div>
            <p>Accuracy</p>
            <h2>81%</h2>
            <span>Across all activities</span>
          </div>
        </div>


        <div className="overview-card">
          <div className="overview-icon purple">
            <Award size={23} />
          </div>

          <div>
            <p>Current Streak</p>
            <h2>6 Days</h2>
            <span>Keep going!</span>
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

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "48%" }} />
                    </div>
                    <span>Mon</span>
                  </div>

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "58%" }} />
                    </div>
                    <span>Tue</span>
                  </div>

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "63%" }} />
                    </div>
                    <span>Wed</span>
                  </div>

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "69%" }} />
                    </div>
                    <span>Thu</span>
                  </div>

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "74%" }} />
                    </div>
                    <span>Fri</span>
                  </div>

                  <div className="chart-day">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "71%" }} />
                    </div>
                    <span>Sat</span>
                  </div>

                  <div className="chart-day today">
                    <div className="bar-wrapper">
                      <div className="chart-bar" style={{ height: "82%" }} />
                    </div>
                    <span>Sun</span>
                  </div>

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

              {activities.map((activity, index) => (
                <div
                  className="activity-table-row"
                  key={index}
                >
                  <strong>{activity.name}</strong>

                  <span>{activity.category}</span>

                  <strong className="activity-score">
                    {activity.score}
                  </strong>

                  <span>{activity.date}</span>

                  <span className="difficulty">
                    {activity.difficulty}
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
              AI WELLNESS INSIGHT
            </p>

            <h2>You're making steady progress</h2>

            <p className="insight-text">
              Your recent activities show consistent performance
              across memory and pattern-recognition exercises.
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

              <strong>2 / 3</strong>

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

            <h2>6 Days</h2>

            <span>
              You have practiced your cognitive activities
              for 6 days in a row.
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