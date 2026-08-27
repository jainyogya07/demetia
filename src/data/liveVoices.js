/** Gemini Live voices. Aoede = warm natural female. Charon = male. */
export const LIVE_VOICES = {
  female: { gender: 'female', voiceName: 'Aoede', label: 'Female' },
  male: { gender: 'male', voiceName: 'Charon', label: 'Male' },
};

export function voiceNameForGender(gender) {
  return gender === 'male' ? LIVE_VOICES.male.voiceName : LIVE_VOICES.female.voiceName;
}
