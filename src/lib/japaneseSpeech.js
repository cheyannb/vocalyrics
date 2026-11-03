// Voice names and quality labels vary by browser and operating system.
const synthesis = typeof window !== "undefined" ? window.speechSynthesis : null;
let voices = [];
const loadVoices = () => { voices = synthesis?.getVoices() || []; };
if (synthesis) {
  loadVoices();
  synthesis.addEventListener("voiceschanged", loadVoices);
}

function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  let score = voice.default ? 1 : 0;
  if (/natural|neural|premium/.test(name)) score += 100;
  if (/enhanced/.test(name)) score += 80;
  if (/google/.test(name)) score += 60;
  if (/microsoft.*online|online.*microsoft/.test(name)) score += 60;
  if (/compact|espeak|mbrola/.test(name)) score -= 100;
  return score;
}

export function speakJapanese(text) {
  if (!synthesis || !text) return;
  loadVoices();
  const voice = voices
    .filter((item) => /^ja(?:[-_]|$)/i.test(item.lang))
    .sort((a, b) => voiceScore(b) - voiceScore(a))[0];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  if (voice) utterance.voice = voice;
  utterance.rate = 1;
  utterance.pitch = 1;
  synthesis.cancel();
  synthesis.speak(utterance);
}