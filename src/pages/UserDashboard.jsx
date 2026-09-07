import { useEffect, useState } from 'react';
import VoiceAgentCard from '../components/VoiceAgentCard';
import DailyRoutineDashboard from '../components/DailyRoutineDashboard';
import BrainActivity from '../components/BrainActivity';
import Progress from '../components/Progress';
import SafetyStatus from '../components/SafetyStatus';
import CareCircleWidget from '../components/CareCircle';
import MemoryBook from '../components/MemoryBook';
import BottomStatus from '../components/BottomStatus';
import HomeChat from '../components/HomeChat';
import { useAuth } from '../context/AuthContext';
import { ensureNotifyPermission, getAlarmPrefs, setAlarmPrefs } from '../lib/alarms';
import { AlarmClock } from 'lucide-react';

function UserDashboard() {
  const { session } = useAuth();
  const [prefs, setPrefs] = useState(getAlarmPrefs);

  useEffect(() => {
    setPrefs(getAlarmPrefs());
  }, []);

  const turnOn = async () => {
    await ensureNotifyPermission();
    setPrefs(setAlarmPrefs({ enabled: true, notify: true, sound: true }));
  };

  return (
    <div className="granth-home">
      <div className="dashboard">
        {session?.verified && session.role === 'user' && (
          <section className="ss-alarm-hero" style={{
            marginBottom: 16,
            padding: '16px 18px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #e7f2ee 0%, #fff8f0 100%)',
            border: '1px solid #cfe3db',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AlarmClock size={22} color="#114d40" />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 18, color: '#114d40' }}>Medicine & routine alarms</h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#5c6560', lineHeight: 1.45 }}>
                  First feature for patients: timed reminders with sound and on-screen alert.
                  {session.householdCode ? (
                    <>
                      {' '}Household code <strong>{session.householdCode}</strong> — give this to caregiver and doctor so their dashboards link to you.
                    </>
                  ) : null}
                </p>
                {!prefs.enabled && (
                  <button
                    type="button"
                    onClick={turnOn}
                    style={{
                      marginTop: 10,
                      border: 0,
                      borderRadius: 10,
                      padding: '8px 12px',
                      background: '#114d40',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Enable alarms
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="top-grid">
          <DailyRoutineDashboard />
          <VoiceAgentCard />
        </div>

        <div className="middle-grid">
          <BrainActivity />
          <Progress />
        </div>

        <div className="bottom-grid">
          <SafetyStatus />
          <CareCircleWidget />
          <MemoryBook />
        </div>

        <BottomStatus />
        <HomeChat />
      </div>
    </div>
  );
}

export default UserDashboard;
