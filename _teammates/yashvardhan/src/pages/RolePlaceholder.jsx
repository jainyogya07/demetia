import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import VoiceToggle from '../components/VoiceToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';

const COPY = {
  caregiver: {
    badge: 'Caregiver',
    title: 'Caregiver dashboard',
    lead: 'This space will show today’s patient summary, medicine status, cognitive trends, and burnout-aware checklists — without 50 graphs.',
    waiting: 'Waiting on your caregiver links and layout. This route is ready so it stays separate from the patient home.',
    items: ['Today’s summary', 'Medication adherence', 'Engagement & mood', 'Alerts if something seems off', 'Caregiver self-care'],
  },
  doctor: {
    badge: 'Doctor',
    title: 'Clinician dashboard',
    lead: 'This space will show longitudinal cognitive trends, session notes, and referral pathways. It will not diagnose dementia — it will support review.',
    waiting: 'Placeholder only. You will explain how to build this page later. The route is already separate from User and Caregiver.',
    items: ['Cognitive trend review', 'Age- and education-adjusted baselines', 'eSanjeevani / NPHCE referral', 'Explainable score changes'],
  },
};

function RolePlaceholder({ role }) {
  const navigate = useNavigate();
  const copy = COPY[role];

  return (
    <div className="app-container ss-theme">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="ss-brand-link">
            <BrandLogo />
          </Link>
          <span className="ss-role-badge">{copy.badge}</span>
        </div>
        <nav className="sidebar-nav">
          {copy.items.map((item) => (
            <span key={item} className="nav-item ss-nav-disabled">
              {item}
            </span>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="ss-emergency-nav" onClick={() => navigate('/user')}>
            <Phone size={18} />
            <div className="help-now-content">
              <span className="help-now-title">Emergency Help</span>
              <span className="help-now-sub">Call for immediate support</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar ss-topbar">
          <div className="ss-greeting-block">
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
          <div className="top-bar-right">
            <VoiceToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <div className="dashboard-scroll">
          <section className="ss-coming-soon">
            <p className="ss-coming-kicker">Coming soon</p>
            <h2>{copy.title} — placeholder</h2>
            <p>{copy.waiting}</p>
            <ul>
              {copy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="ss-full-btn" onClick={() => navigate('/')}>
              Back to home
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default RolePlaceholder;
