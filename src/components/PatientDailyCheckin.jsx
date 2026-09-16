import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Pill, Coffee, Footprints, Sparkles, Smile, Meh, Frown, Clock, Award } from 'lucide-react';
import { getPatientDailyCheckin, savePatientDailyCheckin, subscribeAssessmentChange } from '../lib/assessmentStore';
import { getRoutineItems, markRoutineDone, unmarkRoutineDone, pingLive, subscribeLive } from '../lib/liveState';

export default function PatientDailyCheckin({ patientId = 'aita' }) {
  const [data, setData] = useState(() => getPatientDailyCheckin(patientId));
  const [savedFeedback, setSavedFeedback] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [, setRoutineTick] = useState(0);

  // Subscribe to assessment and routine updates
  useEffect(() => {
    const unsubAssessment = subscribeAssessmentChange((detail) => {
      if (!detail || detail.patientId === patientId) {
        setData(getPatientDailyCheckin(patientId));
      }
    });
    const unsubRoutine = subscribeLive(() => {
      setRoutineTick((n) => n + 1);
      // Synchronize checkin with routine items
      const routine = getRoutineItems();
      const medDone = routine.some((r) => r.type === 'medicine' && r.completed);
      const walkDone = routine.some((r) => r.type === 'walk' && r.completed);
      const mealDone = routine.some((r) => r.type === 'meal' && r.completed);

      setData((prev) => {
        let changed = false;
        const next = { ...prev };
        if (medDone && !next.medsTaken) { next.medsTaken = true; changed = true; }
        if (walkDone && !next.walkDone) { next.walkDone = true; changed = true; }
        if (mealDone && !next.breakfastComfort) { next.breakfastComfort = true; changed = true; }
        if (changed) {
          savePatientDailyCheckin(patientId, next);
          return next;
        }
        return prev;
      });
    });

    return () => {
      unsubAssessment();
      unsubRoutine();
    };
  }, [patientId]);

  const speakFeedback = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      u.lang = 'hi-IN';
      window.speechSynthesis.speak(u);
    }
  };

  const handleToggle = (field) => {
    const nextVal = !data[field];
    const updated = savePatientDailyCheckin(patientId, {
      ...data,
      [field]: nextVal,
      lastActionTime: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    });
    setData(updated);

    // Two-way sync with live routine items
    if (field === 'medsTaken') {
      if (nextVal) {
        markRoutineDone('med-am');
        setSavedFeedback('Dawa mark ho gayi');
        speakFeedback('Dawa lene ke liye shukriya.');
      } else {
        unmarkRoutineDone('med-am');
        setSavedFeedback('Dawa baqi mark ki gayi');
      }
    } else if (field === 'breakfastComfort') {
      if (nextVal) {
        markRoutineDone('lunch');
        setSavedFeedback('Nashta & chai confirm ho gaya');
      } else {
        unmarkRoutineDone('lunch');
        setSavedFeedback('Nashta update ho gaya');
      }
    } else if (field === 'walkDone') {
      if (nextVal) {
        markRoutineDone('walk');
        setSavedFeedback('Aangan walk confirm ho gayi! Bahut badiya');
        speakFeedback('Taazi hawa lena swasthya ke liye bahut accha hai.');
      } else {
        unmarkRoutineDone('walk');
        setSavedFeedback('Walk update ho gayi');
      }
    }

    pingLive();
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }));
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  const handleMood = (mood) => {
    const updated = savePatientDailyCheckin(patientId, {
      ...data,
      moodScore: mood,
      lastActionTime: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    });
    setData(updated);

    const moodLabels = {
      good: 'Khush aur urjawann mehsoos kar rahe hain',
      calm: 'Shant aur aaram se hain',
      tired: 'Thoda thake hue hain — aaram ki zarurat hai',
    };
    setSavedFeedback(`Mizaaj darj: ${moodLabels[mood] || mood}`);
    if (mood === 'good') speakFeedback('Aapka mizaaj accha hai, yeh jaan kar khushi hui.');
    else if (mood === 'tired') speakFeedback('Kripya thoda aaram karein aur paani piyein.');

    pingLive();
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }));
    setTimeout(() => setSavedFeedback(''), 3000);
  };

  const completedCount = useMemo(() => {
    let count = 0;
    if (data.medsTaken) count += 1;
    if (data.breakfastComfort) count += 1;
    if (data.walkDone) count += 1;
    if (data.moodScore) count += 1;
    return count;
  }, [data]);

  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div
      className="patient-checkin-card ss-card"
      style={{
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--border-subtle, #e1e4e8)',
        borderRadius: 16,
        padding: '20px 24px',
        marginTop: 20,
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #fbefff 0%, #ede2fe 100%)',
              color: '#8250df',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(130, 80, 223, 0.15)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#1f2937' }}>
                Aaj Ka Haal-Chaala (Daily Check-in)
              </h3>
              <span
                style={{
                  background: progressPercent === 100 ? '#dafbe1' : '#f0fdf4',
                  color: progressPercent === 100 ? '#1a7f37' : '#166534',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  border: '1px solid rgba(22, 101, 52, 0.15)',
                }}
              >
                {completedCount}/4 Completed ({progressPercent}%)
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Simple 4 questions for your morning routine. Touch to confirm and sync with your schedule.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> {lastUpdated}
          </span>
          {savedFeedback && (
            <span
              style={{
                fontSize: '0.82rem',
                color: '#15803d',
                background: '#dcfce7',
                padding: '4px 10px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 600,
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <CheckCircle2 size={15} /> {savedFeedback}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Mini Progress bar */}
      <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            borderRadius: 999,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {/* Q1: Medicine */}
        <button
          type="button"
          onClick={() => handleToggle('medsTaken')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            borderRadius: 12,
            border: `1.5px solid ${data.medsTaken ? '#34d399' : '#e2e8f0'}`,
            background: data.medsTaken ? '#f0fdf4' : '#ffffff',
            color: data.medsTaken ? '#065f46' : '#1e293b',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: data.medsTaken ? '0 2px 8px rgba(16, 185, 129, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: data.medsTaken ? '#d1fae5' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Pill size={22} color={data.medsTaken ? '#059669' : '#64748b'} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.96rem', fontWeight: 600 }}>Dawa Li?</strong>
            <span style={{ fontSize: '0.82rem', color: data.medsTaken ? '#047857' : '#64748b' }}>
              {data.medsTaken ? 'Haan, subah le li' : 'Baqi hai'}
            </span>
          </div>
        </button>

        {/* Q2: Tea & Breakfast */}
        <button
          type="button"
          onClick={() => handleToggle('breakfastComfort')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            borderRadius: 12,
            border: `1.5px solid ${data.breakfastComfort ? '#34d399' : '#e2e8f0'}`,
            background: data.breakfastComfort ? '#f0fdf4' : '#ffffff',
            color: data.breakfastComfort ? '#065f46' : '#1e293b',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: data.breakfastComfort ? '0 2px 8px rgba(16, 185, 129, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: data.breakfastComfort ? '#d1fae5' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Coffee size={22} color={data.breakfastComfort ? '#059669' : '#64748b'} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.96rem', fontWeight: 600 }}>Chai &amp; Nashta?</strong>
            <span style={{ fontSize: '0.82rem', color: data.breakfastComfort ? '#047857' : '#64748b' }}>
              {data.breakfastComfort ? 'Ho gaya aaram se' : 'Abhi nahi'}
            </span>
          </div>
        </button>

        {/* Q3: Walking / Movement */}
        <button
          type="button"
          onClick={() => handleToggle('walkDone')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            borderRadius: 12,
            border: `1.5px solid ${data.walkDone ? '#34d399' : '#e2e8f0'}`,
            background: data.walkDone ? '#f0fdf4' : '#ffffff',
            color: data.walkDone ? '#065f46' : '#1e293b',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: data.walkDone ? '0 2px 8px rgba(16, 185, 129, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: data.walkDone ? '#d1fae5' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Footprints size={22} color={data.walkDone ? '#059669' : '#64748b'} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.96rem', fontWeight: 600 }}>Aangan Mein Tehle?</strong>
            <span style={{ fontSize: '0.82rem', color: data.walkDone ? '#047857' : '#64748b' }}>
              {data.walkDone ? 'Haan, taazi hawa li' : 'Abhi walk nahi ki'}
            </span>
          </div>
        </button>

        {/* Q4: Mood Selection */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ marginRight: 8 }}>
            <strong style={{ display: 'block', fontSize: '0.92rem', fontWeight: 600, color: '#1e293b' }}>Mizaaj / Mood</strong>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {data.moodScore ? (data.moodScore === 'good' ? 'Khush' : data.moodScore === 'calm' ? 'Shant' : 'Thoda thake') : 'Kaisa lag raha hai?'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'good', icon: Smile, color: '#10b981', label: 'Good' },
              { id: 'calm', icon: Meh, color: '#0284c7', label: 'Calm' },
              { id: 'tired', icon: Frown, color: '#f43f5e', label: 'Tired' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                title={m.label}
                onClick={() => handleMood(m.id)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: data.moodScore === m.id ? `2px solid ${m.color}` : '1.5px solid #e2e8f0',
                  background: data.moodScore === m.id ? `${m.color}15` : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: data.moodScore === m.id ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              >
                <m.icon size={20} color={m.color} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
