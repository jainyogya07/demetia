import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import VoiceAgentCard from '../components/VoiceAgentCard';
import DailyRoutineDashboard from '../components/DailyRoutineDashboard';
import ConnectedCareWidget from '../components/ConnectedCareWidget';
import DashboardQuickLinks from '../components/DashboardQuickLinks';
import Reveal from '../components/bits/Reveal';
import SpotlightCard from '../components/bits/SpotlightCard';
import BlurText from '../components/bits/BlurText';
import Magnet from '../components/bits/Magnet';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { useAuth } from '../context/AuthContext';
import { user } from '../data/user';
import '../components/UnifiedDashboard.css';

function greetingChromeKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'chrome.goodMorning';
  if (hour < 17) return 'chrome.goodAfternoon';
  return 'chrome.goodEvening';
}

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
  const { openModule } = useAppNav();
  const { t } = useI18n();
  const { prefs } = usePrefs();
  const { session } = useAuth();

  const displayName = session?.name || prefs.profile.name || user.name;
  const greeting = t(greetingChromeKey());

  const handleQuickNav = (id) => {
    switch (id) {
      case 'memory': openModule('games'); break;
      case 'routine': openModule('routine'); break;
      case 'care': openModule('care-circle'); break;
      case 'safety': openModule('safety'); break;
      case 'progress': openModule('progress'); break;
      default: break;
    }
  };

  return (
    <div className="granth-home ss-home-focus">
      <div className="dashboard ss-home-shell ss-unified-layout">
        <div className="ss-home-main ss-home-transparent">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="unified-dashboard-content"
          >
            <div className="dashboard-row greeting-row">
              <Reveal delay={0.01}>
                <div className="ss-dash-greeting">
                  <BlurText
                    text={`${greeting}, ${displayName}`}
                    className="ss-dash-greet-title"
                    tag="h1"
                    delay={40}
                  />
                  <p className="ss-dash-greet-sub">{t('chrome.calmDaySub')}</p>
                </div>
              </Reveal>
            </div>

            <div className="dashboard-row hero-grid">
              <Card delay={0.06}><VoiceAgentCard /></Card>
              <Card delay={0.1}><DailyRoutineDashboard /></Card>
            </div>

            <div className="dashboard-row quick-links-row">
              <Reveal delay={0.14}>
                <DashboardQuickLinks onNav={handleQuickNav} />
              </Reveal>
            </div>

            <div className="dashboard-row bottom-extras-grid">
              <Card delay={0.18}><ConnectedCareWidget /></Card>

              <Card delay={0.22}>
                <Magnet strength={10} className="todays-tip-magnet">
                  <div className="todays-tip-card">
                    <div className="todays-tip-header">
                      <div className="tip-icon"><Leaf size={18} /></div>
                      <strong>{t('chrome.todaysTip')}</strong>
                    </div>
                    <p>{t('chrome.tipBreath')}</p>
                  </div>
                </Magnet>
              </Card>

              <Card delay={0.26}>
                <button
                  type="button"
                  className="calming-moments-card"
                  onClick={() => openModule('routine')}
                >
                  <div className="calming-moments-thumb">
                    <div className="play-circle">▶</div>
                  </div>
                  <div className="calming-moments-info">
                    <strong>{t('chrome.myDay')}</strong>
                    <span>{t('chrome.myDaySub')}</span>
                  </div>
                  <div className="calming-moments-arrow">›</div>
                </button>
              </Card>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
