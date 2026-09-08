import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Brain } from 'lucide-react';
import VoiceAgentCard from '../components/VoiceAgentCard';
import DailyRoutineDashboard from '../components/DailyRoutineDashboard';
import BrainActivity from '../components/BrainActivity';
import Progress from '../components/Progress';
import SafetyStatus from '../components/SafetyStatus';
import CareCircleWidget from '../components/CareCircle';
import MemoryBook from '../components/MemoryBook';
import BottomStatus from '../components/BottomStatus';
import HomeChat from '../components/HomeChat';
import Reveal from '../components/bits/Reveal';
import SpotlightCard from '../components/bits/SpotlightCard';
import ClickSpark from '../components/bits/ClickSpark';
import { useI18n } from '../I18nContext';
import { useAppNav } from '../AppNavContext';
import { homePanesFor } from '../i18n/landingCopy';
import { loadMemoryQuizResult } from '../lib/memoryQuiz';

function Card({ delay, children }) {
  return (
    <Reveal delay={delay}>
      <SpotlightCard className="ss-bit-card">
        {children}
      </SpotlightCard>
    </Reveal>
  );
}

function UserDashboard() {
  const [pane, setPane] = useState('today');
  const { lang } = useI18n();
  const { openMemoryQuiz } = useAppNav();
  const copy = homePanesFor(lang);
  const quiz = loadMemoryQuizResult();
  const panes = [
    { id: 'today', label: copy.today, hint: copy.todayHint },
    { id: 'mind', label: copy.mind, hint: copy.mindHint },
    { id: 'people', label: copy.people, hint: copy.peopleHint },
  ];

  return (
    <ClickSpark className="granth-home ss-home-focus">
      <div className="dashboard ss-home-shell">
        <nav className="ss-focus-bar" role="tablist" aria-label="Home sections">
          {panes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={pane === item.id}
              className={pane === item.id ? 'is-on' : ''}
              onClick={() => setPane(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </nav>
        <div className="ss-home-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={pane}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {pane === 'today' && (
                <div className="top-grid ss-focus-pane">
                  <Card delay={0.02}><VoiceAgentCard /></Card>
                  <Card delay={0.08}><DailyRoutineDashboard /></Card>
                </div>
              )}
              {pane === 'mind' && (
                <div className="middle-grid ss-focus-pane">
                  <Card delay={0.04}><BrainActivity /></Card>
                  <Card delay={0.08}>
                    <section className="ss-quiz-card">
                      <div className="ss-quiz-icon"><Brain size={22} /></div>
                      <div>
                        <h2>{copy.quiz}</h2>
                        <p>{copy.quizHint}</p>
                        {quiz?.score != null && (
                          <small>Last score {quiz.score}</small>
                        )}
                      </div>
                      <button type="button" className="ss-quiz-open" onClick={() => openMemoryQuiz?.()}>
                        {copy.quizOpen}
                      </button>
                    </section>
                  </Card>
                  <Card delay={0.12}><Progress /></Card>
                </div>
              )}
              {pane === 'people' && (
                <div className="bottom-grid ss-focus-pane">
                  <Card delay={0.04}><SafetyStatus /></Card>
                  <Card delay={0.08}><CareCircleWidget /></Card>
                  <Card delay={0.12}><MemoryBook /></Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <BottomStatus />
          <HomeChat />
        </div>
      </div>
    </ClickSpark>
  );
}

export default UserDashboard;
