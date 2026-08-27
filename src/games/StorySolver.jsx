import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Mic, MicOff, RotateCcw, Volume2 } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { useStoryVoice } from '../hooks/useStoryVoice';
import { loc, pickStory, STORY_COUNT, STORY_LANGS, storyLang } from '../data/pastStories';

const MIN_NARRATE_MS = 4000;
const BACKUP_ADVANCE_MS = 8000;

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function StoryLangChips({ value, onChange }) {
  return (
    <div className="story-lang-chips" role="tablist" aria-label="Story language">
      {STORY_LANGS.map((item) => (
        <button
          key={item.code}
          type="button"
          role="tab"
          aria-selected={value === item.code}
          className={`story-lang-chip ${value === item.code ? 'active' : ''}`}
          onClick={() => onChange(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function StorySolver() {
  const { lang: appLang } = useI18n();
  const { prefs } = usePrefs();
  const gender = prefs.voice?.gender === 'male' ? 'male' : 'female';
  const [storyLangCode, setStoryLangCode] = useState(() => storyLang(appLang));
  const languageName = STORY_LANGS.find((item) => item.code === storyLangCode)?.label || 'English';
  const { speak, stop, prepare, isSpeaking } = useStoryVoice({
    lang: storyLangCode,
    gender,
    languageName,
  });

  const [story, setStory] = useState(null);
  const [beatIndex, setBeatIndex] = useState(0);
  const [phase, setPhase] = useState('ready');
  const [voiceOn, setVoiceOn] = useState(false);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [held, setHeld] = useState(0);
  const [picked, setPicked] = useState(null);
  const spokenKeyRef = useRef('');
  const narrateStartedRef = useRef(0);
  const backupTimerRef = useRef(null);
  const beatIndexRef = useRef(0);
  beatIndexRef.current = beatIndex;

  const t = useCallback((pack) => loc(storyLangCode, pack), [storyLangCode]);
  const beat = story?.beats[beatIndex] || null;
  const total = story?.beats.length || 0;
  const isRiddle = beat?.kind === 'riddle';

  const clearBackup = () => {
    if (backupTimerRef.current) {
      clearTimeout(backupTimerRef.current);
      backupTimerRef.current = null;
    }
  };

  useEffect(() => () => {
    clearBackup();
    stop();
  }, [stop]);

  useEffect(() => {
    if (!beat) return;
    setChoices(shuffle(beat.options || []));
    setPicked(null);
    setFeedback(null);
  }, [beat, story?.id, beatIndex]);

  const openQuiz = useCallback(() => {
    if (phase === 'opening') {
      stop();
      spokenKeyRef.current = '';
      setPhase('narrate');
      return;
    }
    if (phase !== 'narrate') return;
    if (voiceOn && Date.now() - narrateStartedRef.current < MIN_NARRATE_MS) return;
    stop();
    setPhase('quiz');
  }, [phase, stop, voiceOn]);

  const goNext = useCallback(() => {
    if (phase !== 'quiz') return;
    clearBackup();
    stop();
    spokenKeyRef.current = '';
    setPicked(null);
    setFeedback(null);
    const current = beatIndexRef.current;
    const length = story?.beats.length || 0;
    if (current >= length - 1) {
      setPhase('done');
      return;
    }
    setBeatIndex(current + 1);
    setPhase('narrate');
  }, [phase, stop, story?.beats.length]);

  useEffect(() => {
    if (!voiceOn || !story) return;
    if (phase !== 'opening' && phase !== 'narrate') return;
    const key = `${story.id}:${phase}:${beatIndex}:${storyLangCode}:${gender}`;
    if (spokenKeyRef.current === key) return;
    spokenKeyRef.current = key;
    narrateStartedRef.current = Date.now();
    const text = phase === 'opening' ? t(story.opening) : t(beat?.say);
    speak(text, {
      minMs: MIN_NARRATE_MS,
      onEnd: () => {
        setPhase((current) => {
          if (current === 'opening') return 'narrate';
          if (current === 'narrate') return 'quiz';
          return current;
        });
      },
    });
  }, [voiceOn, story, beat, beatIndex, phase, storyLangCode, gender, speak, t]);

  const begin = (withVoice) => {
    clearBackup();
    stop();
    spokenKeyRef.current = '';
    setStory(pickStory());
    setBeatIndex(0);
    setHeld(0);
    setFeedback(null);
    setPicked(null);
    setVoiceOn(withVoice);
    setPhase('opening');
    if (withVoice) prepare();
  };

  const answer = (option) => {
    if (phase !== 'quiz' || picked) return;
    setPicked(option);
    const ok = Boolean(option.ok);
    if (ok) setHeld((n) => n + 1);
    const hint = t(beat.hint);
    const kind = ok
      ? t({
        en: 'Yes. That sits in this memory. We go on.',
        hi: 'हाँ। याद में यही था। कहानी आगे चलती है।',
        as: 'হয়। এইখিনিয়েই সেই মনত আছে। কাহিনী আগবাঢ়ে।',
      })
      : t({
        en: `That’s all right. ${hint}`,
        hi: `कोई बात नहीं। ${hint}`,
        as: `কোনো কথা নাই। ${hint}`,
      });
    setFeedback({ ok, text: kind });
    if (voiceOn) speak(kind, { pauseMs: 200 });
    clearBackup();
    backupTimerRef.current = window.setTimeout(() => {
      goNext();
    }, BACKUP_ADVANCE_MS);
  };

  const reset = () => {
    clearBackup();
    stop();
    setStory(null);
    setPhase('ready');
    setFeedback(null);
    setVoiceOn(false);
    spokenKeyRef.current = '';
  };

  const title = story ? t(story.title) : '';
  const storySoFar = useMemo(() => {
    if (!story) return [];
    const lines = [t(story.opening)];
    const upto = phase === 'opening' ? -1 : beatIndex;
    for (let i = 0; i <= upto && i < story.beats.length; i += 1) {
      lines.push(t(story.beats[i].say));
    }
    return lines;
  }, [story, beatIndex, phase, t]);

  const status = useMemo(() => {
    if (!voiceOn) return t({ en: 'Reading', hi: 'पढ़ रहे हैं', as: 'পঢ়ি আছোঁ' });
    if (isSpeaking) return t({ en: 'The story is being read aloud', hi: 'कहानी आवाज़ में चल रही है', as: 'কাহিনী উচ্চস্বৰে পঢ়া হৈছে' });
    if (phase === 'quiz') return t({ en: 'Your question', hi: 'आपका प्रश्न', as: 'আপোনাৰ প্ৰশ্ন' });
    return t({ en: 'Listening', hi: 'सुन रहे हैं', as: 'শুনি আছোঁ' });
  }, [voiceOn, isSpeaking, phase, t]);

  if (phase === 'ready' || !story) {
    return (
      <div className="game-area story-solver">
        <div className="story-hero">
          <div className="bg-tile-emoji" aria-hidden="true"><BookOpen size={22} /></div>
          <h2>Past stories</h2>
          <p>
            One memory is told all the way through — a courtyard, a ferry, a kitchen, a folk tale —
            then a question from that same scene. After you answer, the story continues.
            {` ${STORY_COUNT} stories in the book.`}
          </p>
          <StoryLangChips value={storyLangCode} onChange={setStoryLangCode} />
          <p className="game-soft-lead">
            Story language is separate from Talk (Care Agent) and Assist. Listen uses this page’s story voice.
          </p>
          <div className="story-start-row">
            <button type="button" className="game-btn-primary story-tap" onClick={() => begin(false)}>
              <MicOff size={18} />
              Read the story
            </button>
            <button type="button" className="game-btn-secondary story-tap" onClick={() => begin(true)}>
              <Mic size={18} />
              Listen to the story
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="game-area story-solver">
        <StoryLangChips value={storyLangCode} onChange={setStoryLangCode} />
        <div className="game-result">
          <h2>{t({ en: 'The memory can rest here.', hi: 'यह याद यहीं ठहर सकती है।', as: 'এই মনত ইয়াতেই জিৰাব পাৰে।' })}</h2>
          <p>{t(story.close)}</p>
          <p className="game-soft-lead">{held} of {total} held gently — never a score of a person.</p>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary story-tap" onClick={() => begin(voiceOn)}>
              <RotateCcw size={16} /> Another story
            </button>
            <button type="button" className="game-btn-secondary story-tap" onClick={reset}>
              All games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-area story-solver">
      <div className="game-inline-head">
        <div>
          <h2>{title}</h2>
          <p className="game-soft-lead">
            {status}
            {phase !== 'opening' ? ` · ${beatIndex + 1} / ${total}` : ''}
          </p>
        </div>
        {phase !== 'opening' && (
          <span className="game-stat-chip">
            {isRiddle
              ? t({ en: 'Paheli', hi: 'पहेली', as: 'সাঁথৰ' })
              : t({ en: 'Memory', hi: 'याद', as: 'মনত' })}
          </span>
        )}
      </div>

      <StoryLangChips value={storyLangCode} onChange={setStoryLangCode} />

      <div className="story-so-far">
        {storySoFar.map((line, index) => (
          <p
            key={`${story.id}-line-${index}`}
            className={index === storySoFar.length - 1 ? 'story-beat-text' : 'story-beat-quiet'}
          >
            {line}
          </p>
        ))}
      </div>

      {(phase === 'opening' || phase === 'narrate') && (
        <p className="story-listen">
          <Volume2 size={16} />
          {voiceOn
            ? t({
              en: 'Listen through this whole breath. The question comes after.',
              hi: 'पूरा अंश सुनिए। प्रश्न बाद में आएगा।',
              as: 'এই উশাহটো শেষলৈকে শুনক। প্ৰশ্ন পাছত আহিব।',
            })
            : t({
              en: 'Read this slowly. When you are ready, take the question.',
              hi: 'धीरे पढ़िए। तैयार हों तो प्रश्न लीजिए।',
              as: 'লাহে লাহে পঢ়ক। সাজু হ’লে প্ৰশ্ন লওক।',
            })}
          <button type="button" className="ss-text-btn" onClick={openQuiz}>
            {phase === 'opening'
              ? t({ en: 'Begin the next part', hi: 'अगला अंश शुरू करें', as: 'পিছৰ অংশ আৰম্ভ কৰক' })
              : t({ en: 'I’m ready for the question', hi: 'प्रश्न के लिए तैयार हूँ', as: 'প্ৰশ্নৰ বাবে সাজু' })}
          </button>
        </p>
      )}

      {phase === 'quiz' && beat && (
        <div className="story-quiz">
          <p className="story-question">{t(beat.ask)}</p>
          <div className="story-options">
            {choices.map((option, optionIndex) => (
              <button
                key={`${story.id}-${beatIndex}-${optionIndex}`}
                type="button"
                className={`story-option story-tap ${picked === option ? (option.ok ? 'ok' : 'soft') : ''}`}
                disabled={Boolean(picked)}
                onClick={() => answer(option)}
              >
                {t(option)}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <>
          <p className={`story-feedback ${feedback.ok ? 'ok' : ''}`}>{feedback.text}</p>
          <button type="button" className="game-btn-primary story-tap story-continue" onClick={goNext}>
            {beatIndex >= total - 1
              ? t({ en: 'Finish the memory', hi: 'याद यहीं बंद करें', as: 'মনত ইয়াতে বন্ধ কৰক' })
              : t({ en: 'Continue the story', hi: 'कहानी आगे बढ़ाएँ', as: 'কাহিনী আগবঢ়াওক' })}
          </button>
        </>
      )}
    </div>
  );
}
