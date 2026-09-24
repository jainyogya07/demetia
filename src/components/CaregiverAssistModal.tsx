// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Captions, Heart, Languages, Mic, MicOff, Phone, PhoneOff, Send, Sparkles, Volume2, X,
} from 'lucide-react';
import SmritiAvatar from '../assets/smriti-avatar.svg';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { voiceNameForGender } from '../data/liveVoices';
import { claimVoice, onVoice, releaseVoice, VOICE_EVENTS } from '../lib/voiceBus';
import {
  CAREGIVER_CHIP_GROUPS,
  CAREGIVER_SCREENS,
  caregiverContextBlock,
  parseCaregiverTags,
  stripCaregiverTags,
  resolveCaregiverUtterance,
} from '../lib/caregiverAssistCatalog';
import { runCaregiverAction } from '../lib/caregiverAssist';
import { speakFallback, ttsLangForName } from '../lib/speakFallback';
import '../AICompanion.css';
import './SarthiAssistModal.css';

const CaregiverCallStage = ({
  statusClass,
  isSpeaking,
  isConnected,
  audioLevel,
  badge,
  statusText,
  showCaptions,
  onToggleCaptions,
}) => {
  const talk = isSpeaking ? Math.min(Math.max(audioLevel, 0), 1) : 0;
  const headMotionStyle = isSpeaking
    ? {
        transform: `rotateY(${(-6 + talk * 14).toFixed(2)}deg) rotateX(${(-1 - talk * 7).toFixed(2)}deg) translate3d(${(talk * 4).toFixed(2)}px, ${(-talk * 10).toFixed(2)}px, ${(28 + talk * 36).toFixed(2)}px) scale(${(1.02 + talk * 0.04).toFixed(3)})`,
      }
    : undefined;
  const jawStyle = {
    transform: `translate3d(0, ${(talk * 14).toFixed(2)}px, 2px) rotateX(${(talk * 8).toFixed(2)}deg) scaleY(${(1 + talk * 0.08).toFixed(3)})`,
  };
  const mouthStyle = {
    opacity: isSpeaking ? 0.28 + talk * 0.55 : 0,
    transform: `translate(-50%, 0) scaleX(${(0.72 + talk * 0.55).toFixed(3)}) scaleY(${(0.18 + talk * 1.45).toFixed(3)})`,
  };

  return (
    <div className="ai-call-stage">
      <div className={`ai-call-frame ${statusClass}`}>
        <div className="ai-call-studio" />
        <div className="ai-call-perspective">
          <div className={`ai-call-head ${statusClass}`} style={headMotionStyle}>
            <img className="ai-call-photo" src={SmritiAvatar} alt="Saarthi Care Partner" />
            <div className="ai-call-shoulders" />
            <div className="ai-call-jaw" style={jawStyle}>
              <img src={SmritiAvatar} alt="" />
            </div>
            <div className="ai-call-mouth" style={mouthStyle} />
            <div className="ai-call-blink" />
          </div>
        </div>
        <div className="ai-call-vignette" />
        <div className={`ai-call-live-badge ${isConnected ? 'live' : ''}`}>
          <span className="ai-live-dot" />
          {badge}
        </div>
        <button
          type="button"
          className={`ai-cc-btn ${showCaptions ? 'active' : ''}`}
          onClick={onToggleCaptions}
        >
          <Captions size={15} />
          <span>Captions</span>
        </button>
        <div className="ai-call-nameplate">
          <span className="ai-call-name">
            Saarthi Care Partner <Heart size={13} className="ai-name-heart" />
          </span>
          <span className={`ai-status-indicator ${statusClass}`}>
            <span className="ai-status-dot" />
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function CaregiverAssistModal({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLang, lang } = useI18n();
  const { prefs, updatePrefs } = usePrefs();
  const voiceName = voiceNameForGender(prefs.voice?.gender);

  const [inputText, setInputText] = useState('');
  const [showCaptions, setShowCaptions] = useState(prefs.privacy?.captions !== false);
  const [pending, setPending] = useState<unknown>(null);
  const [log, setLog] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Namaste Rina. I am your Saarthi Care Partner. You can ask for Latveria’s status, add tasks to the checklist, schedule doctor visits, update routine medications, train AI facts, or run a cognitive assessment.',
    },
  ]);

  const captionsBodyRef = useRef<any>(null);
  const geminiKeysRef = useRef(new Set());
  const lastTurnRef = useRef('');
  const lastUserCapRef = useRef('');
  const parsedAtRef = useRef(0);
  const transcriptRef = useRef('');
  const lastSaidRef = useRef('');

  const {
    connect,
    disconnect,
    sendText,
    stopGeneration,
    startListening,
    stopListening,
    isConnected,
    isSpeaking,
    isListening,
    isThinking,
    connectionStatus,
    transcript,
    captions,
    audioLevel,
    lastError,
    completedTurn,
    setPlaybackMuted,
    unlockPlayback,
  } = useGeminiLive({
    uiLanguageName: language.englishName,
    voiceName,
    persona: 'caregiver-assist',
    gender: prefs.voice?.gender === 'male' ? 'male' : 'female',
    promptContext: caregiverContextBlock({ currentPath: location.pathname }),
  });

  transcriptRef.current = transcript;

  const pushLog = (role, text) => {
    const line = String(text || '').trim();
    if (!line) return;
    if (role === 'ai') lastSaidRef.current = line;
    setLog((prev) => [...prev.slice(-14), { id: `${Date.now()}-${role}`, role, text: line }]);
  };

  const executeAction = async (action) => {
    const result = await runCaregiverAction(action, { navigate, pushLog });
    pushLog('ai', result);
    return result;
  };

  const runText = async (raw, fromVoice = false) => {
    const cleaned = String(raw || '').trim();
    if (!cleaned) return;
    pushLog('user', cleaned);

    const answer = String(cleaned).toLowerCase().replace(/[?!,.]/g, '').trim();
    if (pending) {
      if (['haan', 'ha', 'yes', 'ok', 'okay', 'karo', 'theek hai', 'confirm'].includes(answer)) {
        const act = pending;
        setPending(null);
        await executeAction(act);
        return;
      }
      if (['nahi', 'no', 'cancel', 'mat karo'].includes(answer)) {
        setPending(null);
        pushLog('ai', 'Understood. Action cancelled.');
        return;
      }
    }

    if (!fromVoice) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'undefined') {
        // Auto-start voice call if not started yet so Gemini can reply with voice and text
        if (!isConnected) {
          claimVoice('caregiver-assist');
          await unlockPlayback?.();
          setPlaybackMuted?.(false);
          connect({ startMic: false, mode: 'voice', languageName: language.englishName, voiceName });
        }
        sendText(cleaned);
        return;
      }

      // Offline / fallback if no API key
      const actions = resolveCaregiverUtterance(cleaned);
      if (actions.length > 0) {
        for (const act of actions) {
          await executeAction(act);
        }
        return;
      }

      const reply = 'I am here to help coordinate care. Ask for patient status, schedule appointments, add routine pills, or run an assessment.';
      pushLog('ai', reply);
      speakFallback(reply, ttsLangForName(language.englishName));
    }
  };

  // Voice bus coordination
  useEffect(() => {
    if (open) claimVoice('caregiver-assist');
    return () => {
      releaseVoice('caregiver-assist');
    };
  }, [open]);

  useEffect(() => {
    if (!open && isConnected) {
      disconnect();
      stopListening();
      releaseVoice('caregiver-assist');
    }
  }, [open, isConnected, disconnect, stopListening]);

  useEffect(() => {
    const drop = (event) => {
      if (event.detail?.owner && event.detail.owner !== 'caregiver-assist') {
        disconnect();
        onClose?.();
      }
    };
    return onVoice(VOICE_EVENTS.VOICE_CLAIM, drop);
  }, [disconnect, onClose]);

  // Auto-scroll captions
  useEffect(() => {
    const el = captionsBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [captions]);

  // Track live user captions for parsing offset
  useEffect(() => {
    const liveUser = captions.filter((line) => line.role === 'user').at(-1);
    if (!liveUser?.id || liveUser.id === lastUserCapRef.current) return;
    lastUserCapRef.current = liveUser.id;
    geminiKeysRef.current = new Set();
    parsedAtRef.current = transcriptRef.current.length;
  }, [captions]);

  // Parse action tags streamed in Gemini transcript
  useEffect(() => {
    if (!open || !transcript) return;
    const chunk = String(transcript).slice(parsedAtRef.current);
    const actions = parseCaregiverTags(chunk);
    actions.forEach(async (act) => {
      const key = `${act.kind}:${act.path || act.day || act.title || act.category || ''}`;
      if (geminiKeysRef.current.has(key)) return;
      geminiKeysRef.current.add(key);
      await executeAction(act);
    });
  }, [transcript, open]);

  // Handle completed Gemini turns
  useEffect(() => {
    if (!open || !completedTurn?.id || lastTurnRef.current === completedTurn.id) return;
    lastTurnRef.current = completedTurn.id;
    if (completedTurn.saheli) {
      const cleanReply = stripCaregiverTags(completedTurn.saheli);
      if (cleanReply) pushLog('ai', cleanReply);
    }
    const spoken = String(completedTurn.user || '').trim();
    if (spoken) runText(spoken, true);
  }, [completedTurn, open]);

  const toggleVoiceCall = async () => {
    if (isConnected) {
      disconnect();
      stopListening();
      releaseVoice('caregiver-assist');
    } else {
      claimVoice('caregiver-assist');
      await unlockPlayback?.();
      setPlaybackMuted?.(false);
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
    }
  };

  const toggleMic = () => {
    if (!isConnected) {
      claimVoice('caregiver-assist');
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
      return;
    }
    if (isListening) stopListening();
    else startListening();
  };

  const submit = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    runText(text, false);
  };

  const statusClass = isSpeaking
    ? 'speaking'
    : isListening
      ? 'listening'
      : isThinking
        ? 'thinking'
        : isConnected
          ? 'ready'
          : connectionStatus === 'connecting'
            ? 'connecting'
            : 'ready';

  const statusText = connectionStatus === 'error'
    ? 'Connection issue'
    : connectionStatus === 'connecting'
      ? 'Connecting...'
      : isSpeaking
        ? 'Speaking...'
        : isThinking
          ? 'Understanding...'
          : isListening
            ? 'Listening'
            : isConnected
              ? 'Live'
              : 'Ready';

  const micMuted = isConnected && !isListening;

  if (!open) return null;

  return (
    <div className="sa-modal-overlay sa-modal-overlay-wide" onClick={onClose} role="presentation">
      <div
        className="sa-modal sa-modal-wide sa-companion-clone"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sa-caregiver-title"
      >
        <header className="sa-header">
          <div>
            <p className="sa-kicker">ASK · COORDINATE · DO</p>
            <h2 className="sa-title" id="sa-caregiver-title">Saarthi Care Partner</h2>
          </div>
          <div className="sa-header-actions">
            <button className="sa-close" type="button" onClick={onClose} aria-label="Hide Assistant">
              <X size={22} />
            </button>
          </div>
        </header>

        <div className="ai-layout sa-clone-layout">
          {/* LEFT: Gemini Live Avatar & Call Panel */}
          <div className={`ai-avatar-panel ${statusClass}${showCaptions ? ' captions-open' : ''}`}>
            <CaregiverCallStage
              statusClass={statusClass}
              isSpeaking={isSpeaking}
              isConnected={isConnected}
              audioLevel={audioLevel}
              badge={isSpeaking ? 'Partner • Speaking' : isListening ? 'Partner • Listening' : isConnected ? 'Partner • Live' : 'Saarthi Care Partner'}
              statusText={statusText}
              showCaptions={showCaptions}
              onToggleCaptions={() => setShowCaptions((v) => !v)}
            />

            {showCaptions && (
              <div className="ai-captions-panel">
                <div className="ai-captions-header">
                  <span>Live captions</span>
                  <span className="ai-captions-hint">Spoken words stream here</span>
                </div>
                <div className="ai-captions-body" ref={captionsBodyRef}>
                  {captions.length === 0 ? (
                    <p className="ai-captions-empty">Live captions appear as you talk with Saarthi.</p>
                  ) : (
                    captions.map((line) => (
                      <p key={line.id} className={`ai-caption-line ${line.role}${line.live ? ' live' : ''}`}>
                        <span className="ai-caption-who">{line.role === 'user' ? 'You' : 'Saarthi'}</span>
                        {stripCaregiverTags(line.text)}
                      </p>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="ai-voice-controls">
              <button className={`ai-call-btn ${isConnected ? 'active' : ''}`} onClick={toggleVoiceCall}>
                {isConnected ? <PhoneOff size={20} /> : <Phone size={20} />}
                <span>{isConnected ? 'End Voice Call' : 'Start Voice Call'}</span>
              </button>
              {isConnected && (
                <div className="ai-call-actions">
                  <button className={`ai-mic-btn ${isListening ? 'active' : ''} ${micMuted ? 'muted' : ''}`} onClick={toggleMic}>
                    {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button
                    type="button"
                    className="ai-speaker-btn"
                    title="Turn speaker on"
                    onClick={() => {
                      setPlaybackMuted?.(false);
                      unlockPlayback?.();
                      speakFallback('Audio is on.', ttsLangForName(language.englishName));
                    }}
                  >
                    <Volume2 size={18} />
                  </button>
                  <button className={`ai-cc-action ${showCaptions ? 'active' : ''}`} onClick={() => setShowCaptions((v) => !v)}>
                    <Captions size={18} />
                  </button>
                </div>
              )}
              {(isThinking || isSpeaking) && (
                <button className="ai-call-btn" style={{ backgroundColor: 'var(--alert-red-text)', marginTop: '4px' }} onClick={stopGeneration}>
                  Stop Saarthi
                </button>
              )}
            </div>

            {/* Language & Voice Preferences */}
            <div className="sa-preference-box">
              <div className="sa-pref-row">
                <span className="sa-pref-label">Language</span>
                <div className="sa-pref-chips">
                  {[
                    { code: 'as', label: 'Assamese' },
                    { code: 'kha', label: 'Khasi' },
                    { code: 'lus', label: 'Mizo' },
                    { code: 'mni', label: 'Manipuri' },
                    { code: 'brx', label: 'Bodo' },
                    { code: 'hi', label: 'Hindi' },
                    { code: 'en', label: 'English' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      className={`sa-pref-chip ${lang === l.code ? 'active' : ''}`}
                      onClick={() => setLang(l.code)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sa-pref-row">
                <span className="sa-pref-label">Voice</span>
                <div className="sa-pref-chips">
                  {['female', 'male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`sa-pref-chip ${(prefs.voice?.gender || 'female') === g ? 'active' : ''}`}
                      onClick={() => updatePrefs({ voice: { gender: g } })}
                    >
                      {g === 'female' ? 'Female' : 'Male'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ai-panel-footer">
              <div className="ai-lang-badge">
                <Languages size={14} />
                {language.name} • {language.englishName}
              </div>
              <div className="ai-powered-badge">
                <Sparkles size={12} />
                Powered by Gemini Live
              </div>
            </div>
          </div>

          {/* RIGHT: Chat & Operations Panel */}
          <div className="ai-chat-panel">
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <h3>Care Operations Co-pilot</h3>
                <span className="ai-chat-mode-badge">{isConnected ? 'Voice Active' : 'Text Active'}</span>
              </div>
            </div>

            <div className="ai-messages-area">
              {lastError && <div className="ai-error-banner">{lastError}</div>}
              {log.map((msg) => (
                <div key={msg.id} className={`ai-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.role !== 'user' && (
                    <div className="ai-message-avatar">
                      <img src={SmritiAvatar} alt="" />
                    </div>
                  )}
                  <div className="ai-message-bubble">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {pending && (
                <div className="sa-confirmation">
                  <button className="sa-btn-yes" type="button" onClick={() => { const act = pending; setPending(null); executeAction(act); }}>Confirm</button>
                  <button className="sa-btn-no" type="button" onClick={() => { setPending(null); pushLog('ai', 'Action cancelled.'); }}>Cancel</button>
                </div>
              )}

              {/* Caregiver Operations Knowledge & Action Chips */}
              <div className="sa-knowledge">
                <div className="sa-chip-group">
                  <p className="sa-chip-heading">Patient Overview & Safety</p>
                  <div className="sa-chip-row">
                    <button type="button" onClick={() => runText('Patient status summary batao')}>📊 Patient Status Today</button>
                    <button type="button" onClick={() => runText('Where is Latveria right now? Safety check karo')}>📍 Check Safety & GPS</button>
                  </div>
                </div>

                <div className="sa-chip-group">
                  <p className="sa-chip-heading">Schedule & Medications</p>
                  <div className="sa-chip-row">
                    <button type="button" onClick={() => runText('Wednesday calendar mein Dr. Sharma visit add karo 11:00 AM')}>📅 Schedule Dr. Visit (Wed)</button>
                    <button type="button" onClick={() => runText('Routine mein Donepezil 5mg add karo')}>💊 Add Routine Medicine</button>
                    <button type="button" onClick={() => runText('Add task: Pick up Donepezil from pharmacy at 5 PM')}>✅ Add Today Task</button>
                  </div>
                </div>

                <div className="sa-chip-group">
                  <p className="sa-chip-heading">Clinical Telemetry & AI Knowledge</p>
                  <div className="sa-chip-row">
                    <button type="button" onClick={() => runText('Run cognitive evaluation on Latveria')}>🧠 Run Cognitive Assessment</button>
                    <button type="button" onClick={() => runText('Train AI: She gets anxious around sunset, prefers classical music')}>💡 Train AI Observation</button>
                  </div>
                </div>

                <div className="sa-chip-group">
                  <p className="sa-chip-heading">Navigate Screens</p>
                  <div className="sa-chip-row">
                    {CAREGIVER_SCREENS.slice(0, 8).map((screen) => (
                      <button
                        key={screen.id}
                        type="button"
                        onClick={() => executeAction({ kind: 'navigate', path: screen.path, say: screen.say })}
                      >
                        {screen.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-input-area">
              <div className="ai-input-wrapper">
                <input
                  type="text"
                  className="ai-text-input"
                  placeholder={isListening ? 'Listening via Gemini Live...' : 'Ask status, schedule visit, add routine med, train AI...'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                />
                <div className="ai-input-actions">
                  <button className={`ai-input-mic ${isListening ? 'active' : ''} ${micMuted ? 'muted' : ''}`} onClick={toggleMic}>
                    {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button className={`ai-send-btn ${inputText.trim() ? 'active' : ''}`} onClick={submit} disabled={!inputText.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="ai-input-hint">Caregiver Co-pilot connects via Gemini Live. Bolo: “Dr. Sharma visit schedule karo” ya “Patient status batao”.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
