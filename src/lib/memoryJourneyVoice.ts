// ============================================================
// SMRITI SAARTHI
// MEMORY JOURNEY VOICE
// Browser-native speech for prototype
// ============================================================

const VOICE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  mni: "mni-IN",
  kh: "en-IN",
  mz: "en-IN",
};

export function getSpeechLanguage(language) {
  return VOICE_MAP[language] || "en-IN";
}

export function speakMemoryInstruction(
  text,
  language = "en"
) {
  if (!text || typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    console.warn(
      "Speech synthesis is not supported by this browser."
    );
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = getSpeechLanguage(language);
  utterance.rate = 0.78;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices =
    window.speechSynthesis.getVoices();

  const matchingVoice = voices.find(
    (voice) =>
      voice.lang?.toLowerCase() ===
      getSpeechLanguage(language).toLowerCase()
  );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopMemoryVoice() {
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }
}