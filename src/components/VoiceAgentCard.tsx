import React from 'react';
import { motion } from 'motion/react';
import { Mic, MessageSquare, Compass, Sun, Heart, Sparkles } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import companionPortrait from '../assets/infinity_pfp.jpg';

export default function VoiceAgentCard() {
  const { openModule } = useAppNav();
  const { t } = useI18n();

  const suggestions = [
    { id: 'next', label: t('voiceCard.sugNext'), icon: Compass, query: 'What is my next activity today?' },
    { id: 'today', label: t('voiceCard.sugToday'), icon: Sun, query: 'Tell me about my schedule and weather today.' },
    { id: 'remember', label: t('voiceCard.sugRemember'), icon: Heart, query: 'Help me remember a family memory or photo.' },
    { id: 'talk', label: t('voiceCard.sugTalk'), icon: Sparkles, query: 'I want to have a gentle chat with you.' },
  ];

  const handleSuggestion = (item) => {
    openModule('ai', { startVoice: false, initialQuery: item.query });
  };

  return (
    <section className="voice-companion-card ss-hero-agent-card">
      <div className="voice-top ss-hero-agent-top">
        <div className="smriti-avatar ss-hero-avatar-wrap">
          <motion.div
            className="ss-avatar-breath-halo"
            animate={{
              scale: [1, 1.14, 1],
              opacity: [0.45, 0.85, 0.45],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <img src={companionPortrait} alt="Care Agent" className="ss-hero-avatar-img" />
          <span className="ss-hero-online-dot" title="Care Agent is listening" />
        </div>

        <div className="voice-text ss-hero-agent-copy">
          <span className="ss-agent-kicker">{t('voiceCard.kicker')}</span>
          <h2 className="ss-agent-headline">{t('voiceCard.headline')}</h2>
          <p className="ss-agent-subtext">{t('voiceCard.subtext')}</p>
        </div>
      </div>

      <div className="ss-hero-action-buttons">
        <motion.button
          type="button"
          className="speak-button ss-hero-speak-btn"
          onClick={() => openModule('ai', { startVoice: true })}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="ss-btn-mic-icon">
            <Mic size={22} />
          </div>
          <div className="ss-btn-labels">
            <strong className="ss-main-btn-label">{t('voiceCard.tapSpeak')}</strong>
            <span className="ss-sub-btn-label">{t('voiceCard.tapSpeakSub')}</span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="type-companion-btn ss-hero-type-btn"
          onClick={() => openModule('ai')}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare size={19} />
          <span>{t('voiceCard.typeMessage')}</span>
        </motion.button>
      </div>

      <div className="ss-hero-suggestions">
        <span className="ss-suggestions-caption">{t('voiceCard.orTap')}</span>
        <div className="ss-suggestions-grid">
          {suggestions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                type="button"
                className="ss-suggestion-chip"
                onClick={() => handleSuggestion(item)}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(23, 107, 88, 0.12)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Icon size={14} className="ss-suggestion-icon" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
