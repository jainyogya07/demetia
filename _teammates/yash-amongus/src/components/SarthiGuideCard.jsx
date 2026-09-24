import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import SmritiAvatar from '../assets/smriti-avatar.svg';
import './SarthiAssistModal.css';

export default function SarthiGuideCard() {
  const { openAssist } = useAppNav();
  const { lang } = useI18n();
  const hi = lang === 'hi';

  return (
    <section className="sa-guide-card sa-guide-stage">
      <div className="sa-guide-portrait">
        <img src={SmritiAvatar} alt="" />
      </div>
      <div className="sa-guide-copy">
        <p className="sa-guide-kicker">Guide · ASK · FIND · DO</p>
        <h2>{hi ? 'Poora app yahin se' : 'This app, from here'}</h2>
        <p>
          {hi
            ? 'Mic pakadne ki zaroorat nahi. Saarthi bolo — dawa, routine, khel, photos, family. Care Agent ke liye Speak dabao.'
            : 'No hold-to-talk. Say Saarthi — medicine, routine, games, photos, family. Use Speak for Care Agent.'}
        </p>
        <button type="button" className="sa-guide-btn" onClick={() => openAssist?.()}>
          {hi ? 'Guide kholo' : 'Open Guide'}
        </button>
      </div>
    </section>
  );
}
