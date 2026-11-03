function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  return (/neural|natural|premium|enhanced/.test(name) ? 100 : 0)
    + (/google|microsoft|siri/.test(name) ? 20 : 0)
    + (voice.default ? 5 : 0);
}

export default async function speakDeviceJapanese(text) {
  if (!("speechSynthesis" in window)) {
    throw new Error("This browser does not support device pronunciation.");
  }
  const synthesis = window.speechSynthesis;
  let voices = synthesis.getVoices();
  if (!voices.length) {
    voices = await new Promise((resolve) => {
      const finish = () => {
        clearTimeout(timer);
        synthesis.removeEventListener("voiceschanged", finish);
        resolve(synthesis.getVoices());
      };
      const timer = setTimeout(finish, 1000);
      synthesis.addEventListener("voiceschanged", finish);
    });
  }
  const japaneseVoices = voices.filter((voice) => /^ja(?:[-_]|$)/i.test(voice.lang));
  japaneseVoices.sort((a, b) => voiceScore(b) - voiceScore(a));
  if (voices.length && !japaneseVoices.length) {
    throw new Error("Add a Japanese voice in your device’s speech settings to hear pronunciation.");
  }
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.95;
  if (japaneseVoices[0]) utterance.voice = japaneseVoices[0];
  await new Promise((resolve, reject) => {
    utterance.onend = resolve;
    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted") resolve();
      else reject(new Error("Device pronunciation could not play. Please check your Japanese voice settings."));
    };
    synthesis.speak(utterance);
  });
}