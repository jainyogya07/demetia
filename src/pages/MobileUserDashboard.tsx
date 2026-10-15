import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Calendar,
  Sparkles,
  Puzzle,
  MapPin,
  Users,
  LineChart,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Heart,
  Activity,
  PhoneCall,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Wind,
  Smile,
  X,
  Check,
  Radio,
  Image as ImageIcon
} from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import companionPortrait from '../assets/infinity_pfp.jpg';
import daughterPhoto from '../assets/person-daughter.jpg';
import doctorPhoto from '../assets/person-doctor.jpg';
import gardenPhoto from '../assets/scene-garden.jpg';
import './MobileUserDashboard.css';

interface MobileUserDashboardProps {
  summary?: any;
  greeting: string;
  displayName: string;
}

interface RoutineItem {
  id: number;
  time: string;
  nameHi: string;
  nameEn: string;
  done: boolean;
}

export default function MobileUserDashboard({ summary, greeting, displayName }: MobileUserDashboardProps) {
  const { openModule, openEmergency, openAssist, openMemoryQuiz } = useAppNav();
  const { t, lang } = useI18n();

  // 1. Interactive Routine State
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: 1, time: '08:30 AM', nameHi: 'सुबह का नाश्ता व दवा', nameEn: 'Breakfast & Morning Pills', done: true },
    { id: 2, time: '10:30 AM', nameHi: 'बगीचे में सैर व ताज़ी हवा', nameEn: 'Garden Walk & Fresh Air', done: false },
    { id: 3, time: '01:00 PM', nameHi: 'दोपहर का भोजन व विश्राम', nameEn: 'Lunch & Rest', done: false },
    { id: 4, time: '05:00 PM', nameHi: 'शाम की चाय व संगीत', nameEn: 'Evening Tea & Music', done: false },
  ]);

  const toggleRoutine = (id: number) => {
    setRoutines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = routines.filter((r) => r.done).length;

  // 2. Interactive Mind & Breathing Coach State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const breathTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isBreathing) {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      return;
    }

    const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
    const durations = { inhale: 4, hold: 4, exhale: 6 };
    let currentIdx = 0;
    let secondsLeft = durations.inhale;

    setBreathPhase('inhale');
    setBreathCountdown(durations.inhale);

    breathTimerRef.current = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        currentIdx = (currentIdx + 1) % phases.length;
        const nextPhase = phases[currentIdx];
        setBreathPhase(nextPhase);
        secondsLeft = durations[nextPhase];
      }
      setBreathCountdown(secondsLeft);
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isBreathing]);

  // 3. Audio Narration for Nostalgic Memory
  const [isNarrating, setIsNarrating] = useState(false);

  const memoryStoryHi = 'यह तस्वीर 1984 की है जब पूरा परिवार शिमला के सेब के बगीचे में घूमने गया था। आरती बहुत छोटी थी और उसने लाल सेब देखकर खूब हँसी थी।';
  const memoryStoryEn = 'This memory is from 1984 when the whole family visited the Shimla apple orchards. Aarti was little and laughed joyfully seeing the bright red apples.';

  const toggleMemoryAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = lang === 'hi' ? memoryStoryHi : memoryStoryEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.92;

    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  // 4. Quick Family Call Sheet State
  const [callTarget, setCallTarget] = useState<any>(null);

  const familyContacts = [
    {
      id: 'daughter',
      name: lang === 'hi' ? 'आरती (बेटी)' : 'Aarti (Daughter)',
      role: lang === 'hi' ? 'मुख्य देखभालकर्ता' : 'Primary Caregiver',
      photo: daughterPhoto,
      status: lang === 'hi' ? 'सक्रिय' : 'Available',
      phone: '+91 98765 43210',
    },
    {
      id: 'doctor',
      name: lang === 'hi' ? 'डॉ. आनंद' : 'Dr. Anand',
      role: lang === 'hi' ? 'न्यूरोलॉजिस्ट' : 'Neurologist',
      photo: doctorPhoto,
      status: lang === 'hi' ? 'क्लीनिक 10 AM' : 'Clinic 10 AM',
      phone: '+91 98111 22334',
    },
    {
      id: 'companion',
      name: lang === 'hi' ? 'सारथी AI' : 'Saarthi AI',
      role: lang === 'hi' ? '24×7 साथी' : '24×7 Companion',
      photo: companionPortrait,
      status: lang === 'hi' ? 'लाइव आवाज़' : 'Live Voice',
      isAi: true,
    },
  ];

  // Clean formatted date in current language
  const todayDateString = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const prompts = [
    { id: 'tea', label: lang === 'hi' ? 'मेरी सुबह की चाय' : 'My morning tea', icon: '☕', query: 'Tell me about morning tea and routine' },
    { id: 'walk', label: lang === 'hi' ? 'सुबह की सैर' : 'Morning walk', icon: '🚶‍♂️', query: 'Is it good weather for a walk today?' },
    { id: 'memory', label: lang === 'hi' ? 'पुरानी याद' : 'Past story', icon: '📖', query: 'Tell me a comforting family memory' },
    { id: 'music', label: lang === 'hi' ? 'शांत संगीत' : 'Calm music', icon: '🎵', query: 'Play some soothing peaceful music' },
  ];

  return (
    <motion.div
      className="mobile-dashboard-root"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. HERO GREETING & CALM STATUS */}
      <motion.section className="mob-card mob-hero-greeting" variants={itemVariants}>
        <div className="mob-greet-header">
          <span className="mob-date-badge">
            <Calendar size={12} />
            {todayDateString}
          </span>
          <span className="mob-serene-chip">
            <span className="mob-serene-dot" />
            {lang === 'hi' ? 'शांत वातावरण' : 'Calm & Serene'}
          </span>
        </div>
        <h1 className="mob-greet-title">
          {greeting}, {displayName}
        </h1>
        <p className="mob-greet-sub">
          {summary?.safety?.copy || (lang === 'hi' ? 'घर का वातावरण शांत और सुरक्षित है। आज का दिन सुखद बीतेगा।' : 'Home environment is peaceful and safe. Have a restful day.')}
        </p>
      </motion.section>

      {/* 2. QUICK FAMILY CONNECT (1-TAP PHOTO DIALING) */}
      <motion.section className="mob-card mob-family-section" variants={itemVariants}>
        <div className="mob-section-title-row">
          <span className="mob-section-title-label">
            <Heart size={14} className="text-rose-500" />
            {lang === 'hi' ? 'अपनों से बात करें' : 'Family & Caregivers'}
          </span>
          <span className="mob-family-sub-hint">
            {lang === 'hi' ? '1-टैप कॉल' : '1-Tap Call'}
          </span>
        </div>
        <div className="mob-family-bubbles-row">
          {familyContacts.map((contact) => (
            <motion.button
              key={contact.id}
              type="button"
              className="mob-family-bubble-btn"
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (contact.isAi) {
                  openModule('ai', { startVoice: true });
                } else {
                  setCallTarget(contact);
                }
              }}
            >
              <div className="mob-family-avatar-wrap">
                <img src={contact.photo} alt={contact.name} className="mob-family-avatar-img" />
                <span className="mob-family-online-ring" />
              </div>
              <span className="mob-family-bubble-name">{contact.name.split(' ')[0]}</span>
              <span className="mob-family-bubble-role">{contact.role.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* 3. VOICE COMPANION HERO CARD (APPLE-AURA WITH LIVE AUDIO SOUNDWAVES) */}
      <motion.section className="mob-card mob-voice-card" variants={itemVariants}>
        <div className="mob-voice-header">
          <div className="mob-orb-wrapper">
            <div className="mob-orb-halo" />
            <img src={companionPortrait} alt="Saarthi" className="mob-orb-img" />
          </div>
          <div className="mob-voice-title-box">
            <span className="mob-voice-kicker">
              {lang === 'hi' ? 'AI सारथी साथी' : 'AI Companion'}
            </span>
            <h2 className="mob-voice-headline">
              {lang === 'hi' ? 'आज मैं आपकी क्या मदद करूँ?' : 'How may I assist you today?'}
            </h2>
          </div>
        </div>

        {/* Big Tap to Speak Capsule Button */}
        <motion.button
          type="button"
          className="mob-speak-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openModule('ai', { startVoice: true })}
        >
          <div className="mob-speak-btn-left">
            <div className="mob-mic-icon-circle">
              <Mic size={20} color="#ffffff" />
            </div>
            <div className="mob-speak-btn-text">
              <span className="mob-speak-btn-main">
                {lang === 'hi' ? 'बोलने के लिए यहाँ दबाएँ' : 'Tap to Speak'}
              </span>
              <span className="mob-speak-btn-sub">
                {lang === 'hi' ? 'अपनी भाषा में जो मन हो कहें' : 'Speak naturally in your language'}
              </span>
            </div>
          </div>
          <div className="mob-soundwaves" aria-hidden="true">
            <span className="mob-wave-bar" />
            <span className="mob-wave-bar" />
            <span className="mob-wave-bar" />
            <span className="mob-wave-bar" />
            <span className="mob-wave-bar" />
          </div>
        </motion.button>

        {/* Quick Suggestion Chips */}
        <span className="mob-prompts-label">
          {lang === 'hi' ? 'या तुरंत पूछें:' : 'Or tap a quick question:'}
        </span>
        <div className="mob-prompts-grid">
          {prompts.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              className="mob-prompt-chip"
              whileTap={{ scale: 0.95 }}
              onClick={() => openModule('ai', { startVoice: false, initialQuery: p.query })}
            >
              <span className="mob-prompt-chip-icon">{p.icon}</span>
              <span>{p.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* 4. PEACE & CALM BREATHING ORB (शांति चक्र • MINDFULNESS WIDGET) */}
      <motion.section className="mob-card mob-breathing-card" variants={itemVariants}>
        <div className="mob-breathing-header">
          <div className="mob-breathing-title-box">
            <span className="mob-breathing-tag">
              <Wind size={13} />
              {lang === 'hi' ? 'मन की शांति' : 'Peaceful Mind'}
            </span>
            <h3 className="mob-breathing-headline">
              {lang === 'hi' ? '4-7-8 शांत साँस अभ्यास' : '4-7-8 Guided Breathing'}
            </h3>
          </div>
          <motion.button
            type="button"
            className={`mob-breathing-toggle-btn ${isBreathing ? 'is-active' : ''}`}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsBreathing((v) => !v)}
          >
            {isBreathing ? (
              <>
                <Pause size={14} />
                {lang === 'hi' ? 'रोकें' : 'Pause'}
              </>
            ) : (
              <>
                <Play size={14} />
                {lang === 'hi' ? 'शुरू करें' : 'Start'}
              </>
            )}
          </motion.button>
        </div>

        <div className="mob-breathing-center">
          <div className={`mob-breath-sphere ${isBreathing ? `phase-${breathPhase}` : ''}`}>
            <span className="mob-breath-text-phase">
              {!isBreathing
                ? (lang === 'hi' ? 'शुरू दबाएँ' : 'Tap Start')
                : breathPhase === 'inhale'
                  ? (lang === 'hi' ? 'साँस अंदर...' : 'Inhale...')
                  : breathPhase === 'hold'
                    ? (lang === 'hi' ? 'रोकें...' : 'Hold...')
                    : (lang === 'hi' ? 'साँस छोड़ें...' : 'Exhale...')}
            </span>
            {isBreathing && (
              <span className="mob-breath-seconds">{breathCountdown}s</span>
            )}
          </div>
          <p className="mob-breath-advice">
            {lang === 'hi'
              ? 'गहरी सांस लेने से रक्तचाप नियंत्रित रहता है और मन शांत होता है।'
              : 'Deep breathing naturally eases anxiety and promotes sound rest.'}
          </p>
        </div>
      </motion.section>

      {/* 5. INTERACTIVE ROUTINE TIMELINE WITH CELEBRATION */}
      <motion.section className="mob-card mob-routine-card" variants={itemVariants}>
        <div className="mob-section-title">
          <div className="mob-routine-title-left">
            <span>{lang === 'hi' ? 'आज की दिनचर्या' : "Today's Schedule"}</span>
            <span className="mob-routine-progress-pill">
              {completedCount}/{routines.length} {lang === 'hi' ? 'पूर्ण' : 'Done'}
            </span>
          </div>
          <button
            type="button"
            className="mob-section-link"
            onClick={() => openModule('routine')}
          >
            {lang === 'hi' ? 'पूरी सूची →' : 'View all →'}
          </button>
        </div>

        <div className="mob-routine-list">
          {routines.map((item) => (
            <motion.div
              key={item.id}
              className={`mob-routine-item ${item.done ? 'is-completed' : ''}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleRoutine(item.id)}
            >
              <span className="mob-routine-time">{item.time}</span>
              <div className="mob-routine-content">
                <strong className="mob-routine-name">
                  {lang === 'hi' ? item.nameHi : item.nameEn}
                </strong>
                <span className="mob-routine-state">
                  {item.done
                    ? (lang === 'hi' ? '✓ पूरा हुआ' : '✓ Completed')
                    : (lang === 'hi' ? 'टैप करके पूरा करें' : 'Tap to mark done')}
                </span>
              </div>
              <button
                type="button"
                className={`mob-routine-checkbox ${item.done ? 'is-checked' : ''}`}
                aria-label="Toggle routine done"
              >
                {item.done ? <Check size={14} /> : <div className="mob-checkbox-dot" />}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 6. DAILY NOSTALGIC MEMORY (REMINISCENCE THERAPY) */}
      <motion.section className="mob-card mob-nostalgia-card" variants={itemVariants}>
        <div className="mob-nostalgia-top">
          <span className="mob-nostalgia-kicker">
            <Sparkles size={12} />
            {lang === 'hi' ? 'आज की प्यारी याद' : 'Memory of the Day'}
          </span>
          <motion.button
            type="button"
            className={`mob-listen-memory-btn ${isNarrating ? 'is-speaking' : ''}`}
            whileTap={{ scale: 0.92 }}
            onClick={toggleMemoryAudio}
            aria-label="Listen to memory"
          >
            {isNarrating ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isNarrating ? (lang === 'hi' ? 'बंद करें' : 'Stop') : (lang === 'hi' ? 'याद सुनें' : 'Listen')}</span>
          </motion.button>
        </div>

        <div className="mob-nostalgia-body">
          <div className="mob-nostalgia-thumb-wrap">
            <img src={gardenPhoto} alt="Family Memory" className="mob-nostalgia-img" />
            <span className="mob-nostalgia-year-tag">1984</span>
          </div>
          <div className="mob-nostalgia-copy">
            <h4 className="mob-nostalgia-headline">
              {lang === 'hi' ? 'शिमला की सैर • सेब का बगीचा' : 'Shimla Trip • Apple Orchard'}
            </h4>
            <p className="mob-nostalgia-snippet">
              {lang === 'hi' ? memoryStoryHi : memoryStoryEn}
            </p>
          </div>
        </div>
      </motion.section>

      {/* 7. LIVE COGNITIVE HEALTH & WELLNESS CARD */}
      <motion.section className="mob-card mob-wellness-card" variants={itemVariants}>
        <div className="mob-wellness-badge-circle">
          <span className="mob-wellness-pct">99%</span>
          <span className="mob-wellness-tag">{lang === 'hi' ? 'सुरक्षित' : 'SAFE'}</span>
        </div>
        <div className="mob-wellness-info">
          <div className="mob-wellness-headline">
            <Activity size={14} color="#176b58" />
            {lang === 'hi' ? 'कम जोखिम • स्वास्थ्य सामान्य' : 'Low Risk • Well Being'}
          </div>
          <p className="mob-wellness-desc">
            {lang === 'hi' ? 'दवा व दिनचर्या समय पर चल रही है।' : 'Schedule and routines are on track.'}
          </p>
        </div>
        <motion.button
          type="button"
          className="mob-wellness-cta"
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (typeof openMemoryQuiz === 'function') openMemoryQuiz();
            else openModule('games');
          }}
        >
          {lang === 'hi' ? 'स्मृति जाँच' : 'Memory Check'}
        </motion.button>
      </motion.section>

      {/* 8. CORE MODULES 2x2 GRID */}
      <motion.div variants={itemVariants}>
        <div className="mob-section-title">
          <span>{lang === 'hi' ? 'मुख्य सेवाएँ' : 'Quick Features'}</span>
        </div>
        <div className="mob-features-grid">
          {/* Tile 1: Brain Games */}
          <motion.div
            className="mob-card mob-feature-tile mob-tile-games"
            whileTap={{ scale: 0.96 }}
            onClick={() => openModule('games')}
          >
            <div className="mob-tile-top">
              <div className="mob-tile-icon-box">
                <Puzzle size={20} />
              </div>
              <span className="mob-tile-badge">{lang === 'hi' ? '3 खेल' : '3 Games'}</span>
            </div>
            <div>
              <h3 className="mob-tile-title">{lang === 'hi' ? 'दिमाग के खेल' : 'Brain Games'}</h3>
              <p className="mob-tile-sub">{lang === 'hi' ? 'स्मृति व ध्यान' : 'Memory & Focus'}</p>
            </div>
          </motion.div>

          {/* Tile 2: Safety & GPS */}
          <motion.div
            className="mob-card mob-feature-tile mob-tile-safety"
            whileTap={{ scale: 0.96 }}
            onClick={() => openModule('safety')}
          >
            <div className="mob-tile-top">
              <div className="mob-tile-icon-box">
                <MapPin size={20} />
              </div>
              <span className="mob-tile-badge">{lang === 'hi' ? 'सक्रिय' : 'Active'}</span>
            </div>
            <div>
              <h3 className="mob-tile-title">{lang === 'hi' ? 'सुरक्षा व स्थान' : 'Safety & GPS'}</h3>
              <p className="mob-tile-sub">{lang === 'hi' ? 'घर पर सुरक्षित' : 'Safe at Home'}</p>
            </div>
          </motion.div>

          {/* Tile 3: Care Circle */}
          <motion.div
            className="mob-card mob-feature-tile mob-tile-care"
            whileTap={{ scale: 0.96 }}
            onClick={() => openModule('care-circle')}
          >
            <div className="mob-tile-top">
              <div className="mob-tile-icon-box">
                <Users size={20} />
              </div>
              <span className="mob-tile-badge">{lang === 'hi' ? 'परिवार' : 'Family'}</span>
            </div>
            <div>
              <h3 className="mob-tile-title">{lang === 'hi' ? 'देखभाल चक्र' : 'Care Circle'}</h3>
              <p className="mob-tile-sub">{lang === 'hi' ? 'बेटी व डॉक्टर' : 'Daughter & Doctor'}</p>
            </div>
          </motion.div>

          {/* Tile 4: Progress */}
          <motion.div
            className="mob-card mob-feature-tile mob-tile-progress"
            whileTap={{ scale: 0.96 }}
            onClick={() => openModule('progress')}
          >
            <div className="mob-tile-top">
              <div className="mob-tile-icon-box">
                <LineChart size={20} />
              </div>
              <span className="mob-tile-badge">{lang === 'hi' ? '98%' : '98%'}</span>
            </div>
            <div>
              <h3 className="mob-tile-title">{lang === 'hi' ? 'दैनिक प्रगति' : 'Daily Progress'}</h3>
              <p className="mob-tile-sub">{lang === 'hi' ? 'साप्ताहिक रिपोर्ट' : 'Weekly Trends'}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 9. EMERGENCY 1-TAP CALL BANNER */}
      <motion.section className="mob-card mob-emergency-banner" variants={itemVariants}>
        <div className="mob-emergency-left">
          <div className="mob-emergency-icon">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="mob-emergency-title">
              {lang === 'hi' ? 'मदद चाहिए?' : 'Need Help?'}
            </h4>
            <p className="mob-emergency-sub">
              {lang === 'hi' ? 'आपातकालीन सहायता के लिए दबाएँ' : 'Instant 24x7 Emergency Contact'}
            </p>
          </div>
        </div>
        <motion.button
          type="button"
          className="mob-emergency-call-btn"
          whileTap={{ scale: 0.94 }}
          onClick={openEmergency}
        >
          <PhoneCall size={14} />
          {lang === 'hi' ? 'तुरंत कॉल' : 'Call Now'}
        </motion.button>
      </motion.section>

      {/* QUICK CALL MODAL SHEET */}
      <AnimatePresence>
        {callTarget && (
          <motion.div
            className="mob-call-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCallTarget(null)}
          >
            <motion.div
              className="mob-call-modal-card"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="mob-call-modal-close"
                onClick={() => setCallTarget(null)}
              >
                <X size={18} />
              </button>
              <div className="mob-call-modal-avatar-box">
                <img src={callTarget.photo} alt={callTarget.name} className="mob-call-modal-avatar" />
              </div>
              <h3 className="mob-call-modal-name">{callTarget.name}</h3>
              <p className="mob-call-modal-role">{callTarget.role}</p>

              <div className="mob-call-modal-actions">
                <a
                  href={`tel:${callTarget.phone || '112'}`}
                  className="mob-call-modal-dial-btn"
                  onClick={() => setCallTarget(null)}
                >
                  <PhoneCall size={18} />
                  <span>{lang === 'hi' ? 'कॉल मिलाएँ' : 'Voice Call'}</span>
                </a>
                <button
                  type="button"
                  className="mob-call-modal-cancel-btn"
                  onClick={() => setCallTarget(null)}
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
