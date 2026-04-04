import { useState } from "react";
import { Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VocabWord({ vocab, isSaved, onToggleSave }) {
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    onToggleSave(vocab);
    if (!isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1000);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-jp text-lg md:text-xl cursor-pointer px-1.5 py-0.5 rounded-lg hover:bg-primary/10 transition-colors text-foreground inline-block border-b-2 border-dashed border-primary/30 hover:border-primary/60">
            {vocab.word}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-card border border-border p-4 rounded-xl shadow-2xl max-w-xs"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
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
              <p className="text-xs text-muted-foreground italic">{vocab.example}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}