import { Volume2, Repeat } from "lucide-react";

function speakJapanese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function LessonLine({ line, index }) {
  const annotated = (line.segments || []).filter(
    (s) => s.type === "vocab" || s.type === "grammar"
  );

  const timestamp = `${Math.floor(line.time / 60)}:${String(
    Math.floor(line.time % 60)
  ).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
            <span className="font-bold text-primary">#{index + 1}</span>
            <span>{timestamp}</span>
            {line.segments === null && (
              <span className="inline-flex items-center gap-1">
                <Repeat className="w-3 h-3" /> repeat
              </span>
            )}
          </div>
          <p className="font-jp text-lg font-bold text-foreground leading-relaxed">
            {line.japanese}
          </p>
        </div>
        <button
          onClick={() => speakJapanese(line.japanese)}
          className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-all shrink-0"
          title="Listen to this line"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {line.context && (
        <p className="text-sm text-muted-foreground italic bg-primary/10 border-l-2 border-primary/50 rounded-r-lg px-3 py-2 mb-3 leading-relaxed">
          {line.context}
        </p>
      )}

      {annotated.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-2">
          {annotated.map((seg, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl bg-background/60 border border-border p-3"
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                  seg.type === "vocab"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {seg.type}
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-jp font-bold text-foreground">{seg.text}</span>
                  {seg.reading && (
                    <span className="font-jp text-xs text-muted-foreground">
                      {seg.reading}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {seg.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}