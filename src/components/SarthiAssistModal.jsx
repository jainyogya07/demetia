import { useEffect, useRef, useState } from 'react';
import {
  Captions, Heart, MessageCircle, Mic, MicOff, Phone, PhoneOff, Send, Sparkles, Languages, Volume2, X,
} from 'lucide-react';
import SmritiAvatar from '../assets/smriti-avatar.svg';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { useSaarthiWake } from '../hooks/useSaarthiWake';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { voiceNameForGender } from '../data/liveVoices';
import { claimVoice, onVoice, releaseVoice, VOICE_EVENTS } from '../lib/voiceBus';
import {
  assistChipGroups,
  assistContextBlock,
  parseAssistActions,
  stripAssistTags,
} from '../lib/assistCatalog';
import {
  confirmationLevel,
  resolveUtterance,
  runAssistAction,
  spokenFor,
  activeAssistFill,
} from '../lib/sarthiAssist';
import '../AICompanion.css';
import './SarthiAssistModal.css';

const AssistCallStage = ({
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
            <img className="ai-call-photo" src={SmritiAvatar} alt="Sarthi Assist" />
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
            Sarthi Assist <Heart size={13} className="ai-name-heart" />
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

function hasFollowUp(answer) {
  return /kal|message|sms|baje|time|change|edit|person/.test(answer);
}

export default function SarthiAssistRuntime({
  panelOpen,
  onPanelOpen,
  onPanelClose,
  paused,
  onLiveChange,
  authenticated = true,
}) {
  const { openModule, openEmergency, currentModuleId, activeGameId } = useAppNav();
  const { language, setLang, lang } = useI18n();
  const { prefs, updatePrefs } = usePrefs();
  const voiceName = voiceNameForGender(prefs.voice?.gender);
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
  } = useGeminiLive({
    uiLanguageName: language.englishName,
    voiceName,
    persona: 'assist',
    gender: prefs.voice?.gender === 'male' ? 'male' : 'female',
    promptContext: assistContextBlock({ currentModuleId, activeGameId }),
  });

  const [inputText, setInputText] = useState('');
  const [showCaptions, setShowCaptions] = useState(prefs.privacy?.captions !== false);
  const [pending, setPending] = useState(null);
  const [keepAlive, setKeepAlive] = useState(false);
  const [log, setLog] = useState([
    { id: 'welcome', role: 'ai', text: 'Boliye kya kholna ya karna hai — dawa, routine, photos, khel, family.' },
  ]);
  const chips = assistChipGroups();
  const captionsBodyRef = useRef(null);
  const geminiKeysRef = useRef(new Set());
  const lastTurnRef = useRef('');
  const lastUserCapRef = useRef('');
  const parsedAtRef = useRef(0);
  const transcriptRef = useRef('');
  transcriptRef.current = transcript;
  const connectTimerRef = useRef(0);
  const keepAliveRef = useRef(false);
  const lastDestRef = useRef(null);
  const lastSaidRef = useRef('');
  const endedRef = useRef(false);
  const prevOpenRef = useRef(false);
  keepAliveRef.current = keepAlive;

  const pushLog = (role, text) => {
    const line = String(text || '').trim();
    if (!line) return;
    if (role === 'ai') lastSaidRef.current = line;
    setLog((prev) => [...prev.slice(-12), { id: `${Date.now()}-${role}`, role, text: line }]);
  };

  const deps = {
    openModule,
    openEmergency,
    updatePrefs,
    setLang,
    currentScale: prefs.accessibility?.uiScale || 100,
    currentLang: lang,
    profileName: prefs.profile?.name,
    onLocation: (line) => pushLog('ai', line),
    onCaptions: setShowCaptions,
  };

  const revealScreen = (dest) => {
    const showPage = Boolean(
      dest?.open
      || dest?.gameId
      || dest?.kind === 'photo'
      || dest?.kind === 'photo-search'
      || dest?.kind === 'complete'
      || dest?.kind === 'skip'
      || dest?.kind === 'memory-draft'
      || dest?.kind === 'memory-save'
      || dest?.kind === 'check-in'
      || dest?.kind === 'location-refresh'
      || dest?.kind === 'settings-draft'
      || dest?.kind === 'settings-save'
      || dest?.kind === 'explain'
      || dest?.kind === 'read-screen'
      || dest?.kind === 'simplify'
      || dest?.kind === 'help'
      || dest?.kind === 'what-next'
      || dest?.kind === 'summary',
    );
    if (showPage && dest?.kind !== 'speak' && dest?.open !== 'ai') onPanelClose?.();
  };

  const execute = (dest, fromVoice = false) => {
    if (dest?.kind === 'stop') {
      stopGeneration();
      try {
        localStorage.removeItem('sarthi-memory-draft-v1');
        localStorage.removeItem('sarthi-settings-draft-v1');
      } catch {
        /* ignore */
      }
    }
    const filling = lastDestRef.current?.kind === 'memory-draft' || lastDestRef.current?.kind === 'settings-draft' || Boolean(activeAssistFill());
    const isFillDest = dest?.kind === 'memory-draft' || dest?.kind === 'memory-save' || dest?.kind === 'settings-draft' || dest?.kind === 'settings-save';
    const dupMemoryNew = filling
      && dest?.kind === 'memory-draft'
      && lastDestRef.current?.kind === 'memory-draft'
      && !dest.draft?.title
      && !dest.draft?.body;
    if (dupMemoryNew) return lastSaidRef.current;
    let nextDest = dest;
    if (
      filling
      && lastDestRef.current?.kind === 'memory-draft'
      && dest?.open === 'settings'
      && dest?.kind !== 'settings-draft'
      && dest?.kind !== 'settings-save'
    ) {
      nextDest = {
        kind: 'settings-draft',
        draft: {},
        ask: 'name',
        open: 'settings',
        say: 'Settings khol di. Naam bolo.',
      };
    }
    const sameReopen = filling && !isFillDest && nextDest?.open && nextDest.open === lastDestRef.current?.open && !nextDest?.kind;
    if (sameReopen && nextDest?.open !== 'settings') {
      return lastSaidRef.current;
    }
    if (nextDest?.open && nextDest.open !== 'memory-book' && lastDestRef.current?.kind === 'memory-draft') {
      try { localStorage.removeItem('sarthi-memory-draft-v1'); } catch { /* ignore */ }
    }
    lastDestRef.current = nextDest;
    const said = runAssistAction(nextDest, deps);
    pushLog('ai', said);
    revealScreen(nextDest);
    if (nextDest.kind === 'speak' || nextDest.open === 'ai') onPanelClose?.();
    return said;
  };

  const runText = (raw, fromVoice = false) => {
    const cleaned = String(raw || '').trim();
    if (!cleaned) return;
    pushLog('user', cleaned);
    const answer = String(cleaned).toLowerCase().replace(/[?!,.]/g, '').trim();
    if (pending) {
      if (['haan', 'ha', 'yes', 'ok', 'okay', 'karo', 'theek hai', 'confirm'].includes(answer)) {
        const dest = pending;
        setPending(null);
        execute(dest, fromVoice);
        return;
      }
      if (['nahi', 'no', 'cancel', 'mat karo'].includes(answer)) {
        setPending(null);
        pushLog('ai', 'Theek hai. Woh nahi kiya.');
        return;
      }
      if (hasFollowUp(answer)) {
        const dests = resolveUtterance(cleaned, {
          currentModuleId,
          activeGameId,
          lastDest: pending,
          lastSaid: lastSaidRef.current,
          profileName: prefs.profile?.name,
        });
        setPending(null);
        dests.forEach((dest) => execute(dest, fromVoice));
        return;
      }
    }
    const dests = resolveUtterance(cleaned, {
      currentModuleId,
      activeGameId,
      lastDest: lastDestRef.current,
      lastSaid: lastSaidRef.current,
      profileName: prefs.profile?.name,
    });
    if (!dests.length) {
      if (!fromVoice) sendText(cleaned);
      return;
    }
    dests.forEach((dest, index) => {
      window.setTimeout(() => {
        if (confirmationLevel(dest) >= 3) {
          setPending(dest);
          pushLog('ai', spokenFor(dest));
          return;
        }
        execute(dest, fromVoice);
      }, index * 280);
    });
  };

  useSaarthiWake({
    enabled: authenticated && !paused && !panelOpen && !keepAlive,
    onWake: () => onPanelOpen?.(),
  });

  useEffect(() => {
    onLiveChange?.(isConnected);
  }, [isConnected, onLiveChange]);

  useEffect(() => {
    if (paused || !authenticated) {
      window.clearTimeout(connectTimerRef.current);
      endedRef.current = true;
      keepAliveRef.current = false;
      setKeepAlive(false);
      disconnect();
      releaseVoice('assist');
    }
  }, [paused, authenticated, disconnect]);

  useEffect(() => {
    if (panelOpen && !prevOpenRef.current && authenticated && !paused) {
      endedRef.current = false;
      keepAliveRef.current = true;
      setKeepAlive(true);
    }
    prevOpenRef.current = panelOpen;
  }, [panelOpen, authenticated, paused]);

  useEffect(() => {
    if (paused || !authenticated || !keepAlive) return undefined;
    connectTimerRef.current = window.setTimeout(() => {
      claimVoice('assist');
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
    }, 450);
    return () => window.clearTimeout(connectTimerRef.current);
  }, [paused, authenticated, keepAlive, connect, language.englishName, voiceName]);

  useEffect(() => () => {
    disconnect();
    releaseVoice('assist');
  }, [disconnect]);

  useEffect(() => {
    const drop = (event) => {
      if (event.detail?.owner && event.detail.owner !== 'assist') {
        keepAliveRef.current = false;
        setKeepAlive(false);
        disconnect();
        onPanelClose?.();
      }
    };
    return onVoice(VOICE_EVENTS.VOICE_CLAIM, drop);
  }, [disconnect, onPanelClose]);

  useEffect(() => {
    const el = captionsBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [captions]);

  useEffect(() => {
    const liveUser = captions.filter((line) => line.role === 'user').at(-1);
    if (!liveUser?.id || liveUser.id === lastUserCapRef.current) return;
    lastUserCapRef.current = liveUser.id;
    geminiKeysRef.current = new Set();
    parsedAtRef.current = transcriptRef.current.length;
  }, [captions]);

  useEffect(() => {
    const live = panelOpen || keepAlive;
    if (!live || paused || !transcript) return;
    const filling = Boolean(activeAssistFill()) || lastDestRef.current?.kind === 'memory-draft' || lastDestRef.current?.kind === 'settings-draft';
    const chunk = String(transcript).slice(parsedAtRef.current);
    parseAssistActions(chunk).forEach((dest) => {
      const skipTag = filling
        && dest.open === lastDestRef.current?.open
        && dest.open !== 'settings'
        && dest.kind !== 'memory-save'
        && dest.kind !== 'settings-save'
        && dest.kind !== 'settings-draft'
        && dest.kind !== 'complete';
      if (skipTag) return;
      const key = `${dest.open || ''}:${dest.gameId || ''}:${dest.call?.id || dest.kind || ''}`;
      if (geminiKeysRef.current.has(key)) return;
      geminiKeysRef.current.add(key);
      if (confirmationLevel(dest) >= 3) {
        setPending(dest);
        pushLog('ai', spokenFor(dest));
        return;
      }
      execute(dest, true);
    });
  }, [transcript, panelOpen, keepAlive, paused]);

  useEffect(() => {
    const live = panelOpen || keepAlive;
    if (!live || paused || !completedTurn?.id || lastTurnRef.current === completedTurn.id) return;
    lastTurnRef.current = completedTurn.id;
    const spoken = String(completedTurn.user || '').trim();
    if (spoken) runText(spoken, true);
  }, [completedTurn, panelOpen, keepAlive, paused]);

  useEffect(() => {
    const onDescribed = (event) => {
      const text = event.detail?.text;
      if (text) pushLog('ai', text);
    };
    window.addEventListener('sarthi:photo-described', onDescribed);
    return () => window.removeEventListener('sarthi:photo-described', onDescribed);
  }, []);

  const toggleVoiceCall = () => {
    if (isConnected) {
      endedRef.current = true;
      keepAliveRef.current = false;
      setKeepAlive(false);
      stopListening();
      disconnect();
      releaseVoice('assist');
      return;
    }
    endedRef.current = false;
    claimVoice('assist');
    keepAliveRef.current = true;
    setKeepAlive(true);
    connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
  };

  const toggleMic = () => {
    if (!isConnected) {
      endedRef.current = false;
      claimVoice('assist');
      keepAliveRef.current = true;
      setKeepAlive(true);
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

  const statusClass = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : isConnected ? 'ready' : connectionStatus === 'connecting' ? 'connecting' : 'ready';
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
  const fabLabel = isSpeaking ? 'Speaking…' : isThinking ? 'Understanding…' : isListening || keepAlive ? 'Listening…' : 'Ask Sarthi';

  if (!authenticated || paused) return null;

  const fab = (
    <button
      type="button"
      className={`sarthi-assist-fab${currentModuleId === 'games' ? ' is-games' : ''}${keepAlive || isConnected ? ' is-live' : ''}${isSpeaking ? ' is-speaking' : ''}`}
      aria-label={fabLabel}
      onClick={() => onPanelOpen?.()}
    >
      <MessageCircle size={26} />
      <span className="sarthi-assist-fab-label">{fabLabel}</span>
    </button>
  );

  if (!panelOpen) return fab;

  return (
    <div className="sa-modal-overlay sa-modal-overlay-wide" onClick={onPanelClose} role="presentation">
      <div
        className="sa-modal sa-modal-wide sa-companion-clone"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sa-title"
      >
        <header className="sa-header">
          <div>
            <p className="sa-kicker">ASK · FIND · DO</p>
            <h2 className="sa-title" id="sa-title">Sarthi Assist</h2>
          </div>
          <div className="sa-header-actions">
            <button className="sa-close" type="button" onClick={onPanelClose} aria-label="Hide Assist">
              <X size={22} />
            </button>
          </div>
        </header>

        <div className="ai-layout sa-clone-layout">
          <div className={`ai-avatar-panel ${statusClass}${showCaptions ? ' captions-open' : ''}`}>
            <AssistCallStage
              statusClass={statusClass}
              isSpeaking={isSpeaking}
              isConnected={isConnected}
              audioLevel={audioLevel}
              badge={isSpeaking ? 'Assist • Speaking' : isListening ? 'Assist • Listening' : isConnected ? 'Assist • Live' : 'Sarthi Assist'}
              statusText={statusText}
              showCaptions={showCaptions}
              onToggleCaptions={() => setShowCaptions((v) => !v)}
            />

            {showCaptions && (
              <div className="ai-captions-panel">
                <div className="ai-captions-header">
                  <span>Live captions</span>
                  <span className="ai-captions-hint">Spoken words stay here</span>
                </div>
                <div className="ai-captions-body" ref={captionsBodyRef}>
                  {captions.length === 0 ? (
                    <p className="ai-captions-empty">Captions appear as you talk.</p>
                  ) : (
                    captions.map((line) => (
                      <p key={line.id} className={`ai-caption-line ${line.role}${line.live ? ' live' : ''}`}>
                        <span className="ai-caption-who">{line.role === 'user' ? 'You' : 'Assist'}</span>
                        {stripAssistTags(line.text)}
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
                  <button type="button" className="ai-speaker-btn" title="Audio active">
                    <Volume2 size={18} />
                  </button>
                  <button className={`ai-cc-action ${showCaptions ? 'active' : ''}`} onClick={() => setShowCaptions((v) => !v)}>
                    <Captions size={18} />
                  </button>
                </div>
              )}
              {(isThinking || isSpeaking) && (
                <button className="ai-call-btn" style={{ backgroundColor: 'var(--alert-red-text)', marginTop: '4px' }} onClick={stopGeneration}>
                  Stop Assist
                </button>
              )}
            </div>
            <div className="ai-panel-footer">
              <div className="ai-lang-badge">
                <Languages size={14} />
                Assamese • Hindi • English · NER languages
              </div>
              <div className="ai-powered-badge">
                <Sparkles size={12} />
                Powered by Gemini AI
              </div>
            </div>
          </div>

          <div className="ai-chat-panel">
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <h3>Ask · Find · Do</h3>
                <span className="ai-chat-mode-badge">{isConnected ? 'Voice' : 'Text'}</span>
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
                  <button className="sa-btn-yes" type="button" onClick={() => { const dest = pending; setPending(null); execute(dest); }}>Confirm</button>
                  <button className="sa-btn-no" type="button" onClick={() => { setPending(null); pushLog('ai', 'Theek hai. Woh nahi kiya.'); }}>Cancel</button>
                </div>
              )}
              <div className="sa-knowledge">
                <div className="sa-chip-group">
                  <p className="sa-chip-heading">This screen</p>
                  <div className="sa-chip-row">
                    <button type="button" onClick={() => runText('ye page kaise kaam karta hai')}>Explain this screen</button>
                    <button type="button" onClick={() => runText('ye screen padh ke sunao')}>Read this screen</button>
                    <button type="button" onClick={() => runText('simple karke batao')}>Make it simple</button>
                  </div>
                </div>
                {chips.map((group) => (
                  <div key={group.title} className="sa-chip-group">
                    <p className="sa-chip-heading">{group.title}</p>
                    <div className="sa-chip-row">
                      {group.items.slice(0, 8).map((item) => (
                        <button
                          key={item.id || item.label}
                          type="button"
                          onClick={() => execute(item.call ? { call: item.call } : { open: item.open, gameId: item.gameId, say: item.say })}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-input-area">
              <div className="ai-input-wrapper">
                <input
                  type="text"
                  className="ai-text-input"
                  placeholder={isListening ? 'Listening... you can also type here' : 'Type a task: dawa, photos, khel…'}
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
              <p className="ai-input-hint">Tab kholo — Assist peeche live rehti hai. Bolo “ye kaise kaam karta hai”.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
