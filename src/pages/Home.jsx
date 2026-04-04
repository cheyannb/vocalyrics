import { Link } from "react-router-dom";
import { Music, Brain, Bookmark, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, SONG_DATA } from "../lib/songData";

const FeatureCard = ({ icon: Icon, title, description, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link
      to={to}
      className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:glow-primary"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  </motion.div>
);

export default function Home() {
  const totalWords = SONG_DATA.reduce((acc, s) => acc + (s.vocabulary?.length || 0), 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsLoggedIn);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Learn Japanese Through Music
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 leading-tight">
              Voca<span className="text-primary text-glow">Lyrics</span>
            </h1>
            <p className="font-jp text-2xl md:text-3xl text-muted-foreground mb-4">
              ボカロで日本語を学ぼう
            </p>
            <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg leading-relaxed mb-10">
              Master Japanese vocabulary by studying your favorite Vocaloid songs. 
              Watch, learn, and quiz yourself — all in one place.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/songs"
                className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
              >
                Start Learning
              </Link>
              <Link
                to="/quiz"
                className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors border border-border"
              >
                Take a Quiz
              </Link>
              {!isLoggedIn && (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="px-8 py-3.5 bg-accent/10 text-accent border border-accent/30 rounded-xl font-semibold text-sm hover:bg-accent/20 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Log In / Register
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-8 md:gap-16 mt-14"
          >
            {[
              { value: SONG_DATA.length, label: "Songs" },
              { value: totalWords + "+", label: "Words" },
              { value: CATEGORIES.length, label: "Categories" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={Music}
            title="Song Library"
            description="Browse 25+ Vocaloid songs with embedded videos and curated vocabulary."
            to="/songs"
            delay={0.4}
          />
          <FeatureCard
            icon={Brain}
            title="Quiz Mode"
            description="Test your knowledge with interactive quizzes from your song vocabulary."
            to="/quiz"
            delay={0.5}
          />
          <FeatureCard
            icon={Bookmark}
            title="Vocabulary"
            description="Save and track words you want to remember across all songs."
            to="/vocabulary"
            delay={0.6}
          />
        </div>

        {/* Categories Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Song Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const count = SONG_DATA.filter(s => s.category === cat.name).length;
              return (
                <Link
                  key={cat.name}
                  to={`/songs?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{count} songs</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}