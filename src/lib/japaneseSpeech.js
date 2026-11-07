import { base44 } from "@/api/base44Client";
import speakDeviceJapanese from "@/lib/deviceJapaneseSpeech";

const audioCache = new Map();
const pending = new Map();
let guestCheck = null;

function isGuest() {
  if (!guestCheck) {
    guestCheck = base44.auth.isAuthenticated().then((ok) => !ok).catch(() => true);
  }
  return guestCheck;
}

async function generate(key) {
  const { data } = await base44.functions.invoke("pronounceJapanese", { text: key });
  if (!data?.audio) throw new Error(data?.error || "Pronunciation is unavailable.");
  return data.audio;
}

function loadJapaneseAudio(key) {
  if (!pending.has(key)) {
    pending.set(
      key,
      generate(key)
        .then((audio) => {
          audioCache.set(key, audio);
          return audio;
        })
        .finally(() => pending.delete(key))
    );
  }
  return pending.get(key);
}

// Audio already generated for this text, returned synchronously so a click plays instantly.
export function getCachedJapaneseAudio(text) {
  return audioCache.get((text || "").trim()) || null;
}

// Warms the cache ahead of a click: hovering, touching, or opening a word's popup.
export async function prefetchJapaneseAudio(text) {
  const key = (text || "").trim();
  if (!key || audioCache.has(key) || pending.has(key)) return;
  if (await isGuest()) return;
  loadJapaneseAudio(key).catch(() => {});
}

export async function getJapaneseAudio(text) {
  const key = text.trim();
  if (audioCache.has(key)) return audioCache.get(key);
  if (!(await isGuest())) return loadJapaneseAudio(key);
  await speakDeviceJapanese(text);
  return null;
}