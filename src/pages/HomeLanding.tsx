// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Brain, Shield, Users, Mic, Gamepad2, ArrowRight, Globe, Pause, Play, Download } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../I18nContext';
import { AppNavContext } from '../AppNavContext';
import UserDashboard from './UserDashboard';
import Aurora from '../components/bits/Aurora';
import BlurText from '../components/bits/BlurText';
import SpotlightCard from '../components/bits/SpotlightCard';
import Particles from '../components/bits/Particles';
import Magnet from '../components/bits/Magnet';
import Reveal from '../components/bits/Reveal';
import { useRegionScenery } from '../hooks/useRegionScenery';
import { useSceneryCrossfade } from '../hooks/useSceneryCrossfade';
import { landingCopyFor } from '../i18n/landingCopy';
import { apiRequest } from '../lib/apiClient';
import './HomeLanding.css';

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
];
const DEVO_TRACKS = [
  { title: 'Hanuman Chalisa', artist: 'Shreya Ghoshal', id: '2VnnAlfJ1M2w1G2vwPc4jf' },
  { title: 'Ram Siya Ram', artist: 'Sachet–Parampara', id: '7i7iHu4wAZ3PBiVJgyYhLG' },
];
const FOCUS_TRACKS = [
  { title: 'Something Just Like This', artist: 'The Chainsmokers · Coldplay', id: '6RUKPb4LETWmmr3iAEQktW' },
  { title: 'Believer', artist: 'Imagine Dragons', id: '0pqnGHJpmpxLKifKRmU6WP' },
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
  const local = await apiRequest(`/api/music-preview?q=${encodeURIComponent(q)}`);
  const preview = local?.previewUrl || '';
  if (preview) {
    previewCache.set(q, preview);
    return preview;
  }
  previewCache.set(q, '');
  return '';
}

function HomeLanding() {
  const heroRef = useRef<any>(null);
  const audioRef = useRef<any>(null);
  const wantPlay = useRef(false);
  const navigate = useNavigate();
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicTab, setMusicTab] = useState('calm');
  const [musicOn, setMusicOn] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [stage, setStage] = useState('day');
  const [installPrompt, setInstallPrompt] = useState<unknown>(null);
  const [appInstalled, setAppInstalled] = useState(false);
  const { lang } = useI18n();
  const { src: scenerySrc, key: sceneryKey } = useRegionScenery();
  const {
    base: baseScene,
    overlay: overlayScene,
    overlayOn,
    commitOverlay: commitSceneOverlay,
  } = useSceneryCrossfade(scenerySrc, sceneryKey);
  const copy = landingCopyFor(lang);
  const flowLang = lang === 'hi' ? 'hi' : 'en';
  const musicTracks = tracksFor(musicTab);
  const currentTrack = musicTracks[Math.min(trackIndex, musicTracks.length - 1)];

  const previewNav = useMemo(() => ({
    openModule: () => navigate('/user'),
    serviceFocus: null,
    aiIntent: null,
    gameIntent: null,
    openEmergency: () => navigate('/user'),
    currentModuleId: 'home',
    openAssist: () => navigate('/user'),
    openMemoryQuiz: () => navigate('/user'),
    setActiveGameId: () => {},
    activeGameId: null,
  }), [navigate]);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    setAppInstalled(standalone);
    const onPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setAppInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice.catch(() => null);
      if (choice?.outcome === 'accepted') setAppInstalled(true);
      setInstallPrompt(null);
      return;
    }
    window.alert(copy.installHint);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.playsInline = true;
    audio.autoplay = false;
    audio.volume = 0.7;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onEnded = () => {
      setTrackIndex((current) => (current + 1) % tracksFor(musicTab).length);
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [musicTab]);

  const playTrack = (index, tab = musicTab) => {
    wantPlay.current = true;
    setMusicTab(tab);
    setTrackIndex(index);
    const track = tracksFor(tab)[index];
    const audio = audioRef.current;
    if (!audio || !track) return;
    songPreview(track).then((src) => {
      if (!src || !wantPlay.current) return;
      audio.src = src;
      audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    });
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
    playTrack(trackIndex, musicTab);
  };

  const tabs = [
    { id: 'day', label: copy.tabDay },
    { id: 'does', label: copy.tabDoes },
    { id: 'music', label: copy.tabMusic },
  ];

  return (
    <div className="hl">
      <div className="hl-scene" aria-hidden>
        <img
          src={baseScene.src}
          alt=""
          className="hl-scene-img is-base"
        />
        {overlayScene ? (
          <img
            src={overlayScene.src}
            alt=""
            className={`hl-scene-img is-overlay${overlayOn ? ' is-visible' : ''}`}
            onTransitionEnd={commitSceneOverlay}
          />
        ) : null}
        <div className="hl-scene-scrim" />
      </div>
      {!narrow && (
        <div className="hl-aurora" aria-hidden>
          <Aurora colorStops={['#176b58', '#2a9d8f', '#d7ebe4']} amplitude={0.55} blend={0.45} lightMode speed={0.4} />
          <Particles particleCount={48} particleSpread={11} speed={0.1} />
        </div>
      )}

      <nav className="hl-nav">
        <div className="hl-nav-brand">
          <img src={logoMark} alt="" className="hl-nav-logo" />
          <div className="hl-nav-text">
            <span className="hl-nav-name">Smriti Saarthi</span>
            <span className="hl-nav-sub">स्मृति सारथी</span>
          </div>
        </div>
        <div className="hl-nav-actions">
          <a className="hl-nav-link" href="#roles">Family · Clinic</a>
          <a className="hl-nav-link" href="#stage">{copy.dashboardsNav}</a>
          <LanguageSwitcher />
          <Link className="hl-nav-cta" to="/signin">{copy.signIn}</Link>
        </div>
      </nav>

      <section className="hl-hero" ref={heroRef}>
        <div className="hl-hero-copy hl-glass-panel">
          <p className="hl-eyebrow">
            <span className="hl-eyebrow-dot" />
            {copy.eyebrow}
          </p>
          <BlurText text={copy.title} className="hl-title" tag="h1" delay={70} />
          <p className="hl-lede">{copy.lede}</p>
          <div className="hl-hero-actions">
            <Magnet>
              <Link className="hl-btn-primary" to="/user">
                {copy.tryDash} <ArrowRight size={16} />
              </Link>
            </Magnet>
            {!appInstalled && (
              <button type="button" className="hl-btn-ghost" onClick={installApp}>
                <Download size={16} /> {copy.installApp}
              </button>
            )}
            <Link className="hl-btn-ghost" to="/keypad">{copy.keypad}</Link>
          </div>
          {/* DEMO_VIDEO_SLOT: user will add later */}
          <div className="hl-guide">
            <p className="hl-eyebrow"><span className="hl-eyebrow-dot" />{copy.howKicker}</p>
            <strong>{copy.howTitle}</strong>
            <ol>
              {copy.howSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="hl-guide-keypad">{copy.keypadHow}</p>
          </div>
          <div className="hl-lang-ribbon">
            <Globe size={14} />
            {LANG_CHIPS.map((item) => (
              <span key={item} className="hl-lang-chip">{item}</span>
            ))}
          </div>
        </div>
        <div className="hl-hero-roles" id="roles">
          {copy.roles.map((role, i) => {
            const meta = ROLE_META[i];
            if (!meta) return null;
            return (
              <Reveal key={role.title} delay={0.08 + i * 0.06}>
                <SpotlightCard className="hl-role-card hl-role-card-front">
                  <Link to={meta.path} className="hl-role-wide-link">
                    <div className="hl-role-header" style={{ background: meta.gradient }}>
                      <span className="hl-role-emoji">{meta.emoji}</span>
                      <span className="hl-role-kicker">{role.kicker}</span>
                    </div>
                    <div className="hl-role-body">
                      <strong>{role.title}</strong>
                      <p>{role.lead}</p>
                      <p className="hl-role-how">
                        {i === 0 ? copy.howTitle : i === 1 ? copy.familyHow : copy.clinicHow}
                      </p>
                      <span className="hl-role-arrow">{copy.open} <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <section className="hl-flow-band" aria-label={copy.flowCaption}>
          <p className="hl-eyebrow"><span className="hl-eyebrow-dot" />{copy.flowCaption}</p>
          <iframe
            key={flowLang}
            className="hl-hero-flow hl-hero-flow-below"
            src={`/hero-flow.html?lang=${flowLang}`}
            title="Smriti Saathi app flow"
          />
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section id="stage" className="hl-stage">
          <div className="hl-stage-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={stage === tab.id}
                className={stage === tab.id ? 'is-on' : ''}
                onClick={() => setStage(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {stage === 'day' && (
            <div className="hl-stage-panel">
              <div className="hl-dash-toolbar">
                <p>{copy.lede}</p>
                <Link className="hl-btn-primary" to="/user">{copy.tryDash} <ArrowRight size={16} /></Link>
              </div>
              <div className="hl-dash-preview ss-theme">
                <AppNavContext.Provider value={previewNav}>
                  <UserDashboard />
                </AppNavContext.Provider>
              </div>
            </div>
          )}

          {stage === 'does' && (
            <div className="hl-stage-panel hl-does-grid">
              {copy.features.map((f, i) => {
                const Icon = FEATURE_META[i].icon;
                return (
                  <Reveal key={f.title} delay={0.04 * i}>
                    <SpotlightCard className="hl-feature-card">
                      <div className="hl-feature-icon" style={{ background: FEATURE_META[i].color }}>
                        <Icon size={20} color="#fff" />
                      </div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>
          )}

          {stage === 'music' && (
            <div className="hl-stage-panel hl-music-stage">
              <div className="hl-music hl-music-quiet">
                <p className="hl-music-off-note">{copy.musicHint}</p>
                <div className="hl-music-tabs" role="tablist">
                  {MUSIC_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={musicTab === tab.id}
                      className={musicTab === tab.id ? 'is-active' : ''}
                      onClick={() => { setMusicTab(tab.id); setTrackIndex(0); }}
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
                    <small>{currentTrack.artist}{musicOn ? ' · playing' : ' · off'}</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </Reveal>

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
        <p className="hl-footer-legal">{copy.footerLegal}</p>
      </footer>
    </div>
  );
}

export default HomeLanding;
