import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart, Brain, Shield, Users, Mic, Gamepad2, ArrowRight, Globe, Pause, Play } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import heroStill from '../assets/hero-landing.jpg';
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
const CALM_TRACKS = [
  { title: 'Prelude for Piano', artist: 'Quiet piano', query: 'Clair de Lune Debussy', id: '4iV5W9uYEdYUVa79Axb7Rh' },
  { title: 'Sweater Weather', artist: 'The Neighbourhood', id: '2QjOHCTQ1Jl3zawyYOpxh6' },
  { title: 'Something Just Like This', artist: 'The Chainsmokers · Coldplay', id: '6RUKPb4LETWmmr3iAEQktW' },
  { title: 'Perfect', artist: 'Ed Sheeran', id: '0tgVpDi06FyKpA1z0VMD4v' },
  { title: 'Die For You', artist: 'The Weeknd', id: '2LBqCSwhJGcFQeTHMVGwy3' },
];
const DEVO_TRACKS = [
  { title: 'Hanuman Chalisa', artist: 'Shreya Ghoshal', id: '2VnnAlfJ1M2w1G2vwPc4jf' },
  { title: 'Ram Siya Ram', artist: 'Sachet–Parampara', id: '7i7iHu4wAZ3PBiVJgyYhLG' },
  { title: 'Shree Hanuman Chalisa', artist: 'Hariharan', id: '6H7fLdt0AeWpuxUKXuXWrx' },
  { title: 'Om Namah Shivaya', artist: 'Anup Jalota', id: '3ghynhAJ8OOsYf8KpSra4l' },
  { title: 'Hare Krishna Hare Rama', artist: 'Anup Jalota', id: '6CFKYTz3xLv9tJRQcl5s0t' },
];
const FOCUS_TRACKS = [
  { title: 'Something Just Like This', artist: 'The Chainsmokers · Coldplay', id: '6RUKPb4LETWmmr3iAEQktW' },
  { title: 'Believer', artist: 'Imagine Dragons', id: '0pqnGHJpmpxLKifKRmU6WP' },
  { title: 'Eyes Closed', artist: 'Imagine Dragons', id: '4o120XeV8els1S5bu7mzBX' },
  { title: 'Thunder', artist: 'Imagine Dragons', id: '1zB4vmk8tFRmM9UULNzbLB' },
  { title: 'Closer', artist: 'The Chainsmokers · Halsey', id: '7BKLCZ1jbUBVqRi2FVlTVw' },
];
const MUSIC_TABS = [
  { id: 'calm', label: 'Calm' },
  { id: 'devo', label: 'Devotional' },
  { id: 'focus', label: 'Energy' },
];
function tracksFor(tab) {
  if (tab === 'calm') return CALM_TRACKS;
  if (tab === 'focus') return FOCUS_TRACKS;
  return DEVO_TRACKS;
}

const previewCache = new Map();

async function songPreview(track) {
  const q = track.query || `${track.title} ${track.artist}`;
  if (previewCache.has(q)) return previewCache.get(q);
  const urls = [
    `/api/music-preview?q=${encodeURIComponent(q)}`,
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=1&country=IN`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const preview = data.previewUrl || data.results?.[0]?.previewUrl || '';
      if (preview) {
        previewCache.set(q, preview);
        return preview;
      }
    } catch {
      /* try next */
    }
  }
  previewCache.set(q, '');
  return '';
}

/* ─── floating particle ─── */
function Particle({ style }) {
  return <div className="hl-particle" style={style} />;
}

function HomeLanding() {
  const heroRef = useRef(null);
  const audioRef = useRef(null);
  const wantPlay = useRef(true);
  const [visible, setVisible] = useState({});
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicTab, setMusicTab] = useState('devo');
  const [musicOn, setMusicOn] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const { lang } = useI18n();
  const copy = COPY[lang] || COPY.en;
  const flowLang = lang === 'hi' ? 'hi' : 'en';
  const musicTracks = tracksFor(musicTab);
  const currentTrack = musicTracks[Math.min(trackIndex, musicTracks.length - 1)];

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

  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || narrow) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShowFlow(true);
    }, { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, [narrow]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.autoplay = true;
    audio.volume = 0.85;
    audioRef.current = audio;
    const unlock = (event) => {
      if (!wantPlay.current) return;
      if (event?.target?.closest?.('.hl-now-btn, .hl-track-picker, .hl-music-tabs')) return;
      audio.play().then(() => setMusicOn(true)).catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    musicTracks.forEach((track) => {
      songPreview(track);
    });
  }, [musicTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    let cancelled = false;
    const onEnded = () => {
      setTrackIndex((current) => (current + 1) % tracksFor(musicTab).length);
    };
    audio.addEventListener('ended', onEnded);
    (async () => {
      const src = await songPreview(currentTrack);
      if (cancelled || !src) return;
      audio.src = src;
      if (!wantPlay.current) return;
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    })();
    return () => {
      cancelled = true;
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, musicTab]);

  const playTrack = (index, tab = musicTab) => {
    wantPlay.current = true;
    setMusicTab(tab);
    setTrackIndex(index);
    const track = tracksFor(tab)[index];
    const audio = audioRef.current;
    const q = track?.query || `${track?.title || ''} ${track?.artist || ''}`;
    const src = previewCache.get(q);
    if (!audio || !src) return;
    audio.src = src;
    audio.play().then(() => setMusicOn(true)).catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      wantPlay.current = false;
      audio.pause();
      setMusicOn(false);
      return;
    }
    wantPlay.current = true;
    audio.play().then(() => setMusicOn(true)).catch(() => {});
  };

  /* generate random particles */
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
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
      <div className="hl-particles-bg" aria-hidden>
        {!narrow && particles.map((p) => (
          <Particle key={p.key} style={p.style} />
        ))}
      </div>

      {/* ─── NAV ─── */}
      <nav className="hl-nav">
        <div className="hl-nav-brand">
          <img src={logoMark} alt="" className="hl-nav-logo" />
          <div className="hl-nav-text">
            <span className="hl-nav-name">Smriti Saarthi</span>
            <span className="hl-nav-sub">स्मृति सारथी</span>
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
          <div className="hl-music">
            <div className="hl-music-tabs" role="tablist">
              {MUSIC_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={musicTab === tab.id}
                  className={musicTab === tab.id ? 'is-active' : ''}
                  onClick={() => playTrack(0, tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="hl-track-picker" role="list">
              {musicTracks.map((track, index) => (
                <button
                  key={track.id}
                  type="button"
                  className={index === trackIndex ? 'is-active' : ''}
                  onClick={() => playTrack(index)}
                >
                  <span>{track.title}</span>
                  <small>{track.artist}</small>
                </button>
              ))}
            </div>
            <div className="hl-now-playing">
              <button type="button" className="hl-now-btn" onClick={toggleMusic} aria-label={musicOn ? 'Pause music' : 'Play music'}>
                {musicOn ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div>
                <strong>{currentTrack.title}</strong>
                <small>{currentTrack.artist}{musicOn ? ' · playing' : ' · tap anywhere to start'}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="hl-hero-visual">
          {narrow ? (
            <img className="hl-hero-flow hl-hero-still" src={heroStill} alt="Smriti Saathi reminders on a phone" />
          ) : showFlow ? (
            <iframe
              key={flowLang}
              className="hl-hero-flow"
              src={`/hero-flow.html?lang=${flowLang}`}
              title="Smriti Saathi app flow"
              loading="lazy"
            />
          ) : (
            <div className="hl-hero-flow hl-hero-flow-slot" aria-hidden />
          )}
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
            <div className="hl-footer-name">Smriti Saarthi</div>
            <div className="hl-footer-sub">स्मृति सारथी</div>
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
