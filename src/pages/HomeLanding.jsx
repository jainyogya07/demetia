import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import heroPortrait from '../assets/hero.png';

const ROLES = [
  {
    path: '/user',
    kicker: 'Patient',
    title: 'User',
    lead: 'Voice companion, games, routine, and safety — in the language of home.',
  },
  {
    path: '/caregiver',
    kicker: 'Family',
    title: 'Caregiver',
    lead: 'A quiet view of the day: medicines, mood, and when something seems off.',
  },
  {
    path: '/doctor',
    kicker: 'Clinic',
    title: 'Doctor',
    lead: 'Trends and notes for review — support, not a diagnosis.',
  },
];

function HomeLanding() {
  return (
    <div className="ss-home">
      <header className="ss-home-nav">
        <BrandLogo />
        <div className="ss-home-nav-actions">
          <Link className="ss-home-ghost" to="/signin">Sign in</Link>
          <a className="ss-home-ghost" href="#care">How it helps</a>
        </div>
      </header>

      <section className="ss-home-hero">
        <div className="ss-home-copy ss-home-fade">
          <p className="ss-home-eyebrow">Memory companion · North-East India</p>
          <h1>A calm voice, in the language of home.</h1>
          <p className="ss-home-lede">
            Smriti Saathi is a professional companion for elders and the people who care for them —
            spoken reminders, gentle games, and a quiet view for family and clinic.
          </p>
        </div>
        <div className="ss-home-stage" id="voice">
          <img className="ss-home-hero-img" src={heroPortrait} alt="" />
        </div>
      </section>

      <section className="ss-home-roles ss-home-slide" aria-label="Open a dashboard">
        {ROLES.map((role) => (
          <Link key={role.path} to={role.path} className="ss-home-role">
            <span>{role.kicker}</span>
            <strong>{role.title}</strong>
            <em>{role.lead}</em>
          </Link>
        ))}
      </section>

      <section id="care" className="ss-home-care">
        <p className="ss-home-eyebrow">How it helps</p>
        <h2>Small, calm moments — every day</h2>
        <div className="ss-home-grid">
          <article>
            <h3>Past stories</h3>
            <p>A remembered scene that pauses for a question, then continues — never a test.</p>
          </article>
          <article>
            <h3>Spoken reminders</h3>
            <p>Medicine, water, meals — a warm voice, not a silent alert.</p>
          </article>
          <article>
            <h3>Family close</h3>
            <p>Caregivers and clinicians can look in without crowding the elder.</p>
          </article>
        </div>
      </section>

      <footer className="ss-home-foot">
        <p>Assamese · Khasi · Mizo · Manipuri · Bodo · Hindi · English</p>
      </footer>
    </div>
  );
}

export default HomeLanding;
