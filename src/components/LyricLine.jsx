import { useState, useRef, useEffect } from "react";

export default function LyricLine({ segments, showFurigana, isActive, isPast }) {
  const [popup, setPopup] = useState(null); // { index, rect }
  const lineRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (lineRef.current && !lineRef.current.contains(e.target)) setPopup(null);
    };
    if (popup !== null) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [popup]);

  if (!segments) return null;

  return (
    <div ref={lineRef} className="relative flex flex-wrap justify-center gap-x-1 gap-y-1">
      {segments.map((seg, i) => {
        const isVocab = seg.type === "vocab";
        const isGrammar = seg.type === "grammar";
        const isAnnotated = isVocab || isGrammar;
        const isOpen = popup === i;

        const baseColor = isActive
          ? isVocab ? "text-red-400" : isGrammar ? "text-blue-400" : "text-primary"
          : isPast
          ? isVocab ? "text-red-400/30" : isGrammar ? "text-blue-400/30" : "text-muted-foreground/30"
          : isVocab ? "text-red-400/70" : isGrammar ? "text-blue-400/70" : "text-muted-foreground/60";

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
              onClick={isAnnotated ? (e) => { e.stopPropagation(); setPopup(isOpen ? null : i); } : undefined}
              className={`font-jp text-base transition-all duration-300 ${baseColor} ${underline} ${isAnnotated ? "cursor-pointer hover:opacity-80" : ""}`}
            >
              {seg.text}
            </span>

            {/* Popup */}
            {isOpen && seg.meaning && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 bg-card border border-border rounded-xl shadow-2xl p-3 text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isVocab ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {isVocab ? "vocab" : "grammar"}
                  </span>
                  {seg.reading && (
                    <span className="font-jp text-xs text-muted-foreground">{seg.reading}</span>
                  )}
                </div>
                <p className="font-jp text-sm font-bold text-foreground">{seg.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{seg.meaning}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-border" />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}