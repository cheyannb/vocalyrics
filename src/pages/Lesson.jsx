import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ListOrdered, Sparkles, Puzzle } from "lucide-react";
import { SONG_DATA } from "@/lib/songData";
import LessonLine from "@/components/lesson/LessonLine";

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-500/20 text-emerald-400",
  Intermediate: "bg-amber-500/20 text-amber-400",
  Advanced: "bg-red-500/20 text-red-400",
};

export default function Lesson() {
  const { songTitle } = useParams();
  const song = SONG_DATA.find(
    (s) => s.title === decodeURIComponent(songTitle || "")
  );

  if (!song || !song.lyrics_lines) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Lesson not available
        </h1>
        <p className="text-muted-foreground mb-6">
          No line-by-line lesson exists for this song yet.
        </p>
        <Link to="/songs" className="text-primary hover:underline">
          ← Back to Songs
        </Link>
      </div>
    );
  }

  // Reuse breakdown segments for repeated lines (chorus repeats have no segments)
  const cache = {};
  const resolved = song.lyrics_lines.map((line) => {
    if (line.segments) {
      cache[line.japanese] = line.segments;
      return line;
    }
    return { ...line, segments: cache[line.japanese] || null };
  });

  const vocabPoints = resolved.reduce(
    (n, l) => n + (l.segments || []).filter((s) => s.type === "vocab").length,
    0
  );
  const grammarPoints = resolved.reduce(
    (n, l) => n + (l.segments || []).filter((s) => s.type === "grammar").length,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to={`/songs/${encodeURIComponent(song.title)}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to song
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-primary mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Line-by-Line Lesson
          </span>
        </div>
        <h1 className="font-jp text-3xl font-bold text-foreground text-glow">
          {song.title_jp}
        </h1>
        <p className="text-muted-foreground mt-1">
          {song.title} · {song.artist}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              DIFFICULTY_STYLES[song.difficulty] || "bg-secondary text-muted-foreground"
            }`}
          >
            {song.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border px-3 py-1 rounded-full">
            <ListOrdered className="w-3.5 h-3.5" /> {resolved.length} lines
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> {vocabPoints} vocabulary points
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border px-3 py-1 rounded-full">
            <Puzzle className="w-3.5 h-3.5" /> {grammarPoints} grammar points
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500/60 inline-block" /> vocabulary
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500/60 inline-block" /> grammar
          </span>
        </div>
      </motion.div>

      <div className="space-y-4">
        {resolved.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.3) }}
          >
            <LessonLine line={line} index={i} />
          </motion.div>
        ))}
      </div>

      {song.vocabulary && song.vocabulary.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Key Vocabulary Recap
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {song.vocabulary.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-secondary/30 p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-jp font-bold text-foreground">{v.word}</p>
                  <p className="text-xs text-muted-foreground font-jp">{v.reading}</p>
                </div>
                <p className="text-sm text-muted-foreground text-right">{v.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}