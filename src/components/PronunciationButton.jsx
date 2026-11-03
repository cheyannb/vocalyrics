import { useEffect, useRef, useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import { getJapaneseAudio } from "@/lib/japaneseSpeech";

let activeAudio = null;
export default function PronunciationButton({ text, title = "Pronounce", className }) {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState(null);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  useEffect(() => {
    if (!src || !audioRef.current) return;
    activeAudio?.pause();
    activeAudio = audioRef.current;
    audioRef.current.play().catch(() => {}); // Controls remain available if autoplay is blocked.
    return () => audioRef.current?.pause();
  }, [src]);
  async function pronounce(event) {
    event.stopPropagation();
    setLoading(true);
    setError("");
    try {
      activeAudio?.pause();
      const url = await getJapaneseAudio(text);
      if (url) setSrc(url);
    } catch (failure) {
      setError(failure.response?.data?.error || failure.message || "Could not play pronunciation.");
    } finally { setLoading(false); }
  }
  return (
    <span className="inline-flex min-w-0 max-w-full flex-col items-start gap-1">
      <button type="button" onClick={pronounce} disabled={loading} title={title} aria-label={title} className={className}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
      </button>
      {src && <audio ref={audioRef} src={src} controls aria-label="AI-generated Japanese pronunciation" className="h-8 w-36 max-w-full" onError={() => setError("Audio could not be played. Tap pronounce to retry.")} />}
      {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
    </span>
  );
}