import { useEffect, useRef, useState } from "react";
import LyricLine from "./LyricLine";
import { buildSegments } from "@/lib/lyricGlossary";

export default function SyncedLyrics({ lines, currentTime, savedWords, onToggleSave }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);
  const [showFurigana, setShowFurigana] = useState(false);

  let activeIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (currentTime >= lines[i].time) { activeIndex = i; break; }
  }

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Lyrics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Click on a word to reveal its meaning.</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-400 rounded inline-block" /> vocab
            <span className="w-3 h-0.5 bg-blue-400 rounded inline-block ml-2" /> grammar
          </div>
          <button
            onClick={() => setShowFurigana((f) => !f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              showFurigana
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            ふりがな {showFurigana ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-72 overflow-y-auto space-y-4 px-4 py-6 rounded-xl bg-secondary/30 border border-border"
      >
        {lines.map((line, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div
              key={i}
              ref={isActive ? activeRef : null}
              className={`transition-all duration-300 ${isActive ? "scale-105" : ""}`}
            >
              <LyricLine
                segments={line.segments || buildSegments(line.japanese)}
                showFurigana={showFurigana}
                isActive={isActive}
                isPast={isPast}
                savedWords={savedWords}
                onToggleSave={onToggleSave}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}