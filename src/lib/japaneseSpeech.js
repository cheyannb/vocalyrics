import { base44 } from "@/api/base44Client";
import speakDeviceJapanese from "@/lib/deviceJapaneseSpeech";

const audioCache = new Map();
export async function getJapaneseAudio(text) {
  if (!(await base44.auth.isAuthenticated())) {
    await speakDeviceJapanese(text);
    return null;
  }
  const key = text.trim();
  if (!audioCache.has(key)) {
    const { data } = await base44.functions.invoke("pronounceJapanese", { text: key });
    if (!data.file_uri) throw new Error(data.error || "Pronunciation is unavailable.");
    audioCache.set(key, data.file_uri);
  }
  const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: audioCache.get(key) });
  return signed_url;
}