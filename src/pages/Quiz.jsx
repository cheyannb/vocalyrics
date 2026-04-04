import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RotateCcw, CheckCircle, XCircle, ArrowRight, Settings2, Sparkles } from "lucide-react";
import { SONG_DATA, CATEGORIES } from "../lib/songData";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(source, count = 10) {
  const allVocab = source.flatMap((s) =>
    (s.vocabulary || []).map((v) => ({ ...v, songTitle: s.title }))
  );
  if (allVocab.length < 4) return [];

  const selected = shuffleArray(allVocab).slice(0, Math.min(count, allVocab.length));

  return selected.map((vocab) => {
    const wrongAnswers = shuffleArray(
      allVocab
        .filter((v) => v.meaning !== vocab.meaning)
        .map((v) => v.meaning)
    ).slice(0, 3);

    const options = shuffleArray([vocab.meaning, ...wrongAnswers]);

    return {
      word: vocab.word,
      reading: vocab.reading,
      correctAnswer: vocab.meaning,
      options,
      songTitle: vocab.songTitle,
    };
  });
}

export default function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const startQuiz = () => {
    const source =
      selectedCategory === "All"
        ? SONG_DATA
        : SONG_DATA.filter((s) => s.category === selectedCategory);
    const qs = generateQuestions(source, questionCount);
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setQuizComplete(false);
    setQuizStarted(true);
  };

  const handleAnswer = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setQuizStarted(false);
    setQuizComplete(false);
  };

  // Setup screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Vocabulary Quiz
          </h1>
          <p className="text-muted-foreground text-sm mb-10">
            Test your knowledge of Japanese words from Vocaloid songs
          </p>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 text-left space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="All">All Songs</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      questionCount === n
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
            >
              Start Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Keep practicing!";
    if (percentage >= 90) message = "Amazing! You're a master! 🎉";
    else if (percentage >= 70) message = "Great job! Almost there! ✨";
    else if (percentage >= 50) message = "Good effort! Keep going! 💪";

    return (
      <div className="max-w-lg mx-auto px-6 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Quiz Complete!
          </h2>
          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="text-5xl font-extrabold text-primary mb-2">
            {percentage}%
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            {score} out of {questions.length} correct
          </p>

          <div className="flex gap-3">
            <button
              onClick={startQuiz}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <button
              onClick={restart}
              className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium text-sm hover:bg-secondary/80 transition-colors"
            >
              New Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz screen
  const question = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-primary font-medium">
          Score: {score}/{currentIndex + (answered ? 1 : 0)}
        </span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">
              What does this word mean?
            </p>
            <p className="font-jp text-4xl md:text-5xl font-bold text-foreground mb-3">
              {question.word}
            </p>
            <p className="text-sm text-primary">{question.reading}</p>
            <p className="text-xs text-muted-foreground mt-2">
              From: {question.songTitle}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option, i) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = option === selected;
              let styles = "bg-card border-border hover:border-primary/40";
              if (answered) {
                if (isCorrect) styles = "bg-green-500/10 border-green-500/40";
                else if (isSelected && !isCorrect)
                  styles = "bg-red-500/10 border-red-500/40";
                else styles = "bg-card border-border opacity-50";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`p-4 rounded-xl border text-sm font-medium text-left transition-all ${styles} ${
                    !answered ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-foreground">{option}</span>
                    {answered && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}