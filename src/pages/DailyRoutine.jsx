import { useMemo, useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Pill,
  Droplets,
  Brain,
  Footprints,
  Utensils,
  Clock3,
  Check,
} from 'lucide-react';
import { getRoutineItems, markRoutineDone, pingLive, subscribeLive } from '../lib/liveState';
import { enqueueOutbox } from '../lib/offlineStore';
import PatientDailyCheckin from '../components/PatientDailyCheckin';
import './DailyRoutine.css';

const ICONS = {
  medicine: <Pill size={20} />,
  water: <Droplets size={20} />,
  brain: <Brain size={20} />,
  meal: <Utensils size={20} />,
  walk: <Footprints size={20} />,
};

const DailyRoutine = () => {
  const [tick, setTick] = useState(0);
  const schedule = useMemo(() => getRoutineItems(), [tick]);
  const completed = schedule.filter((item) => item.completed).length;
  const next = schedule.find((item) => !item.completed);
  const pct = Math.round((completed / schedule.length) * 100);

  const complete = (id) => {
    markRoutineDone(id);
    enqueueOutbox('ack', { task: id, phone: 'local' });
    pingLive();
    setTick((n) => n + 1);
  };

  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);

  useEffect(() => {
    const onControl = (event) => {
      const itemId = event.detail?.itemId;
      if (itemId) complete(itemId);
    };
    window.addEventListener('sarthi:routine-control', onControl);
    return () => window.removeEventListener('sarthi:routine-control', onControl);
  }, []);

  return (
    <div className="daily-routine-page">
      <div className="routine-header">
        <div>
          <div className="routine-label">
            <CalendarDays size={15} />
            TODAY&apos;S SCHEDULE
          </div>
          <h1>Daily Routine</h1>
          <p>Times follow this house clock. Mark what is done — morning items stay due until you confirm them.</p>
        </div>
      </div>

      <div className="routine-stats">
        <div className="routine-stat">
          <div className="stat-icon"><CheckCircle2 size={22} /></div>
          <div>
            <p>Completed Today</p>
            <h3>{completed} / {schedule.length}</h3>
          </div>
        </div>
        <div className="routine-stat">
          <div className="stat-icon time-icon"><Clock3 size={22} /></div>
          <div>
            <p>Next Activity</p>
            <h3>{next ? next.time : 'Done'}</h3>
          </div>
        </div>
        <div className="routine-stat">
          <div className="stat-icon"><Brain size={22} /></div>
          <div>
            <p>Today&apos;s Progress</p>
            <h3>{pct}% Complete</h3>
          </div>
        </div>
      </div>

      <div className="routine-content-grid">
        <div className="schedule-card">
          <div className="card-heading">
            <div>
              <h2>Today&apos;s Schedule</h2>
              <p>Due items wait until you mark them. Upcoming items stay quiet.</p>
            </div>
          </div>
          <div className="schedule-list">
            {schedule.map((item, index) => (
              <div className="schedule-item" key={item.id}>
                <div className="schedule-time">{item.time}</div>
                <div className="timeline-line">
                  {item.completed ? (
                    <CheckCircle2 size={20} className="timeline-icon completed" />
                  ) : (
                    <Circle size={20} className="timeline-icon pending" />
                  )}
                  {index !== schedule.length - 1 && <div className="line" />}
                </div>
                <div className="schedule-info">
                  <div className={`activity-icon ${item.type}`}>{ICONS[item.type]}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.status === 'due' ? 'Due now' : item.subtitle}</p>
                  </div>
                </div>
                <div className="schedule-status">
                  {item.completed ? (
                    <span className="completed-text">Completed</span>
                  ) : (
                    <button type="button" className="mark-btn" onClick={() => complete(item.id)}>
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="routine-sidebar">
          <div className="up-next-card">
            <div className="up-next-top"><Clock3 size={14} /> UP NEXT</div>
            <div className="up-next-icon">{next ? ICONS[next.type] : <Check size={28} />}</div>
            <h2>{next ? next.title : 'All done for now'}</h2>
            <p>{next ? next.subtitle : 'A quiet remainder of the day.'}</p>
            {next && <h3>{next.time}</h3>}
            {next && (
              <button type="button" onClick={() => complete(next.id)}>
                <Check size={17} />
                Mark Complete
              </button>
            )}
          </div>

          <div className="reminders-card">
            <div className="card-heading">
              <div>
                <h2>Still open</h2>
                <p>Not marked yet</p>
              </div>
            </div>
            {schedule.filter((item) => !item.completed).slice(0, 3).map((item) => (
              <div className="reminder-item" key={item.id}>
                <div className={`reminder-icon ${item.type}`}>{ICONS[item.type]}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.time} · {item.status === 'due' ? 'due' : 'later'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="wellness-card">
            <p>DAILY WELLNESS</p>
            <h3>{pct >= 70 ? 'A steady day' : 'One thing at a time'}</h3>
            <span>No score of a person — only what this household finished.</span>
            <div className="wellness-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <strong>{pct}%</strong>
            </div>
          </div>
        </div>
      </div>
      <PatientDailyCheckin patientId="aita" />
    </div>
  );
};

export default DailyRoutine;
