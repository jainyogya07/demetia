import { usePrefs } from '../PrefsContext';
import { LIVE_VOICES } from '../data/liveVoices';

function VoiceToggle() {
  const { prefs, updatePrefs } = usePrefs();
  const gender = prefs.voice?.gender === 'male' ? 'male' : 'female';

  return (
    <div className="ss-voice-switch" role="tablist" aria-label="Companion voice">
      {Object.values(LIVE_VOICES).map((voice) => {
        const isActive = gender === voice.gender;
        return (
          <button
            key={voice.gender}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ss-voice-chip ${isActive ? 'active' : ''}`}
            onClick={() => updatePrefs({ voice: { gender: voice.gender } })}
          >
            {voice.label}
          </button>
        );
      })}
    </div>
  );
}

export default VoiceToggle;
