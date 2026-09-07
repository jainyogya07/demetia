import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Send, Phone, PhoneOff, Volume2,
  Sparkles, Heart, User as UserIcon, Languages, ExternalLink, Captions
} from 'lucide-react';
import './AICompanion.css';
import SmritiAvatar from './assets/smriti-avatar.svg';
import { useGeminiLive } from './hooks/useGeminiLive';
import { useAppNav } from './AppNavContext';
import { useI18n } from './I18nContext';
import { usePrefs } from './PrefsContext';
import { voiceNameForGender } from './data/liveVoices';
import VoiceToggle from './components/VoiceToggle';
import { getSchemeChips, relatedSchemeLine } from './schemeLinks';
import { VOICE_EVENTS, notifyCompanionOpen, onVoice } from './lib/voiceBus';

const getTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const isVisibleMessage = (msg) =>
  Boolean((msg.text && msg.text.trim()) || (msg.chips && msg.chips.length));

const SUGGESTED_PROMPTS = [
  { icon: '💊', text: 'Did I take my morning medicine?' },
  { icon: '🏥', text: 'Which elderly health schemes can help us?' },
  { icon: '🧠', text: 'Tell me about NPHCE memory clinic support' },
  { icon: '📞', text: 'How do I call Elderline or Tele-MANAS?' },
];

const SaheliCallStage = ({
  statusClass,
  isSpeaking,
  isConnected,
  audioLevel,
  badge,
  statusText,
  showCaptions,
  onToggleCaptions,
  captionsEnabled,
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
            <img className="ai-call-photo" src={SmritiAvatar} alt="Care Agent" />
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

        {captionsEnabled && (
          <button
            type="button"
            className={`ai-cc-btn ${showCaptions ? 'active' : ''}`}
            onClick={onToggleCaptions}
            title={showCaptions ? 'Hide live captions' : 'Show live captions'}
          >
            <Captions size={15} />
            <span>Captions</span>
          </button>
        )}

        <div className="ai-call-nameplate">
          <span className="ai-call-name">
            Care Agent <Heart size={13} className="ai-name-heart" />
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

const AICompanion = () => {
  const { openModule, aiIntent, currentModuleId } = useAppNav();
  const { language } = useI18n();
  const { prefs } = usePrefs();
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
    userTranscript,
    captions,
    audioLevel,
    lastError,
    completedTurn,
    setPlaybackMuted,
  } = useGeminiLive({
    uiLanguageName: language.englishName,
    voiceName,
    persona: 'companion',
    gender: prefs.voice?.gender === 'male' ? 'male' : 'female',
  });

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: prefs.voice?.gender === 'male'
        ? 'Namaste. Main Care Agent hoon — aapka memory saathi. Jis bhasha mein aap baat karenge, usi mein jawab dunga.'
        : 'Namaste. Main Care Agent hoon — aapki memory saathi. Jis bhasha mein aap baat karenge, usi mein jawab dungi.',
      time: getTimeString(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('text');
  const [showCaptions, setShowCaptions] = useState(true);
  const [typedTurnActive, setTypedTurnActive] = useState(false);
  const messagesAreaRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const inputRef = useRef(null);
  const captionsBodyRef = useRef(null);
  const lastAiTranscriptRef = useRef('');
  const handledAiIntentRef = useRef(null);
  const lastSchemeTurnRef = useRef(null);
  const typedSawActivityRef = useRef(false);

  const scrollMessagesToBottom = () => {
    const el = messagesAreaRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  };

  const handleMessagesScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 96;
  };

  useEffect(() => {
    const frame = requestAnimationFrame(scrollMessagesToBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages, isThinking]);

  useEffect(() => {
    if (!aiIntent?.ts || handledAiIntentRef.current === aiIntent.ts) return;
    handledAiIntentRef.current = aiIntent.ts;
    notifyCompanionOpen();
    if (!aiIntent.startVoice) return;
    setMode('voice');
    setTypedTurnActive(false);
    lastAiTranscriptRef.current = '';
    try {
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
    } catch (err) {
      console.error('Care Agent voice connect failed', err);
    }
  }, [aiIntent]);

  useEffect(() => {
    if (currentModuleId === 'ai') return undefined;
    stopGeneration();
    disconnect();
    setMode('text');
    return undefined;
  }, [currentModuleId, disconnect, stopGeneration]);

  useEffect(() => {
    const dropLive = () => {
      stopGeneration();
      disconnect();
      setMode('text');
    };
    const onGameStart = () => dropLive();
    const onClaim = (event) => {
      if (event.detail?.owner && event.detail.owner !== 'companion') dropLive();
    };
    const onGameStop = () => {
      setPlaybackMuted?.(false);
    };
    const offStart = onVoice(VOICE_EVENTS.GAME_START, onGameStart);
    const offStop = onVoice(VOICE_EVENTS.GAME_STOP, onGameStop);
    const offClaim = onVoice(VOICE_EVENTS.VOICE_CLAIM, onClaim);
    return () => {
      offStart();
      offStop();
      offClaim();
    };
  }, [disconnect, stopGeneration, setPlaybackMuted]);

  useEffect(() => {
    const el = captionsBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [captions]);

  useEffect(() => {
    if (!typedTurnActive) return;
    if (!transcript || transcript === lastAiTranscriptRef.current) return;
    lastAiTranscriptRef.current = transcript;
    const chips = getSchemeChips(transcript);
    const chipKey = chips.map((chip) => chip.id ?? chip.label).join('|');

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === 'ai' && lastMsg.id === 'live-ai') {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMsg,
            text: transcript,
            chips,
            chipKey,
            time: getTimeString(),
          },
        ];
      }
      return [
        ...prev,
        {
          id: 'live-ai',
          role: 'ai',
          text: transcript,
          chips,
          chipKey,
          time: getTimeString(),
        },
      ];
    });
  }, [transcript, typedTurnActive]);

  useEffect(() => {
    if (!typedTurnActive) return;
    if (userTranscript) {
      setTypedTurnActive(false);
      setMessages((prev) =>
        prev
          .map((m) => (m.id === 'live-ai' ? { ...m, id: `ai-${Date.now()}` } : m))
          .filter(isVisibleMessage)
      );
    }
  }, [userTranscript, typedTurnActive]);

  useEffect(() => {
    if (!typedTurnActive) {
      typedSawActivityRef.current = false;
      return;
    }
    if (isThinking || isSpeaking || transcript) {
      typedSawActivityRef.current = true;
      return;
    }
    if (!typedSawActivityRef.current) return;
    setTypedTurnActive(false);
    setMessages((prev) =>
      prev
        .map((m) => (m.id === 'live-ai' ? { ...m, id: `ai-${Date.now()}` } : m))
        .filter(isVisibleMessage)
    );
  }, [isThinking, isSpeaking, typedTurnActive, transcript]);

  useEffect(() => {
    if (!typedTurnActive || !lastError) return;
    setTypedTurnActive(false);
    setMessages((prev) => prev.filter((m) => m.id !== 'live-ai' || isVisibleMessage(m)));
  }, [lastError, typedTurnActive]);

  useEffect(() => {
    if (!completedTurn?.id || lastSchemeTurnRef.current === completedTurn.id) return;
    lastSchemeTurnRef.current = completedTurn.id;

    const chips = getSchemeChips(completedTurn.saheli);
    if (!chips.length) return;

    const chipKey = chips.map((chip) => chip.id ?? chip.label).join('|');
    const related = relatedSchemeLine(chips);

    setMessages((prev) => {
      const liveIdx = prev.findIndex((m) => m.id === 'live-ai');
      if (liveIdx >= 0 || typedTurnActive) {
        if (liveIdx < 0) return prev;
        if (prev[liveIdx].chipKey === chipKey) return prev;
        const next = [...prev];
        next[liveIdx] = { ...next[liveIdx], chips, chipKey };
        return next;
      }

      const lastAi = [...prev].reverse().find((m) => m.role === 'ai');
      if (lastAi?.kind === 'scheme' && lastAi.chipKey === chipKey) return prev;

      return [
        ...prev,
        {
          id: `scheme-${completedTurn.id}`,
          role: 'ai',
          kind: 'scheme',
          text: related,
          chips,
          chipKey,
          time: getTimeString(),
        },
      ];
    });
  }, [completedTurn, typedTurnActive]);

  const finalizeLiveMessages = (list) =>
    list
      .map((m) => {
        if (m.id === 'live-ai') return { ...m, id: `ai-${Date.now()}` };
        if (m.id === 'live-user') return { ...m, id: `user-${Date.now()}` };
        return m;
      })
      .filter(isVisibleMessage);

  const handleSendMessageDirect = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    lastAiTranscriptRef.current = '';
    typedSawActivityRef.current = false;
    stickToBottomRef.current = true;
    setTypedTurnActive(true);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: getTimeString(),
    };

    setMessages((prev) => [...finalizeLiveMessages(prev), userMsg]);
    sendText(trimmed);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleSendMessageDirect(text);
  };

  const handleSuggestion = (text) => {
    setInputText('');
    handleSendMessageDirect(text);
  };

  const toggleVoiceCall = () => {
    setTypedTurnActive(false);
    lastAiTranscriptRef.current = '';
    setMessages((prev) =>
      prev
        .map((m) => (m.id === 'live-ai' ? { ...m, id: `ai-${Date.now()}` } : m))
        .filter(isVisibleMessage)
    );
    if (isConnected) {
      stopListening();
      disconnect();
      setMode('text');
    } else {
      notifyCompanionOpen();
      setMode('voice');
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
    }
  };

  const toggleMic = () => {
    if (!isConnected) {
      setTypedTurnActive(false);
      lastAiTranscriptRef.current = '';
      setMode('voice');
      notifyCompanionOpen();
      connect({ startMic: true, mode: 'voice', languageName: language.englishName, voiceName });
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenScheme = (serviceId) => {
    openModule('services', serviceId ? { serviceId } : {});
  };

  const getStatusText = () => {
    if (connectionStatus === 'error') return 'Connection issue';
    if (connectionStatus === 'connecting') return 'Connecting...';
    if (isSpeaking) return 'Speaking...';
    if (isThinking) return 'Thinking...';
    if (isListening) return 'Listening';
    if (isConnected) return 'Connected';
    return 'Ready to help';
  };

  const getStatusClass = () => {
    if (connectionStatus === 'error') return 'error';
    if (connectionStatus === 'connecting') return 'connecting';
    if (isSpeaking) return 'speaking';
    if (isThinking) return 'thinking';
    if (isListening) return 'listening';
    if (isConnected) return 'ready';
    return 'ready';
  };

  const getCallBadge = () => {
    if (isSpeaking) return 'Care Agent • Speaking';
    if (isListening) return 'Care Agent • On call';
    if (isConnected) return 'Care Agent • Live';
    if (connectionStatus === 'connecting') return 'Care Agent • Connecting';
    return 'Care Agent';
  };

  const showTyping = typedTurnActive && isThinking && !transcript?.trim() && !lastError;
  const statusClass = getStatusClass();
  const voiceCallActive = mode === 'voice';
  const micMuted = isConnected && !isListening;

  return (
    <div className="ai-page">
      <div className="ai-layout">
        <div className={`ai-avatar-panel ${statusClass}${voiceCallActive && showCaptions ? ' captions-open' : ''}`}>
          <SaheliCallStage
            statusClass={statusClass}
            isSpeaking={isSpeaking}
            isConnected={isConnected}
            audioLevel={audioLevel}
            badge={getCallBadge()}
            statusText={getStatusText()}
            showCaptions={showCaptions}
            onToggleCaptions={() => setShowCaptions((prev) => !prev)}
            captionsEnabled={voiceCallActive}
          />

          {voiceCallActive && showCaptions && (
            <div className="ai-captions-panel">
              <div className="ai-captions-header">
                <span>Live captions</span>
                <span className="ai-captions-hint">Spoken words stay here — not in chat</span>
              </div>
              <div className="ai-captions-body" ref={captionsBodyRef}>
                {captions.length === 0 ? (
                  <p className="ai-captions-empty">
                    {isListening || isSpeaking || isThinking
                      ? 'Listening… captions will appear as you talk.'
                      : 'Captions will appear here during the call.'}
                  </p>
                ) : (
                  captions.map((line) => (
                    <p
                      key={line.id}
                      className={`ai-caption-line ${line.role}${line.live ? ' live' : ''}`}
                    >
                      <span className="ai-caption-who">
                        {line.role === 'user' ? 'You' : 'Care Agent'}
                      </span>
                      {line.text}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="ai-voice-controls">
            <button
              className={`ai-call-btn ${isConnected ? 'active' : ''}`}
              onClick={toggleVoiceCall}
              title={isConnected ? 'Disconnect' : 'Start Voice Call'}
            >
              {isConnected ? <PhoneOff size={20} /> : <Phone size={20} />}
              <span>{isConnected ? 'End Voice Call' : 'Start Voice Call'}</span>
            </button>

            {isConnected && (
              <div className="ai-call-actions">
                <button
                  className={`ai-mic-btn ${isListening ? 'active' : ''} ${micMuted ? 'muted' : ''}`}
                  onClick={toggleMic}
                  title={micMuted ? 'Unmute microphone' : isListening ? 'Mute microphone' : 'Talk by voice'}
                >
                  {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button className="ai-speaker-btn" title="Audio active">
                  <Volume2 size={18} />
                </button>
                {voiceCallActive && (
                  <button
                    className={`ai-cc-action ${showCaptions ? 'active' : ''}`}
                    onClick={() => setShowCaptions((prev) => !prev)}
                    title={showCaptions ? 'Hide live captions' : 'Show live captions'}
                  >
                    <Captions size={18} />
                  </button>
                )}
              </div>
            )}

            {(isThinking || isSpeaking) && (
              <button
                className="ai-call-btn"
                style={{ backgroundColor: 'var(--alert-red-text)', marginTop: '4px' }}
                onClick={stopGeneration}
              >
                Stop Care Agent
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
              <h3>Chat with Care Agent</h3>
              <span className="ai-chat-mode-badge">{mode === 'voice' ? 'Voice' : 'Text'}</span>
            </div>
            <div className="ai-chat-header-actions">
              <VoiceToggle />
            </div>
          </div>

          <div
            className="ai-messages-area"
            ref={messagesAreaRef}
            onScroll={handleMessagesScroll}
          >
            {lastError && (
              <div className="ai-error-banner">
                {lastError}
              </div>
            )}

            {voiceCallActive && (
              <div className="ai-voice-quiet-note">
                Voice call is on. Spoken words stay under <strong>Captions</strong>. Related schemes appear here as short links — not the full conversation.
              </div>
            )}

            {messages.length === 1 && (
              <div className="ai-suggestions">
                <p className="ai-suggestions-label">Try asking:</p>
                <div className="ai-suggestions-grid">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      className="ai-suggestion-card"
                      onClick={() => handleSuggestion(prompt.text)}
                    >
                      <span className="ai-suggestion-icon">{prompt.icon}</span>
                      <span className="ai-suggestion-text">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.filter(isVisibleMessage).map((msg) => {
              const chips = msg.chips || [];
              const showRelatedLine = chips.length > 0 && msg.kind !== 'scheme';
              return (
                <div key={msg.id} className={`ai-message ${msg.role}`}>
                  {msg.role === 'ai' && (
                    <div className="ai-message-avatar">
                      <img src={SmritiAvatar} alt="S" />
                    </div>
                  )}
                  <div className={`ai-message-bubble${msg.kind === 'scheme' ? ' scheme-card' : ''}`}>
                    {msg.text?.trim() ? <p>{msg.text}</p> : null}
                    {showRelatedLine && (
                      <p className="ai-scheme-related">{relatedSchemeLine(chips)}</p>
                    )}
                    {chips.length > 0 && (
                      <div className="ai-scheme-chips">
                        {chips.map((chip) => (
                          <button
                            key={`${msg.id}-${chip.id || 'generic'}`}
                            type="button"
                            className="ai-scheme-chip"
                            onClick={() => handleOpenScheme(chip.id)}
                          >
                            <span className="ai-scheme-chip-label">{chip.label}</span>
                            <span className="ai-scheme-chip-action">
                              {chip.action}
                              <ExternalLink size={11} />
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="ai-message-time">{msg.time}</span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="ai-message-avatar user-avatar">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {showTyping && (
              <div className="ai-message ai">
                <div className="ai-message-avatar">
                  <img src={SmritiAvatar} alt="S" />
                </div>
                <div className="ai-message-bubble typing">
                  <div className="ai-typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <div className="ai-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="ai-text-input"
                placeholder={isListening ? 'Listening... you can also type here' : 'Type your message...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <div className="ai-input-actions">
                <button
                  className={`ai-input-mic ${isListening ? 'active' : ''} ${micMuted ? 'muted' : ''}`}
                  onClick={toggleMic}
                  title={micMuted ? 'Unmute microphone' : isListening ? 'Mute microphone' : 'Talk by voice'}
                >
                  {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  className={`ai-send-btn ${inputText.trim() ? 'active' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            <p className="ai-input-hint">
              Care Agent can make mistakes. Verify important information independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
