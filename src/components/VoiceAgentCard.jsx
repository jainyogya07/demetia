import { Mic, MessageSquare } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import SmritiAvatar from '../assets/smriti-avatar.svg';

function VoiceAgentCard() {
  const { openModule } = useAppNav();

  return (
    <div className="voice-agent-card ss-voice-card">
      <div className="ss-voice-hero">
        <div className="ss-voice-orb" aria-hidden="true">
          <img src={SmritiAvatar} alt="" />
        </div>
        <div>
          <h3 className="voice-agent-title">Care Agent</h3>
          <p className="voice-agent-description">Voice companion. Speak when you want.</p>
        </div>
      </div>
      <div className="ss-wave" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className="voice-agent-actions">
        <button
          type="button"
          className="voice-button"
          onClick={() => openModule('ai', { startVoice: true })}
        >
          <Mic size={16} />
          <span>Speak</span>
        </button>
        <button
          type="button"
          className="message-button"
          onClick={() => openModule('ai')}
        >
          <MessageSquare size={16} />
          <span>Type</span>
        </button>
      </div>
      <div className="voice-agent-language">
        Assamese · Khasi · Mizo · Manipuri · Bodo · Hindi · English
      </div>
    </div>
  );
}

export default VoiceAgentCard;
