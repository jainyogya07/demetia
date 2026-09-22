import { Mic, MessageSquare } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import companionPortrait from '../assets/infinity_pfp.jpg';

function VoiceAgentCard() {
  const { openModule } = useAppNav();

  return (
    <section className="voice-companion-card">
      <div className="voice-top">
        <div className="smriti-avatar">
          <img src={companionPortrait} alt="Care Agent" />
        </div>
        <div className="voice-text">
          <h2>Care Agent</h2>
          <p>I can talk, listen and help you with your day.</p>
          <p>Speak in your language.</p>
        </div>
      </div>

      <button
        type="button"
        className="speak-button"
        onClick={() => openModule('ai', { startVoice: true })}
      >
        <Mic size={24} />
        Speak
      </button>

      <div className="message-box">
        <button type="button" className="type-companion-btn" onClick={() => openModule('ai')}>
          <MessageSquare size={18} />
          Type a message
        </button>
      </div>

      <div className="voice-languages">
        <span>I speak in:</span>
        <button type="button">অসমীয়া</button>
        <button type="button">Khasi</button>
        <button type="button">Mizo</button>
        <button type="button">Manipuri</button>
        <button type="button">Bodo</button>
      </div>

      <div className="voice-note">
        <span>
          Care Agent supports Assamese, Khasi, Mizo, Manipuri, Bodo, Hindi and English.
        </span>
      </div>
    </section>
  );
}

export default VoiceAgentCard;
