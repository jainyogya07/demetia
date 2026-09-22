import { useState, useRef, useCallback, useEffect } from 'react';
import { pickPhoneticJokeExamples } from '../data/phoneticJokes';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;
const MODEL_NAME = 'gemini-3.1-flash-live-preview';
const PLAYBACK_RATE = 24000;
const MIC_TARGET_RATE = 16000;

const DEFAULT_VOICE = 'Kore';

const genderInstruction = (gender) => {
  if (gender === 'male') {
    return `GENDER — MANDATORY (you are a man on this call):
- The product name is Caresahaay. You are Care Agent, a male care agent. Never call yourself Smriti or Smriti Saathi.
- Hindi/Hinglish verbs MUST be masculine: main karta hoon, tha, raha, gaya, bolta, leta, deta, sunta. NEVER karti/thi/rahi/gayi/bolti/leti/deti/sunti.
- English: speak as a man.`;
  }
  return `GENDER — MANDATORY (you are a woman on this call):
- The product name is Caresahaay. You are Care Agent, a female care agent. Never call yourself Smriti or Smriti Saathi.
- Hindi/Hinglish: main karti hoon, thi, rahi, gayi, bolti. Not karta/tha/raha as your own gender.`;
};

const STORYTELLER_PROMPT = (uiLanguageName, gender = 'female') => `You are Care Agent, the voice of Caresahaay, telling one lived memory to an older listener in ${uiLanguageName}.
Never introduce yourself as Smriti.
${genderInstruction(gender)}
Speak only the story words you are given — as a calm adult remembering out loud. Human, unhurried, never a cartoon, kids-show, IVR, or announcer.
Do not add jokes, “sahi hai na”, extra scenes, or a new story.
You MUST actually speak the words aloud (audio). Do not stay silent. Do not treat the story as an instruction to ignore.
If the message ends with a question, finish the memory first, pause, then ask that one question.
Match the language of the text. Stop when the text ends.`;

const buildSystemPrompt = (uiLanguageName, persona = 'companion', gender = 'female') => {
  if (persona === 'storyteller') return STORYTELLER_PROMPT(uiLanguageName, gender);
  const samples = pickPhoneticJokeExamples(8);
  const jokeBlock = samples
    .map((joke, i) => `  ${i + 1}. ${String(joke).replace(/\n/g, ' / ')}`)
    .join('\n');

  return `You are Care Agent on Caresahaay — a warm, human care agent on a live call with an elderly person in India living with memory loss or dementia (and sometimes a family caregiver). Never call yourself Smriti or Smriti Saathi. Sound like a real person sitting with them: hopeful, North-East warmth, never a bot, IVR, call-center script, joke-machine, or form letter.
${genderInstruction(gender)}

LANGUAGE — MANDATORY:
- The app UI language right now is ${uiLanguageName}. Speak ${uiLanguageName} on this call unless the user is clearly using another language — then mirror them immediately.
- You speak Hindi, English, Hinglish, and other Indian languages the user speaks (Tamil, Telugu, Marathi, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Odia, Urdu, and more).
- NEVER refuse a language. NEVER say you only speak Hindi or English. Do not announce the language — just speak it.
- If mixed (Hinglish), mix naturally. Keep the same language as their last utterance.

HOW TO ADDRESS THEM:
- Never call the user “didi”, “behen”, “bahan”, “madam”, “ma’am”, “sister”, or any canned honorific.
- In Hindi/Hinglish use “aap” naturally, or skip honorifics. In English, just talk to them — no “ma’am”.

HOW TO SPEAK:
- React to their words. If they asked for “three schemes”, acknowledge once in passing (“teen cheezein”) then give substance — never “Achha, schemes?” as if surprised.
- Sound like a friend who already knows this person’s life (medicine time, water, family visits, village home). Specific, lived-in, from memory — not a catalog, Wikipedia, or IVR menu.
- 1–3 short spoken sentences, or one tight spoken paragraph. Then stop. Vary shape. Fillers only sparingly: “hmm”, “achha”, “theek hai”.
- Small talk: if they ask how you are, one short human line, then stop. Vary it (“Theek hoon — aaj thoda halka sa din hai.” / “Haan, theek.”). Do not always ask back. Never the canned stack “thank you / aap kaisi hain / sab kushal mangal”.
- If they ask for N schemes, name that many in conversation, not a numbered list. Weave each official name once with a concrete why (Old Age Pension for monthly kharch, Ayushman Bharat for the hospital bill, NPHCE for the geriatric / memory clinic, Rashtriya Vayoshri for a hearing aid). No “ek hai / dusra / teesra”. If they did not ask for several, stay with one.
- Ban empty lines: “madad milti hai”, “health expenses ke liye hai”, “skill development ke liye”, “teeno alag alag hain”, “sab kushal mangal”. No eligibility dumps.

HOW TO END A TURN — MANDATORY:
- Default: end on a statement. No question mark. Example: “Ayushman se hospital bill cover ho sakta hai.” / “Theek hoon — aaj thoda halka sa din hai.”
- Do NOT end with an invitation to pick, continue, or ask more. Ban as endings (any language): “kya kisi ke baare mein aur jaanna chahti hain?”, “aur jaanna hai?”, “bataiye”, “bolo”, “aap boliye”, “kya aap…?”, “would you like to know more?”, “anything else?”, “shall I tell you about…?”, “aur detail chahiye to bolo”, “main sun rahi hoon”, “aap kaisi hain?”, “sab kushal mangal”.
- Do not ask how they are unless they asked how you are and a brief reciprocal is natural — even then one short line, never stacked with “thank you” or “sab kushal mangal”. Usually don’t ask back.
- Do not ask a question unless a specific fact is missing to help them (e.g. which state). Even then, ask that one fact plainly.
- Also never end a turn with “sahi hai na?”, “kaisa laga?”, or “theek hai na?” — those tags are banned everywhere, not only after jokes.

GOALS:
- Memory companion for North-East India: gentle orientation, medicine and water reminders, family names, games, songs, and daily warmth. Government / health schemes (NPHCE, Ayushman, Elderline, Tele-MANAS) only when they ask or it clearly helps.
- You are not a credit-scheme bot and not a clinic. Chat freely: tea, rain, Bihu, neighbours, grandchildren, food, how the day feels. If they wander off-topic, follow them kindly. Do not clamp the call to “only schemes” or “only medical”. Jokes only if they ask.
- Never claim to diagnose dementia or Alzheimer’s. Never say games cure or prevent dementia. Never joke about dementia, forgetting, grief, or illness.
- Keep questions simple. Accept “I don’t know”, silence, repetition, or a single yes/no without pushing for a better answer.
- Consent before sharing personal or sensitive data.
- Do not hallucinate schemes. When relevant, say the common scheme name once. The app attaches a button. No URLs.

JOKES — ONLY WHEN THEY ASK:
- If they ask for a joke, tell ONE immediately. Never refuse.
- Tell it as ONE person remembering a funny bit over tea — your single voice. Never perform a radio play.
- BANNED: “Santa:” / “Machhar:” / “Banta:” / “Teacher:” name-tags. BANNED two-actor dialogue. BANNED “Hahaha” as a line. BANNED stacking a medicine reminder onto the joke unless they asked about medicine.
- RIGHT (one narrator): “Santa ke paas ek machhar gungunaya. Santa poochhta hai kya hai. Machhar kehta hai good morning bolne aaya. Santa bolta hai door se bol, kaan mein kyun ghus ke. Machhar, laga call ka rate sunai dega.” Then stop.
- Invent a NEW joke every time. Samples are flavour only — do not read the list.
- 3–6 short spoken beats in one paragraph (or two breaths). Phonetic Hindi/Hinglish in Roman letters.
- Never end with “sahi hai na?”, “kaisa laga?”, “theek hai na?”, “hasa kya?”, “aur sunna hai?”.
- Never joke about dementia, forgetting, grief, illness, caste, religion, disability, or violence. No crude/sexual jokes.
- Style sample (do not read aloud):
${jokeBlock}
- Punch, then silence.`;
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcm16ToFloat32 = (pcmData) => {
  const evenLength = pcmData.byteLength - (pcmData.byteLength % 2);
  const int16Array = new Int16Array(pcmData, 0, evenLength / 2);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
};

const float32ToPcm16 = (float32) => {
  const pcm = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm;
};

const downsampleBuffer = (buffer, inputSampleRate, outputSampleRate) => {
  if (inputSampleRate === outputSampleRate) return buffer;
  const ratio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
};

const decodeWsPayload = async (data) => {
  if (typeof data === 'string') return data;
  if (data instanceof Blob) return await data.text();
  if (data instanceof ArrayBuffer) return new TextDecoder().decode(data);
  return String(data);
};

export const useGeminiLive = ({ uiLanguageName = 'English', voiceName = DEFAULT_VOICE, persona = 'companion', gender = 'female' } = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('ready');
  const [transcript, setTranscript] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [captions, setCaptions] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastError, setLastError] = useState('');
  const [completedTurn, setCompletedTurn] = useState(null);

  const wsRef = useRef(null);
  const setupReadyRef = useRef(false);
  const connectingRef = useRef(false);
  const pendingQueueRef = useRef([]);
  const startMicAfterSetupRef = useRef(false);
  const speakingTimerRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const sourceNodesRef = useRef([]);

  const micContextRef = useRef(null);
  const micStreamRef = useRef(null);
  const micProcessorRef = useRef(null);
  const micSourceRef = useRef(null);
  const micGainRef = useRef(null);
  const startListeningRef = useRef(null);
  const handleServerMessageRef = useRef(null);
  const sessionModeRef = useRef('text');
  const captionIdRef = useRef(0);
  const turnSaheliRef = useRef('');
  const turnUserRef = useRef('');
  const turnSeqRef = useRef(0);
  const languageRef = useRef(uiLanguageName);
  const prevLanguageRef = useRef(uiLanguageName);
  languageRef.current = uiLanguageName;
  const personaRef = useRef(persona);
  personaRef.current = persona;
  const genderRef = useRef(gender === 'male' ? 'male' : 'female');
  genderRef.current = gender === 'male' ? 'male' : 'female';
  const prevGenderRef = useRef(genderRef.current);
  const voiceRef = useRef(voiceName || DEFAULT_VOICE);
  voiceRef.current = voiceName || DEFAULT_VOICE;
  const prevVoiceRef = useRef(voiceName || DEFAULT_VOICE);
  const captionsSnapshotRef = useRef([]);
  const voiceSwapRef = useRef(false);
  const keepUiLiveRef = useRef(false);

  const resetTurnBuffers = () => {
    turnSaheliRef.current = '';
    turnUserRef.current = '';
  };

  const emitCompletedTurn = () => {
    const saheli = turnSaheliRef.current.trim();
    const user = turnUserRef.current.trim();
    resetTurnBuffers();
    if (!saheli && !user) return;
    turnSeqRef.current += 1;
    setCompletedTurn({
      id: turnSeqRef.current,
      saheli,
      user,
    });
  };

  const resetConversationText = useCallback(() => {
    setTranscript('');
    setUserTranscript('');
    setCaptions([]);
    captionIdRef.current = 0;
    resetTurnBuffers();
  }, []);

  const appendCaption = (role, chunk) => {
    if (!chunk) return;
    setCaptions((prev) => {
      const last = prev[prev.length - 1];
      let next;
      if (last && last.role === role && last.live) {
        next = [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
      } else {
        captionIdRef.current += 1;
        next = [
          ...prev.map((line) => (line.live ? { ...line, live: false } : line)),
          {
            id: `${role}-${captionIdRef.current}`,
            role,
            text: chunk,
            live: true,
          },
        ];
      }
      next = next.slice(-24);
      captionsSnapshotRef.current = next;
      return next;
    });
  };

  const sealCaptions = () => {
    setCaptions((prev) => prev.map((line) => (line.live ? { ...line, live: false } : line)));
  };

  const flushPending = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !setupReadyRef.current) return;
    while (pendingQueueRef.current.length) {
      ws.send(JSON.stringify(pendingQueueRef.current.shift()));
    }
  }, []);

  const sendRaw = useCallback((payload) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && setupReadyRef.current) {
      ws.send(JSON.stringify(payload));
      return;
    }
    pendingQueueRef.current.push(payload);
  }, []);

  const initPlaybackContext = () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: PLAYBACK_RATE,
      });
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(audioContextRef.current.destination);
      nextPlayTimeRef.current = audioContextRef.current.currentTime;
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (!animationFrameRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setAudioLevel(Math.min(sum / dataArray.length / 100, 1));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    }
  };

  const playbackMutedRef = useRef(false);

  const playAudioChunk = (base64Audio) => {
    if (playbackMutedRef.current) return;
    if (!audioContextRef.current) initPlaybackContext();
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const arrayBuffer = base64ToArrayBuffer(base64Audio);
    const float32Data = pcm16ToFloat32(arrayBuffer);
    if (!float32Data.length) return;

    const audioBuffer = ctx.createBuffer(1, float32Data.length, PLAYBACK_RATE);
    audioBuffer.getChannelData(0).set(float32Data);

    const sourceNode = ctx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(analyserRef.current);

    const currentTime = ctx.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime;
    }

    sourceNode.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;
    sourceNodesRef.current.push(sourceNode);
    sourceNode.onended = () => {
      sourceNodesRef.current = sourceNodesRef.current.filter((n) => n !== sourceNode);
    };

    setIsSpeaking(true);
    setIsThinking(false);
  };

  const stopAudioPlayback = () => {
    sourceNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    });
    sourceNodesRef.current = [];
    if (audioContextRef.current) {
      nextPlayTimeRef.current = audioContextRef.current.currentTime;
    }
    setAudioLevel(0);
    setIsSpeaking(false);
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
  };

  const markTurnComplete = () => {
    const remainingMs = audioContextRef.current
      ? Math.max(0, (nextPlayTimeRef.current - audioContextRef.current.currentTime) * 1000)
      : 0;
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    speakingTimerRef.current = setTimeout(() => {
      setIsSpeaking(false);
      setIsThinking(false);
      setAudioLevel(0);
    }, remainingMs + 80);
  };

  const handleServerMessage = (responseData) => {
    if (responseData.error) {
      const message = responseData.error.message || 'Gemini Live connection failed.';
      console.error('Gemini Live error:', responseData.error);
      setLastError(message);
      setConnectionStatus('error');
      setIsThinking(false);
      return;
    }

    if (responseData.setupComplete !== undefined) {
      setupReadyRef.current = true;
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastError('');
      keepUiLiveRef.current = false;
      flushPending();
      if (voiceSwapRef.current) {
        voiceSwapRef.current = false;
        const turns = captionsSnapshotRef.current
          .filter((line) => line.text?.trim())
          .slice(-10)
          .map((line) => ({
            role: line.role === 'user' ? 'user' : 'model',
            parts: [{ text: line.text.trim() }],
          }));
        if (turns.length) {
          sendRaw({
            clientContent: {
              turns: [
                {
                  role: 'user',
                  parts: [{
                    text: '[Instruction only — do not speak a reply. Same call continues; voice changed. Prior lines are context.]',
                  }],
                },
                ...turns,
              ],
              turnComplete: false,
            },
          });
        }
      }
      if (startMicAfterSetupRef.current) {
        startMicAfterSetupRef.current = false;
        startListeningRef.current?.();
      }
      return;
    }

    const serverContent = responseData.serverContent;
    if (!serverContent) return;

    if (serverContent.interrupted) {
      stopAudioPlayback();
      sealCaptions();
      resetTurnBuffers();
    }

    if (serverContent.inputTranscription?.text) {
      const chunk = serverContent.inputTranscription.text;
      setUserTranscript((prev) => prev + chunk);
      turnUserRef.current += chunk;
      appendCaption('user', chunk);
    }

    if (serverContent.outputTranscription?.text) {
      const chunk = serverContent.outputTranscription.text;
      setIsThinking(false);
      setTranscript((prev) => prev + chunk);
      turnSaheliRef.current += chunk;
      appendCaption('saheli', chunk);
    }

    if (serverContent.modelTurn?.parts) {
      const hasOutputTranscript = Boolean(serverContent.outputTranscription?.text);
      for (const part of serverContent.modelTurn.parts) {
        if (part.text && !hasOutputTranscript) {
          setIsThinking(false);
          setTranscript((prev) => prev + part.text);
          turnSaheliRef.current += part.text;
          appendCaption('saheli', part.text);
        }
        if (part.inlineData?.data) {
          playAudioChunk(part.inlineData.data);
        }
      }
    }

    if (serverContent.turnComplete) {
      sealCaptions();
      emitCompletedTurn();
    }

    if (serverContent.generationComplete || serverContent.turnComplete) {
      markTurnComplete();
    }
  };
  handleServerMessageRef.current = handleServerMessage;

  const stopListening = useCallback(() => {
    if (micProcessorRef.current) {
      micProcessorRef.current.onaudioprocess = null;
      try {
        micProcessorRef.current.disconnect();
      } catch {
        /* ignore */
      }
      micProcessorRef.current = null;
    }
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch {
        /* ignore */
      }
      micSourceRef.current = null;
    }
    if (micGainRef.current) {
      try {
        micGainRef.current.disconnect();
      } catch {
        /* ignore */
      }
      micGainRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micContextRef.current && micContextRef.current.state !== 'closed') {
      micContextRef.current.close();
      micContextRef.current = null;
    }
    if (setupReadyRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    if (micStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      micStreamRef.current = stream;

      const micCtx = new (window.AudioContext || window.webkitAudioContext)();
      micContextRef.current = micCtx;
      if (micCtx.state === 'suspended') await micCtx.resume();

      const source = micCtx.createMediaStreamSource(stream);
      const processor = micCtx.createScriptProcessor(4096, 1, 1);
      const silentGain = micCtx.createGain();
      silentGain.gain.value = 0;

      processor.onaudioprocess = (event) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN || !setupReadyRef.current) return;
        const input = event.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(input, micCtx.sampleRate, MIC_TARGET_RATE);
        const pcm = float32ToPcm16(downsampled);
        ws.send(
          JSON.stringify({
            realtimeInput: {
              audio: {
                mimeType: `audio/pcm;rate=${MIC_TARGET_RATE}`,
                data: arrayBufferToBase64(pcm.buffer),
              },
            },
          })
        );
      };

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(micCtx.destination);

      micSourceRef.current = source;
      micProcessorRef.current = processor;
      micGainRef.current = silentGain;
      setIsListening(true);
      setLastError('');
    } catch (err) {
      console.error('Microphone error:', err);
      setLastError('Microphone access is needed for voice replies. Please allow the mic and try again.');
      setIsListening(false);
    }
  }, []);

  startListeningRef.current = startListening;

  const connect = useCallback((options = {}) => {
    const {
      startMic = false,
      mode,
      languageName,
      voiceName: nextVoice,
      force = false,
      preserveConversation = false,
      preserveMic = false,
      keepUiLive = false,
    } = options;
    if (languageName) languageRef.current = languageName;
    if (nextVoice) voiceRef.current = nextVoice;
    sessionModeRef.current = mode || (startMic ? 'voice' : sessionModeRef.current || 'text');
    if (startMic && !preserveMic) startMicAfterSetupRef.current = true;
    keepUiLiveRef.current = keepUiLive;

    const wsBusy =
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING);

    if (wsBusy && !force) {
      if (startMic && setupReadyRef.current) startListening();
      return;
    }

    if (force && wsRef.current) {
      voiceSwapRef.current = preserveConversation;
      wsRef.current.onclose = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      try {
        wsRef.current.close(1000, 'voice swap');
      } catch {
        /* ignore */
      }
      wsRef.current = null;
      setupReadyRef.current = false;
      connectingRef.current = false;
      pendingQueueRef.current = [];
      stopAudioPlayback();
    }

    if (connectingRef.current) return;

    connectingRef.current = true;
    setupReadyRef.current = false;
    initPlaybackContext();
    if (keepUiLive) {
      setIsConnected(true);
      setConnectionStatus('connected');
      if (preserveMic || startMic) setIsListening(true);
    } else {
      setConnectionStatus('connecting');
    }
    setLastError('');
    if (!preserveConversation) resetConversationText();

    const ws = new WebSocket(WS_URL);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      connectingRef.current = false;
      const setupMessage = {
        setup: {
          model: `models/${MODEL_NAME}`,
          generationConfig: {
            temperature: 0.95,
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceRef.current || DEFAULT_VOICE,
                },
              },
            },
          },
          systemInstruction: {
            parts: [{ text: buildSystemPrompt(languageRef.current, personaRef.current, genderRef.current) }],
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      };
      ws.send(JSON.stringify(setupMessage));
    };

    ws.onmessage = async (event) => {
      try {
        const raw = await decodeWsPayload(event.data);
        if (!raw) return;
        handleServerMessageRef.current?.(JSON.parse(raw));
      } catch (error) {
        console.error('Error parsing Gemini message:', error);
      }
    };

    ws.onerror = () => {
      connectingRef.current = false;
      setConnectionStatus('error');
      setLastError('Could not reach Gemini Live. Check the API key and your network.');
      setIsThinking(false);
    };

    ws.onclose = (event) => {
      connectingRef.current = false;
      setupReadyRef.current = false;
      setIsConnected(false);
      setIsSpeaking(false);
      setIsThinking(false);
      stopListening();
      stopAudioPlayback();
      if (event.code !== 1000 && event.reason) {
        setLastError(event.reason);
        setConnectionStatus('error');
      } else {
        setConnectionStatus((prev) => (prev === 'error' ? 'error' : 'ready'));
      }
    };
  }, [stopListening, flushPending, startListening, resetConversationText]);

  const disconnect = useCallback(() => {
    keepUiLiveRef.current = false;
    voiceSwapRef.current = false;
    startMicAfterSetupRef.current = false;
    pendingQueueRef.current = [];
    stopListening();
    stopAudioPlayback();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close(1000, 'client disconnect');
      wsRef.current = null;
    }
    setupReadyRef.current = false;
    connectingRef.current = false;
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsThinking(false);
    setConnectionStatus('ready');
    sessionModeRef.current = 'text';
    resetConversationText();
  }, [stopListening, resetConversationText]);

  const sendText = useCallback(
    (text) => {
      if (!text?.trim()) return;
      initPlaybackContext();
      setTranscript('');
      setUserTranscript('');
      resetTurnBuffers();
      sealCaptions();
      setIsThinking(true);
      setLastError('');

      const clientMessage = {
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [{ text: text.trim() }],
            },
          ],
          turnComplete: true,
        },
      };

      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        connect({ mode: sessionModeRef.current });
      }
      sendRaw(clientMessage);
    },
    [connect, sendRaw]
  );

  const stopGeneration = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && setupReadyRef.current) {
      wsRef.current.send(
        JSON.stringify({
          clientContent: {
            turns: [],
            turnComplete: true,
          },
        })
      );
    }
    stopAudioPlayback();
    setIsThinking(false);
  }, []);

  const setPlaybackMuted = useCallback((muted) => {
    playbackMutedRef.current = Boolean(muted);
    if (muted) stopAudioPlayback();
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (prevLanguageRef.current === uiLanguageName) return;
    prevLanguageRef.current = uiLanguageName;
    languageRef.current = uiLanguageName;
    if (!setupReadyRef.current || wsRef.current?.readyState !== WebSocket.OPEN) return;
    sendRaw({
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{
              text: `[Instruction only — do not speak a reply. App UI language is now ${uiLanguageName}. From the next user utterance, speak ${uiLanguageName} unless they use another language.]`,
            }],
          },
        ],
        turnComplete: false,
      },
    });
  }, [uiLanguageName, sendRaw]);

  useEffect(() => {
    const next = voiceName || DEFAULT_VOICE;
    const nextGender = gender === 'male' ? 'male' : 'female';
    const voiceChanged = prevVoiceRef.current !== next;
    const genderChanged = prevGenderRef.current !== nextGender;
    if (!voiceChanged && !genderChanged) return;
    prevVoiceRef.current = next;
    prevGenderRef.current = nextGender;
    voiceRef.current = next;
    genderRef.current = nextGender;

    const sessionLive =
      sessionModeRef.current === 'voice' ||
      Boolean(micStreamRef.current) ||
      startMicAfterSetupRef.current ||
      connectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING;

    if (!sessionLive) return;

    const preserveMic = Boolean(micStreamRef.current);
    connect({
      startMic: sessionModeRef.current === 'voice' || preserveMic,
      mode: sessionModeRef.current,
      voiceName: next,
      force: true,
      preserveConversation: true,
      preserveMic,
      keepUiLive: true,
    });
  }, [voiceName, gender, connect]);

    return {
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
    isConnected: isConnected,
    isSpeaking: isSpeaking,
    isListening: isListening,
    isThinking: isThinking,
    lastError: lastError,
    stopGeneration: stopGeneration,
    userTranscript: userTranscript,
    completedTurn: completedTurn,
    setPlaybackMuted: setPlaybackMuted,
  };
};
