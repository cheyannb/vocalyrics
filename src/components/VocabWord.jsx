import { useState, useRef, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function VocabWord({ vocab, isSaved, onToggleSave }) {
  const [justSaved, setJustSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSave = (e) => {
    e.stopPropagation();
    onToggleSave(vocab);
    if (!isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1000);
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      <span
        onClick={() => setOpen((o) => !o)}
        className="font-jp text-lg md:text-xl cursor-pointer px-1.5 py-0.5 rounded-lg hover:bg-primary/10 transition-colors text-foreground inline-block border-b-2 border-dashed border-primary/30 hover:border-primary/60 select-none"
      >
        {vocab.word}
      </span>

      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-card border border-border rounded-xl shadow-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-jp text-lg font-bold text-foreground">{vocab.word}</p>
              <p className="text-sm text-primary font-medium">{vocab.reading}</p>
            </div>
            <button
              onClick={handleSave}
              className={`shrink-0 p-1.5 rounded-lg transition-all ${
                isSaved || justSaved
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground hover:text-primary"
              }`}
            >
              {isSaved || justSaved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-foreground font-medium">{vocab.meaning}</p>
          {vocab.example && (
            <p className="text-xs text-muted-foreground italic mt-1">{vocab.example}</p>
          )}
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
        </div>
      )}
    </div>
  );
}