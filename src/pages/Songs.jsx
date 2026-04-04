import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { SONG_DATA, CATEGORIES } from "../lib/songData";
import SongCard from "../components/SongCard";

export default function Songs() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "All";
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filtered = useMemo(() => {
    return SONG_DATA.filter((song) => {
      const matchesSearch =
        !search ||
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.title_jp?.includes(search) ||
        song.artist.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || song.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || song.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Song Library
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose a song to start learning Japanese vocabulary
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">No songs found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((song, i) => (
            <motion.div
              key={song.title + song.youtube_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <SongCard song={song} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}