import { Mic, MessageSquare } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useLanguage } from '../context/LanguageContext';
import companionPortrait from '../assets/infinity_pfp.jpg';

function VoiceAgentCard() {
  const { openModule } = useAppNav();
  const { t } = useLanguage();

  return (
    <section className="voice-companion-card">
      <div className="voice-top">
        <div className="smriti-avatar">
          <img src={companionPortrait} alt="Care Agent" />
        </div>
        <div className="voice-text">
          <h2>{t('voiceCompanion')}</h2>
          <p>{t('voiceDescription')}</p>
          <p>{t('speakLanguage')}</p>
        </div>
      </div>

      <button
        type="button"
        className="speak-button"
        onClick={() => openModule('ai', { startVoice: true })}
      >
        <Mic size={24} />
        {t('tapToSpeak')}
      </button>

      <div className="message-box">
        <button type="button" className="type-companion-btn" onClick={() => openModule('ai')}>
          <MessageSquare size={18} />
          {t('typeMessage')}
        </button>
      </div>

      <div className="voice-languages">
        <span>{t('speakIn')}</span>
        <button type="button">অসমীয়া</button>
        <button type="button">Khasi</button>
        <button type="button">Mizo</button>
        <button type="button">Manipuri</button>
        <button type="button">Bodo</button>
      </div>

      <div className="voice-note">
        <span>{t('supportsLanguages')}</span>
      </div>
    </section>
  );
}

export default VoiceAgentCard;
