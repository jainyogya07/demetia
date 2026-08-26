import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart, Brain, Shield, Users, Mic, Gamepad2, ArrowRight, Globe } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../I18nContext';
import './HomeLanding.css';

const COPY = {
  en: {
    featuresNav: 'Features',
    dashboardsNav: 'Dashboards',
    signIn: 'Sign in',
    eyebrow: 'Memory companion · North-East India',
    titleBefore: 'A calm voice,',
    titleAccent: 'language of home.',
    titleIn: 'in the',
    lede: 'Smriti Saathi is a gentle companion for elders living with memory change — spoken reminders, brain games, and a quiet view for family and clinic. Built for the languages and rhythms of North-East India.',
    tryDash: 'Try Patient Dashboard',
    seeWhat: 'See what it does',
    featKicker: 'What Smriti Saathi does',
    featTitle: 'Small, calm moments — every day',
    rolesKicker: 'Three views, one family',
    rolesTitle: 'Choose your dashboard',
    open: 'Open',
    footerCopy: 'A memory companion for North-East India.',
    footerLegal: 'Built with care. Not a medical device. Always consult a doctor.',
    features: [
      { title: 'Voice companion', desc: '10+ voices including Assamese, Hindi, and English that read reminders, tell stories, and listen — never a cold notification.' },
      { title: 'Gentle brain games', desc: 'Memory pairs, spot the difference, balloon pop — simple, unhurried, and culturally familiar.' },
      { title: 'Daily care rhythm', desc: 'Medicine, water, meals, exercise — woven into a quiet routine that never overwhelms.' },
      { title: 'Safety & location', desc: 'Gentle geo-fencing and emergency contacts — peace of mind for the family, dignity for the elder.' },
      { title: 'Memory progress', desc: 'Track cognitive patterns over weeks — trends and notes for review, never a test or a diagnosis.' },
      { title: 'Care circle', desc: 'Family, ASHA worker, doctor — everyone sees the same quiet picture, from wherever they are.' },
    ],
    roles: [
      { kicker: 'Patient', title: 'User Dashboard', lead: 'Voice companion, games, routine, and safety — in the language of home.' },
      { kicker: 'Family', title: 'Caregiver View', lead: 'A quiet view of the day: medicines, mood, and when something seems off.' },
      { kicker: 'Clinic', title: 'Doctor Panel', lead: 'Trends and notes for review — support, not a diagnosis.' },
    ],
  },
  hi: {
    featuresNav: 'विशेषताएँ',
    dashboardsNav: 'डैशबोर्ड',
    signIn: 'साइन इन',
    eyebrow: 'स्मृति साथी · पूर्वोत्तर भारत',
    titleBefore: 'एक शांत आवाज़,',
    titleIn: 'घर की',
    titleAccent: 'भाषा में।',
    lede: 'स्मृति साथी स्मृति-परिवर्तन के साथ जी रहे बुज़ुर्गों का धीमा साथी है — बोले गए रिमाइंडर, दिमागी खेल, और परिवार व क्लिनिक के लिए एक शांत नज़र। पूर्वोत्तर भारत की भाषाओं और लय के लिए बना।',
    tryDash: 'रोगी डैशबोर्ड खोलें',
    seeWhat: 'क्या करता है देखें',
    featKicker: 'स्मृति साथी क्या करता है',
    featTitle: 'छोटे, शांत पल — हर दिन',
    rolesKicker: 'तीन नज़रें, एक परिवार',
    rolesTitle: 'अपना डैशबोर्ड चुनें',
    open: 'खोलें',
    footerCopy: 'पूर्वोत्तर भारत के लिए एक स्मृति साथी।',
    footerLegal: 'देखभाल से बना। यह चिकित्सा उपकरण नहीं है। डॉक्टर से सलाह लें।',
    features: [
      { title: 'आवाज़ साथी', desc: 'असमिया, हिंदी और अंग्रेज़ी समेत 10+ आवाज़ें रिमाइंडर पढ़ती हैं, कहानियाँ सुनाती हैं और सुनती हैं।' },
      { title: 'हल्के दिमागी खेल', desc: 'जोड़ी मिलाओ, फ़र्क ढूँढो, गुब्बारा — सरल, बिना जल्दबाज़ी, जाना-पहचाना।' },
      { title: 'रोज़ की लय', desc: 'दवाई, पानी, भोजन, टहलना — एक शांत दिनचर्या में, बिना बोझ के।' },
      { title: 'सुरक्षा और जगह', desc: 'हल्की जियो-फेंसिंग और आपातकालीन संपर्क — परिवार को सुकून, बुज़ुर्ग को सम्मान।' },
      { title: 'स्मृति प्रगति', desc: 'हफ़्तों में पैटर्न देखें — समीक्षा के नोट, परीक्षा या निदान नहीं।' },
      { title: 'देखभाल चक्र', desc: 'परिवार, आशा कार्यकर्ता, डॉक्टर — सब एक ही शांत तस्वीर देखते हैं।' },
    ],
    roles: [
      { kicker: 'रोगी', title: 'यूज़र डैशबोर्ड', lead: 'आवाज़ साथी, खेल, दिनचर्या और सुरक्षा — घर की भाषा में।' },
      { kicker: 'परिवार', title: 'देखभालकर्ता नज़र', lead: 'दिन की शांत तस्वीर: दवाई, मूड, और जब कुछ अलग लगे।' },
      { kicker: 'क्लिनिक', title: 'डॉक्टर पैनल', lead: 'रुझान और नोट — सहयोग, निदान नहीं।' },
    ],
  },
  as: {
    featuresNav: 'বৈশিষ্ট্য',
    dashboardsNav: 'ডেছবোৰ্ড',
    signIn: 'ছাইন ইন',
    eyebrow: 'স্মৃতি সাথী · উত্তৰ-পূব ভাৰত',
    titleBefore: 'এটা শান্ত মাত,',
    titleIn: 'ঘৰৰ',
    titleAccent: 'ভাষাত।',
    lede: 'স্মৃতি সাথী স্মৃতি সলনি হোৱা বয়োজ্যেষ্ঠসকলৰ মৃদু সংগী — কোৱা ৰিমাইণ্ডাৰ, মগজুৰ খেল, আৰু পৰিয়াল আৰু ক্লিনিকৰ বাবে এখন শান্ত দৃশ্য। উত্তৰ-পূব ভাৰতৰ ভাষা আৰু লয়ৰ বাবে নিৰ্মিত।',
    tryDash: 'ৰোগী ডেছবোৰ্ড খোলক',
    seeWhat: 'কি কৰে চাওক',
    featKicker: 'স্মৃতি সাথীয়ে কি কৰে',
    featTitle: 'সৰু, শান্ত মুহূৰ্ত — প্ৰতিদিনে',
    rolesKicker: 'তিনিটা দৃশ্য, এটা পৰিয়াল',
    rolesTitle: 'আপোনাৰ ডেছবোৰ্ড বাছক',
    open: 'খোলক',
    footerCopy: 'উত্তৰ-পূব ভাৰতৰ বাবে এজন স্মৃতি সংগী।',
    footerLegal: 'যতনেৰে নিৰ্মিত। চিকিৎসা সঁজুলি নহয়। চিকিৎসকৰ পৰামৰ্শ লওক।',
    features: [
      { title: 'মাতৰ সংগী', desc: 'অসমীয়া, হিন্দী আৰু ইংৰাজীকে ধৰি ১০+ মাতে ৰিমাইণ্ডাৰ পঢ়ে, কাহিনী কয় আৰু শুনে।' },
      { title: 'কোমল মগজুৰ খেল', desc: 'যোৰ মিলাওক, পাৰ্থক্য বিচাৰক — সৰল, খৰখেদা নোহোৱাকৈ।' },
      { title: 'দৈনিক যতন', desc: 'ঔষধ, পানী, আহাৰ, খোজ — শান্ত দিনচৰ্যাত।' },
      { title: 'সুৰক্ষা আৰু স্থান', desc: 'কোমল জিঅ’-ফেন্সিং আৰু জৰুৰী সম্পৰ্ক।' },
      { title: 'স্মৃতিৰ অগ্ৰগতি', desc: 'সপ্তাহৰ ধৰণ চাওক — পৰ্যালোচনাৰ বাবে, পৰীক্ষা নহয়।' },
      { title: 'যতন চক্ৰ', desc: 'পৰিয়াল, আশা কৰ্মী, চিকিৎসক — একেখন শান্ত ছবি।' },
    ],
    roles: [
      { kicker: 'ৰোগী', title: 'ব্যৱহাৰকাৰী ডেছবোৰ্ড', lead: 'মাত, খেল, দিনচৰ্যা আৰু সুৰক্ষা — ঘৰৰ ভাষাত।' },
      { kicker: 'পৰিয়াল', title: 'যতনকৰ্তা দৃশ্য', lead: 'দিনৰ শান্ত ছবি: ঔষধ, মুড, আৰু যেতিয়া কিবা বেলেগ লাগে।' },
      { kicker: 'ক্লিনিক', title: 'চিকিৎসক পেনেল', lead: 'ধাৰা আৰু টোকা — সহায়, ৰোগ নিৰ্ণয় নহয়।' },
    ],
  },
};

const FEATURE_META = [
  { icon: Mic, color: '#176b58' },
  { icon: Gamepad2, color: '#2a7c6a' },
  { icon: Heart, color: '#c47a6d' },
  { icon: Shield, color: '#6b8fa3' },
  { icon: Brain, color: '#8b6fa3' },
  { icon: Users, color: '#a3886f' },
];

const LANG_CHIPS = ['Assamese', 'Khasi', 'Mizo', 'Manipuri', 'Bodo', 'Hindi', 'English'];

const ROLE_META = [
  { path: '/user', emoji: '🙏', gradient: 'linear-gradient(135deg, #176b58 0%, #2a9d8f 100%)' },
  { path: '/caregiver', emoji: '👨‍👩‍👧', gradient: 'linear-gradient(135deg, #6b8fa3 0%, #82b1c6 100%)' },
  { path: '/doctor', emoji: '🩺', gradient: 'linear-gradient(135deg, #8b6fa3 0%, #a78bc4 100%)' },
];

/* ─── floating particle ─── */
function Particle({ style }) {
  return <div className="hl-particle" style={style} />;
}

function HomeLanding() {
  const heroRef = useRef(null);
  const [visible, setVisible] = useState({});
  const { lang } = useI18n();
  const copy = COPY[lang] || COPY.en;
  const flowLang = lang === 'hi' ? 'hi' : 'en';

  /* intersection observer for scroll-reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => ({ ...v, [e.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.hl-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* generate random particles */
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      key: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 6}px`,
        height: `${4 + Math.random() * 6}px`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 8}s`,
        opacity: 0.15 + Math.random() * 0.25,
      },
    }))
  ).current;

  return (
    <div className="hl">
      {/* ─── floating particles background ─── */}
      <div className="hl-particles-bg" aria-hidden>
        {particles.map((p) => (
          <Particle key={p.key} style={p.style} />
        ))}
      </div>

      {/* ─── NAV ─── */}
      <nav className="hl-nav">
        <div className="hl-nav-brand">
          <img src={logoMark} alt="" className="hl-nav-logo" />
          <div className="hl-nav-text">
            <span className="hl-nav-name">स्मृति साथी</span>
            <span className="hl-nav-sub">Smriti Saathi</span>
          </div>
        </div>
        <div className="hl-nav-actions">
          <a className="hl-nav-link" href="#features">{copy.featuresNav}</a>
          <a className="hl-nav-link" href="#dashboards">{copy.dashboardsNav}</a>
          <LanguageSwitcher />
          <Link className="hl-nav-cta" to="/signin">{copy.signIn}</Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hl-hero" ref={heroRef}>
        <div className="hl-hero-copy">
          <p className="hl-eyebrow">
            <span className="hl-eyebrow-dot" />
            {copy.eyebrow}
          </p>
          <h1 className="hl-title">
            {copy.titleBefore}<br />
            {copy.titleIn} <span className="hl-title-accent">{copy.titleAccent}</span>
          </h1>
          <p className="hl-lede">{copy.lede}</p>
          <div className="hl-hero-actions">
            <Link className="hl-btn-primary" to="/user">
              {copy.tryDash} <ArrowRight size={16} />
            </Link>
            <a className="hl-btn-ghost" href="#features">
              {copy.seeWhat}
            </a>
          </div>
          <div className="hl-lang-ribbon">
            <Globe size={14} />
            {LANG_CHIPS.map((item) => (
              <span key={item} className="hl-lang-chip">{item}</span>
            ))}
          </div>
        </div>
        <div className="hl-hero-visual">
          <iframe
            key={flowLang}
            className="hl-hero-flow"
            src={`/hero-flow.html?lang=${flowLang}`}
            title="Smriti Saathi app flow"
          />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="hl-features hl-reveal" data-vis={visible.features || false}>
        <p className="hl-eyebrow"><span className="hl-eyebrow-dot" />{copy.featKicker}</p>
        <h2 className="hl-section-title">{copy.featTitle}</h2>
        <div className="hl-features-grid">
          {copy.features.map((f, i) => {
            const Icon = FEATURE_META[i].icon;
            return (
              <article
                key={f.title}
                className="hl-feature-card"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <div className="hl-feature-icon" style={{ background: FEATURE_META[i].color }}>
                  <Icon size={20} color="#fff" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── DASHBOARD ROLES ─── */}
      <section id="dashboards" className="hl-dashboards hl-reveal" data-vis={visible.dashboards || false}>
        <p className="hl-eyebrow"><span className="hl-eyebrow-dot" />{copy.rolesKicker}</p>
        <h2 className="hl-section-title">{copy.rolesTitle}</h2>
        <div className="hl-roles-grid">
          {copy.roles.map((role, i) => (
            <Link
              key={ROLE_META[i].path}
              to={ROLE_META[i].path}
              className="hl-role-card"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="hl-role-header" style={{ background: ROLE_META[i].gradient }}>
                <span className="hl-role-emoji">{ROLE_META[i].emoji}</span>
                <span className="hl-role-kicker">{role.kicker}</span>
              </div>
              <div className="hl-role-body">
                <strong>{role.title}</strong>
                <p>{role.lead}</p>
                <span className="hl-role-arrow">
                  {copy.open} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="hl-footer">
        <div className="hl-footer-brand">
          <img src={logoMark} alt="" className="hl-footer-logo" />
          <div>
            <div className="hl-footer-name">स्मृति साथी</div>
            <div className="hl-footer-sub">Smriti Saathi</div>
          </div>
        </div>
        <p className="hl-footer-copy">
          {copy.footerCopy}
          {' '}Assamese · Khasi · Mizo · Manipuri · Bodo · Hindi · English.
        </p>
        <p className="hl-footer-legal">
          {copy.footerLegal}
        </p>
      </footer>
    </div>
  );
}

export default HomeLanding;
