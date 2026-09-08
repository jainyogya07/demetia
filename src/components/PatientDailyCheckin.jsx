import { useState, useEffect } from 'react';
import { CheckCircle2, Pill, Coffee, Footprints, Sparkles, Smile, Meh, Frown } from 'lucide-react';
import { getPatientDailyCheckin, savePatientDailyCheckin, subscribeAssessmentChange } from '../lib/assessmentStore';

export default function PatientDailyCheckin({ patientId = 'aita' }) {
  const [data, setData] = useState(() => getPatientDailyCheckin(patientId));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return subscribeAssessmentChange((detail) => {
      if (!detail || detail.patientId === patientId) {
        setData(getPatientDailyCheckin(patientId));
      }
    });
  }, [patientId]);

  const handleToggle = (field) => {
    const updated = savePatientDailyCheckin(patientId, {
      ...data,
      [field]: !data[field],
    });
    setData(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMood = (mood) => {
    const updated = savePatientDailyCheckin(patientId, {
      ...data,
      moodScore: mood,
    });
    setData(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="patient-checkin-card"
      style={{
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--border-subtle, #e1e4e8)',
        borderRadius: 14,
        padding: '18px 20px',
        marginTop: 16,
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fbefff',
              color: '#8250df',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Aaj Ka Haal-Chaala (Daily Check-in)
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#57606a' }}>
              Simple 4 questions for your morning routine. Touch to confirm.
            </p>
          </div>
        </div>
        {saved && (
          <span style={{ fontSize: '0.82rem', color: '#1a7f37', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {/* Q1: Medicine */}
        <button
          type="button"
          onClick={() => handleToggle('medsTaken')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            borderRadius: 10,
            border: `1.5px solid ${data.medsTaken ? '#4ac26b' : '#d0d7de'}`,
            background: data.medsTaken ? '#dafbe1' : '#f6f8fa',
            color: data.medsTaken ? '#1a7f37' : '#24292f',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Pill size={22} color={data.medsTaken ? '#1a7f37' : '#57606a'} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Dawa Li?</strong>
            <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
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
            gap: 12,
            padding: '12px 14px',
            borderRadius: 10,
            border: `1.5px solid ${data.breakfastComfort ? '#4ac26b' : '#d0d7de'}`,
            background: data.breakfastComfort ? '#dafbe1' : '#f6f8fa',
            color: data.breakfastComfort ? '#1a7f37' : '#24292f',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Coffee size={22} color={data.breakfastComfort ? '#1a7f37' : '#57606a'} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Chai & Nashta?</strong>
            <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
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
            gap: 12,
            padding: '12px 14px',
            borderRadius: 10,
            border: `1.5px solid ${data.walkDone ? '#4ac26b' : '#d0d7de'}`,
            background: data.walkDone ? '#dafbe1' : '#f6f8fa',
            color: data.walkDone ? '#1a7f37' : '#24292f',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Footprints size={22} color={data.walkDone ? '#1a7f37' : '#57606a'} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Aangan Mein Tehle?</strong>
            <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
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
            padding: '10px 14px',
            borderRadius: 10,
            border: '1.5px solid #d0d7de',
            background: '#f6f8fa',
          }}
        >
          <div style={{ marginRight: 8 }}>
            <strong style={{ display: 'block', fontSize: '0.88rem' }}>Mizaaj / Mood</strong>
            <span style={{ fontSize: '0.75rem', color: '#57606a' }}>Kaisa lag raha hai?</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'good', icon: Smile, color: '#1a7f37' },
              { id: 'calm', icon: Meh, color: '#0969da' },
              { id: 'tired', icon: Frown, color: '#cf222e' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMood(m.id)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: data.moodScore === m.id ? `2px solid ${m.color}` : '1px solid #d0d7de',
                  background: data.moodScore === m.id ? '#ffffff' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <m.icon size={18} color={m.color} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
