import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { BookOpen, RotateCcw, CheckCircle, XCircle, TrendingUp, Layers } from "lucide-react";

const masteryLabels = ["New", "Seen", "Learning", "Familiar", "Good", "Mastered"];
const masteryColors = [
  "text-slate-400",
  "text-yellow-400",
  "text-orange-400",
  "text-blue-400",
  "text-green-400",
  "text-primary",
];
const masteryBg = [
  "bg-slate-500/10",
  "bg-yellow-500/10",
  "bg-orange-500/10",
  "bg-blue-500/10",
  "bg-green-500/10",
  "bg-primary/10",
];

function MasteryBar({ words }) {
  const counts = [0, 0, 0, 0, 0, 0];
  words.forEach((w) => counts[w.mastery_level || 0]++);
  const total = words.length || 1;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" /> Mastery Overview
      </h3>
      <div className="space-y-2">
        {masteryLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <span className={`w-16 shrink-0 font-medium ${masteryColors[i]}`}>{label}</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(counts[i] / total) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`h-full rounded-full ${masteryBg[i].replace("/10", "/60")}`}
              />
            </div>
            <span className="w-6 text-right text-muted-foreground">{counts[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Study() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionWords, setSessionWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    base44.entities.SavedVocab.list("-created_date").then((data) => {
      setWords(data);
      setLoading(false);
    });
  }, []);

  const startSession = (filter = "all") => {
    let pool = [...words];
    if (filter === "weak") pool = words.filter((w) => (w.mastery_level || 0) < 3);
    if (filter === "new") pool = words.filter((w) => (w.mastery_level || 0) === 0);
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setSessionWords(pool);
    setCurrentIndex(0);
    setFlipped(false);
    setResults({ correct: 0, incorrect: 0 });
    setSessionComplete(false);
    setSessionStarted(true);
  };

  const handleResult = async (knew) => {
    const word = sessionWords[currentIndex];
    const currentMastery = word.mastery_level || 0;
    const newMastery = knew
      ? Math.min(5, currentMastery + 1)
      : Math.max(0, currentMastery - 1);

    if (newMastery !== currentMastery) {
      await base44.entities.SavedVocab.update(word.id, { mastery_level: newMastery });
      setWords((prev) =>
        prev.map((w) => (w.id === word.id ? { ...w, mastery_level: newMastery } : w))
      );
    }

    setResults((r) => ({
      correct: r.correct + (knew ? 1 : 0),
      incorrect: r.incorrect + (knew ? 0 : 1),
    }));

    if (currentIndex + 1 >= sessionWords.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-lg text-foreground font-semibold mb-2">No saved words yet</p>
        <p className="text-sm text-muted-foreground mb-6">
          Save vocabulary words from songs to start studying.
        </p>
        <Link
          to="/songs"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Browse Songs
        </Link>
      </div>
    );
  }

  // Session complete screen
  if (sessionStarted && sessionComplete) {
    const pct = Math.round((results.correct / sessionWords.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Session Complete!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {results.correct} knew · {results.incorrect} missed · {sessionWords.length} total
          </p>
          <div className="text-5xl font-extrabold text-primary mb-8">{pct}%</div>
          <div className="flex gap-3">
            <button
              onClick={() => startSession("all")}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Study Again
            </button>
            <button
              onClick={() => setSessionStarted(false)}
              className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active flashcard session
  if (sessionStarted && sessionWords.length > 0) {
    const card = sessionWords[currentIndex];
    const mastery = card.mastery_level || 0;

    return (
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">{currentIndex + 1} / {sessionWords.length}</span>
          <button onClick={() => setSessionStarted(false)} className="text-muted-foreground hover:text-foreground text-xs">
            ✕ Exit
          </button>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${(currentIndex / sessionWords.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + "-" + flipped}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => !flipped && setFlipped(true)}
              className={`rounded-2xl border border-border p-8 md:p-12 text-center cursor-pointer select-none transition-all ${
                flipped ? "bg-card" : "bg-card hover:border-primary/40"
              }`}
            >
              {!flipped ? (
                <>
                  <p className="font-jp text-5xl font-bold text-foreground mb-4">{card.word}</p>
                  <p className="text-sm text-primary">{card.reading}</p>
                  {card.song_title && (
                    <p className="text-xs text-muted-foreground mt-3">From: {card.song_title}</p>
                  )}
                  <p className="text-xs text-muted-foreground/50 mt-8">Tap to reveal</p>
                </>
              ) : (
                <>
                  <p className="font-jp text-3xl font-bold text-foreground mb-2">{card.word}</p>
                  <p className="text-sm text-primary mb-4">{card.reading}</p>
                  <div className="w-12 h-px bg-border mx-auto mb-4" />
                  <p className="text-xl text-foreground font-medium">{card.meaning}</p>
                  <div className={`inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs font-medium ${masteryBg[mastery]} ${masteryColors[mastery]}`}>
                    {masteryLabels[mastery]}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mt-6"
          >
            <button
              onClick={() => handleResult(false)}
              className="flex-1 py-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Didn't know
            </button>
            <button
              onClick={() => handleResult(true)}
              className="flex-1 py-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-medium text-sm hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Knew it!
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Dashboard
  const weakWords = words.filter((w) => (w.mastery_level || 0) < 3);
  const newWords = words.filter((w) => (w.mastery_level || 0) === 0);
  const masteredWords = words.filter((w) => (w.mastery_level || 0) === 5);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Study Dashboard</h1>
          <p className="text-sm text-muted-foreground">Review your saved vocabulary with flashcards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Words", value: words.length, color: "text-foreground" },
            { label: "Need Practice", value: weakWords.length, color: "text-orange-400" },
            { label: "Mastered", value: masteredWords.length, color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 text-center">
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MasteryBar words={words} />

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Start a Session
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => startSession("all")}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity text-left flex items-center justify-between"
              >
                <span>All Words</span>
                <span className="opacity-70">{words.length} cards</span>
              </button>
              <button
                onClick={() => startSession("weak")}
                disabled={weakWords.length === 0}
                className="w-full py-3 px-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl text-sm font-medium hover:bg-orange-500/20 transition-colors text-left flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Weak Words</span>
                <span className="opacity-70">{weakWords.length} cards</span>
              </button>
              <button
                onClick={() => startSession("new")}
                disabled={newWords.length === 0}
                className="w-full py-3 px-4 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-sm font-medium hover:bg-yellow-500/20 transition-colors text-left flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>New Words Only</span>
                <span className="opacity-70">{newWords.length} cards</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}