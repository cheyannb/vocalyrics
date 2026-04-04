import { useState, useEffect } from "react";
import { Trash2, Search, BookOpen, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const masteryLabels = ["New", "Seen", "Learning", "Familiar", "Good", "Mastered"];
const masteryColors = [
  "bg-muted text-muted-foreground",
  "bg-yellow-500/10 text-yellow-400",
  "bg-orange-500/10 text-orange-400",
  "bg-blue-500/10 text-blue-400",
  "bg-green-500/10 text-green-400",
  "bg-primary/10 text-primary",
];

export default function Vocabulary() {
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    const words = await base44.entities.SavedVocab.list("-created_date");
    setSavedWords(words);
    setLoading(false);
  };

  const deleteWord = async (id) => {
    await base44.entities.SavedVocab.delete(id);
    setSavedWords((prev) => prev.filter((w) => w.id !== id));
    toast("Word removed");
  };

  const updateMastery = async (id, level) => {
    await base44.entities.SavedVocab.update(id, { mastery_level: level });
    setSavedWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, mastery_level: level } : w))
    );
  };

  const filtered = savedWords
    .filter(
      (w) =>
        !search ||
        w.word?.includes(search) ||
        w.reading?.toLowerCase().includes(search.toLowerCase()) ||
        w.meaning?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return 0; // already sorted by -created_date
      if (sortBy === "mastery") return (a.mastery_level || 0) - (b.mastery_level || 0);
      if (sortBy === "alphabetical") return (a.word || "").localeCompare(b.word || "");
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Vocabulary
          </h1>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {savedWords.length} words
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Words you've saved from songs. Track your mastery level for each one.
        </p>

        {savedWords.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              No saved words yet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Go to a song and save some vocabulary words!
            </p>
            <Link
              to="/songs"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Browse Songs
            </Link>
          </div>
        ) : (
          <>
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search words..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="newest">Newest First</option>
                <option value="mastery">By Mastery</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Word List */}
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((word) => (
                  <motion.div
                    key={word.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-jp text-lg font-bold text-foreground">
                            {word.word}
                          </span>
                          <span className="text-xs text-primary">
                            {word.reading}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {word.meaning}
                        </p>
                        {word.song_title && (
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            From: {word.song_title}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Mastery selector */}
                        <select
                          value={word.mastery_level || 0}
                          onChange={(e) =>
                            updateMastery(word.id, Number(e.target.value))
                          }
                          className={`text-xs px-2.5 py-1 rounded-lg border-0 focus:outline-none ${
                            masteryColors[word.mastery_level || 0]
                          }`}
                        >
                          {masteryLabels.map((label, i) => (
                            <option key={i} value={i}>
                              {label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteWord(word.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}