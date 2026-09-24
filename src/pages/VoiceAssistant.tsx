import { Mic } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import SmritiAvatar from '../assets/smriti-avatar.svg';

function VoiceAssistant() {
  const { openModule } = useAppNav();

  return (
    <div className="voice-assistant-page">
      <div className="voice-assistant-stage">
        <img
          src={SmritiAvatar}
          alt="Care Agent voice assistant"
          className="voice-assistant-avatar"
        />
        <h1>I'm here to listen</h1>
        <p>Tap the microphone to start a live voice conversation with Care Agent.</p>
        <button
          type="button"
          className="voice-assistant-mic"
          onClick={() => openModule('ai', { startVoice: true })}
        >
          <Mic size={32} />
        </button>
        <p>Tap to speak</p>
      </div>
    </div>
  );
}

export default VoiceAssistant;
