import { useState, useRef, useEffect } from "react";
import { Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import { createPortal } from "react-dom";

function speakJapanese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function SegmentPopup({ seg, anchorRef, isVocab, savedWords, onToggleSave, onClose }) {
  const popupRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY - 8, // position above, will shift up once rendered
        left: rect.left + rect.width / 2,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    // Adjust after render so we know popup height
    if (popupRef.current && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popH = popupRef.current.offsetHeight;
      setPos({
        top: rect.top + window.scrollY - popH - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  return createPortal(
    <div
      ref={popupRef}
      style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translateX(-50%)" }}
      className="z-[9999] w-48 bg-card border border-border rounded-xl shadow-2xl p-3 text-left"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isVocab ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
          {isVocab ? "vocab" : "grammar"}
        </span>
        {seg.reading && (
          <span className="font-jp text-xs text-muted-foreground">{seg.reading}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <p className="font-jp text-sm font-bold text-foreground">{seg.text}</p>
          <button
            onClick={(e) => { e.stopPropagation(); speakJapanese(seg.text); }}
            className="p-1 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-all"
            title="Pronounce"
          >
            <Volume2 className="w-3 h-3" />
          </button>
        </div>
        {onToggleSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave({ word: seg.text, reading: seg.reading || "", meaning: seg.meaning || "" }); }}
            className={`shrink-0 p-1 rounded-lg transition-all ${
              savedWords.some((w) => w.word === seg.text)
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground hover:text-primary"
            }`}
          >
            {savedWords.some((w) => w.word === seg.text)
              ? <BookmarkCheck className="w-3.5 h-3.5" />
              : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{seg.meaning}</p>
    </div>,
    document.body
  );
}

export default function LyricLine({ segments, showFurigana, isActive, isPast, savedWords = [], onToggleSave }) {
  const [popup, setPopup] = useState(null); // index of open segment
  const spanRefs = useRef({});

  if (!segments) return null;

  return (
    <div className="relative flex flex-wrap justify-center gap-x-1 gap-y-1">
      {segments.map((seg, i) => {
        const isVocab = seg.type === "vocab";
        const isGrammar = seg.type === "grammar";
        const isAnnotated = isVocab || isGrammar;
        const isOpen = popup === i;

        const baseColor = isActive
          ? "text-primary"
          : isPast
          ? "text-muted-foreground/30"
          : "text-muted-foreground/60";

        const underline = isVocab
          ? "underline decoration-red-400 underline-offset-4"
          : isGrammar
          ? "underline decoration-blue-400 underline-offset-4"
          : "";

        return (
          <span key={i} className="relative inline-flex flex-col items-center">
            {/* Furigana */}
            {showFurigana && seg.reading && (
              <span className="text-[9px] leading-none text-muted-foreground/70 mb-0.5 font-jp">
                {seg.reading}
              </span>
            )}

            <span
              ref={(el) => { if (el) spanRefs.current[i] = el; }}
              onClick={isAnnotated ? (e) => { e.stopPropagation(); setPopup(isOpen ? null : i); } : undefined}
              className={`font-jp text-base transition-all duration-300 ${baseColor} ${underline} ${isAnnotated ? "cursor-pointer hover:opacity-80" : ""}`}
            >
              {seg.text}
            </span>

            {isOpen && seg.meaning && (
              <SegmentPopup
                seg={seg}
                anchorRef={{ current: spanRefs.current[i] }}
                isVocab={isVocab}
                savedWords={savedWords}
                onToggleSave={onToggleSave}
                onClose={() => setPopup(null)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}