import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Popup({ anchorRef, seg, isVocab }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, []);

  if (!pos) return null;

  return createPortal(
    <div
      className="fixed z-[9999] w-48 bg-card border border-border rounded-xl shadow-2xl p-3 text-left -translate-x-1/2"
      style={{ top: pos.top, left: pos.left }}
    >
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
    </div>,
    document.body
  );
}

export default function LyricLine({ segments, showFurigana, isActive, isPast }) {
  const [popup, setPopup] = useState(null);
  const spanRefs = useRef({});
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
            {showFurigana && seg.reading && (
              <span className="text-[9px] leading-none text-muted-foreground/70 mb-0.5 font-jp">
                {seg.reading}
              </span>
            )}
            <span
              ref={el => { if (isAnnotated) spanRefs.current[i] = el; }}
              onClick={isAnnotated ? (e) => { e.stopPropagation(); setPopup(isOpen ? null : i); } : undefined}
              className={`font-jp text-base transition-all duration-300 ${baseColor} ${underline} ${isAnnotated ? "cursor-pointer hover:opacity-80" : ""}`}
            >
              {seg.text}
            </span>
            {isOpen && seg.meaning && (
              <Popup
                anchorRef={{ current: spanRefs.current[i] }}
                seg={seg}
                isVocab={isVocab}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}