import {
  CalendarDays, Volume2, ChevronRight, CheckCircle2, Circle,
  Play, Brain, ShieldCheck, Phone, MapPin, AlertTriangle,
  BookOpen, CloudOff, RefreshCw, Sparkles, Users,
} from 'lucide-react';
import VoiceAgentCard from '../components/VoiceAgentCard';
import { useAppNav } from '../AppNavContext';
import {
  ROUTINE_ITEMS,
  BRAIN_GAMES,
  WEEK_PROGRESS,
  SAFETY,
  CARE_CIRCLE,
  MEMORY_BOOK,
} from '../data/patientDashboard';

function UserDashboard() {
  const { openModule, openEmergency } = useAppNav();

  return (
    <div className="ss-dash">
      <div className="ss-dash-row ss-dash-row-top">
        <VoiceAgentCard />

        <section className="ss-card ss-glass ss-routine">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <CalendarDays size={18} />
              <h3>Today&apos;s Routine</h3>
            </div>
            <button
              type="button"
              className="ss-ghost-btn"
              onClick={() => openModule('ai', { startVoice: true })}
            >
              <Volume2 size={15} />
              What&apos;s next
            </button>
          </header>
          <ol className="ss-routine-list">
            {ROUTINE_ITEMS.map((item) => (
              <li key={item.id} className={`ss-routine-item ${item.status}`}>
                <span className="ss-routine-time">{item.time}</span>
                <span className="ss-routine-name">{item.title}</span>
                {item.status === 'completed' ? (
                  <span className="ss-pill done">
                    <CheckCircle2 size={13} /> Done
                  </span>
                ) : (
                  <span className="ss-pill pending">
                    <Circle size={12} /> Pending
                  </span>
                )}
              </li>
            ))}
          </ol>
          <button type="button" className="ss-card-link" onClick={() => openModule('routine')}>
            Full routine <ChevronRight size={15} />
          </button>
        </section>
      </div>

      <div className="ss-dash-row ss-dash-row-mid">
        <section className="ss-card ss-glass ss-games">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <Brain size={18} />
              <h3>Games</h3>
            </div>
            <button type="button" className="ss-text-btn" onClick={() => openModule('games')}>
              All games
            </button>
          </header>
          <div className="ss-game-grid">
            {BRAIN_GAMES.map((game) => (
              <article key={game.id} className="ss-game-card">
                <h4>{game.title}</h4>
                <p>{game.meta}</p>
                <button type="button" className="ss-start-btn" onClick={() => openModule(game.moduleId, { gameId: game.gameId })}>
                  Start <Play size={13} fill="currentColor" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="ss-card ss-glass ss-progress">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <Sparkles size={18} />
              <h3>Week</h3>
            </div>
          </header>
          <div className="ss-stat-row">
            <div className="ss-stat">
              <span>Activities</span>
              <strong>{WEEK_PROGRESS.activities}</strong>
            </div>
            <div className="ss-stat">
              <span>Engagement</span>
              <strong>{WEEK_PROGRESS.engagement}</strong>
            </div>
            <div className="ss-stat">
              <span>Memory</span>
              <strong>{WEEK_PROGRESS.memory}</strong>
            </div>
            <div className="ss-stat">
              <span>Attention</span>
              <strong>{WEEK_PROGRESS.attention}</strong>
            </div>
          </div>
          <div className="ss-insight">
            <p className="ss-insight-label">Note</p>
            <p>{WEEK_PROGRESS.insight}</p>
          </div>
          <button type="button" className="ss-card-link" onClick={() => openModule('progress')}>
            Detailed progress <ChevronRight size={15} />
          </button>
        </section>
      </div>

      <div className="ss-dash-row ss-dash-row-bot">
        <section className="ss-card ss-glass ss-safety">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <ShieldCheck size={18} />
              <h3>Safety</h3>
            </div>
          </header>
          <p className="ss-safety-status">
            <CheckCircle2 size={16} />
            <strong>{SAFETY.status}</strong>
          </p>
          <p className="ss-muted">Last check-in: {SAFETY.lastCheckIn}</p>
          <p className="ss-muted">{SAFETY.zone}</p>
          <div className="ss-safety-actions">
            <button type="button" className="ss-mini-btn" onClick={() => openModule('care-circle')}>
              <Phone size={14} /> Call Family
            </button>
            <button type="button" className="ss-mini-btn" onClick={() => openModule('safety')}>
              <MapPin size={14} /> Check Location
            </button>
            <button type="button" className="ss-mini-btn danger" onClick={openEmergency}>
              <AlertTriangle size={14} /> Emergency
            </button>
          </div>
        </section>

        <section className="ss-card ss-glass ss-circle">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <Users size={18} />
              <h3>Care circle</h3>
            </div>
          </header>
          <ul className="ss-circle-list">
            {CARE_CIRCLE.map((person) => (
              <li key={person.id}>
                <div className="ss-avatar-initial">{person.name.charAt(0)}</div>
                <div>
                  <strong>{person.name}</strong>
                  <span> {person.relation} · {person.status}</span>
                </div>
                <button
                  type="button"
                  className="ss-icon-btn"
                  aria-label={`Call ${person.name}`}
                  onClick={() => openModule('care-circle')}
                >
                  <Phone size={15} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="ss-card ss-glass ss-memory">
          <header className="ss-card-head">
            <div className="ss-card-title">
              <BookOpen size={18} />
              <h3>Memory book</h3>
            </div>
          </header>
          <div className="ss-memory-grid">
            {MEMORY_BOOK.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ss-memory-tile"
                onClick={() => openModule('memory-book')}
              >
                {item.title}
              </button>
            ))}
          </div>
          <button type="button" className="ss-full-btn" onClick={() => openModule('memory-book')}>
            Open memory book
          </button>
        </section>
      </div>

      <footer className="ss-dash-footer ss-glass">
        <div className="ss-foot-item">
          <CloudOff size={15} />
          Offline — works now, syncs later
        </div>
        <div className="ss-foot-item">
          <RefreshCw size={15} />
          Last sync: today, 4:20 PM
        </div>
        <div className="ss-foot-help">
          Need help? Talk to Care Agent or call your caregiver.
        </div>
      </footer>
    </div>
  );
}

export default UserDashboard;
