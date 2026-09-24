import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Volume2,
  CheckCircle2,
  Circle,
  Sun,
  Droplets,
  Brain,
  Utensils,
  Footprints,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import {
  getRoutineItems,
  markRoutineDone,
  unmarkRoutineDone,
  pingLive,
  subscribeLive,
} from '../lib/liveState';
import './DailyRoutineDashboard.css';

const TIME_ICONS = {
  'med-am': { icon: Sun, periodKey: 'routineCard.morning' },
  water: { icon: Droplets, period: '9:00 am' },
  brain: { icon: Brain, period: '11:00 am' },
  lunch: { icon: Utensils, period: '1:00 pm' },
  walk: { icon: Footprints, period: '4:30 pm' },
  'med-pm': { icon: Moon, period: '8:30 pm' },
};

export default function DailyRoutineDashboard() {
  const { openModule } = useAppNav();
  const { t } = useI18n();
  const [, setTick] = useState(0);
  const [justCompletedId, setJustCompletedId] = useState(null);

  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);

  const routine = getRoutineItems();
  const nextTask = routine.find((item) => !item.completed);
  const completedCount = routine.filter((item) => item.completed).length;

  const taskTitle = (id, fallback) => t(`routineCard.tasks.${id}.title`) || fallback;
  const taskSubtitle = (id, fallback) => t(`routineCard.tasks.${id}.subtitle`) || fallback;

  const tellNext = () => {
    if (!nextTask) {
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(t('routineCard.allDoneSpeech'));
        speech.rate = 0.85;
        window.speechSynthesis.speak(speech);
      }
      return;
    }
    const title = taskTitle(nextTask.id, nextTask.title);
    const text = t('routineCard.nextSpeech', { title, time: nextTask.time });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    }
  };

  const handleToggle = (item) => {
    if (item.completed) {
      unmarkRoutineDone(item.id);
    } else {
      markRoutineDone(item.id);
      setJustCompletedId(item.id);
      setTimeout(() => setJustCompletedId(null), 2500);
    }
    pingLive();
  };

  return (
    <section className="daily-routine-card ss-calm-routine-card">
      <div className="routine-header ss-calm-routine-header">
        <div className="routine-title ss-calm-routine-title">
          <div className="ss-routine-header-icon">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2>{t('routineCard.title')}</h2>
            <p className="ss-routine-sub">
              {completedCount === routine.length
                ? t('routineCard.allQuiet')
                : t('routineCard.stepsTaken', { done: completedCount, total: routine.length })}
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          className="tell-next-button ss-calm-tell-btn"
          onClick={tellNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title={t('routineCard.tellNextTitle')}
        >
          <Volume2 size={16} />
          <span>{t('routineCard.tellNext')}</span>
        </motion.button>
      </div>

      <div className="ss-timeline-stream" role="list">
        {routine.map((item, index) => {
          const isNext = nextTask?.id === item.id;
          const isDone = item.completed;
          const meta = TIME_ICONS[item.id] || { period: item.time };
          const period = meta.periodKey ? t(meta.periodKey) : (meta.period || item.time);
          const justDone = justCompletedId === item.id;
          const title = taskTitle(item.id, item.title);
          const subtitle = isDone
            ? t('routineCard.completedGently')
            : isNext
              ? t('routineCard.approachingNext')
              : taskSubtitle(item.id, item.subtitle);

          return (
            <div
              key={item.id}
              role="listitem"
              className={`ss-timeline-row ${isDone ? 'is-done' : ''} ${isNext ? 'is-next-active' : ''}`}
            >
              <div className="ss-timeline-time-col">
                <span className="ss-timeline-period">{period}</span>
              </div>

              <div className="ss-timeline-spine">
                <button
                  type="button"
                  className={`ss-timeline-dot-btn ${isDone ? 'dot-done' : 'dot-pending'} ${isNext ? 'dot-next-pulse' : ''}`}
                  onClick={() => handleToggle(item)}
                  aria-label={t('routineCard.markAs', {
                    title,
                    state: isDone ? t('routineCard.notDone') : t('routineCard.done'),
                  })}
                >
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.div
                        key="done"
                        initial={{ scale: 0.5, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.5 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        <CheckCircle2 size={20} className="timeline-check-icon" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                      >
                        <Circle size={18} className="timeline-circle-icon" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                {index < routine.length - 1 && <span className="ss-timeline-connector" />}
              </div>

              <div
                className={`ss-timeline-task-bubble ${isDone ? 'bubble-done' : ''} ${isNext ? 'bubble-next' : ''}`}
                onClick={() => handleToggle(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(item); }}
              >
                <div className="ss-task-info">
                  <span className={`ss-task-title ${isDone ? 'text-done' : ''}`}>
                    {title}
                  </span>
                  <span className="ss-task-subtitle">{subtitle}</span>
                </div>

                {justDone && (
                  <motion.span
                    className="ss-celebration-badge"
                    initial={{ opacity: 0, scale: 0.8, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles size={13} /> {t('routineCard.completedBadge')}
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ss-routine-footer">
        <button
          type="button"
          className="view-routine-button ss-calm-view-all"
          onClick={() => {
            pingLive();
            openModule('routine');
          }}
        >
          {t('routineCard.viewFull')}
        </button>
      </div>
    </section>
  );
}
