import { useEffect, useRef } from "react";

export default function SyncedLyrics({ lines, currentTime }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  // Find the active line index
  let activeIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (currentTime >= lines[i].time) {
      activeIndex = i;
      break;
    }
  }

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="h-64 overflow-y-auto space-y-2 px-2 py-4 rounded-xl bg-secondary/30 border border-border"
    >
      {lines.map((line, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <p
            key={i}
            ref={isActive ? activeRef : null}
            className={`font-jp text-center text-lg transition-all duration-300 ${
              isActive
                ? "text-primary font-bold scale-105 text-glow"
                : isPast
                ? "text-muted-foreground/40"
                : "text-muted-foreground/70"
            }`}
          >
            {line.japanese}
          </p>
        );
      })}
    </div>
  );
}