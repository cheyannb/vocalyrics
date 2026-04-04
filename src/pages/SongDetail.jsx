import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { SONG_DATA } from "../lib/songData";
import VocabWord from "../components/VocabWord";
import VideoPlayer from "../components/VideoPlayer";
import SyncedLyrics from "../components/SyncedLyrics";
import { toast } from "sonner";

const difficultyColors = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SongDetail() {
  const { songTitle } = useParams();
  const song = SONG_DATA.find((s) => s.title === decodeURIComponent(songTitle));
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    loadSavedWords();
  }, []);

  const loadSavedWords = async () => {
    const saved = await base44.entities.SavedVocab.list();
    setSavedWords(saved);
    setLoading(false);
  };

  const toggleSave = async (vocab) => {
    const existing = savedWords.find((w) => w.word === vocab.word);
    if (existing) {
      await base44.entities.SavedVocab.delete(existing.id);
      setSavedWords((prev) => prev.filter((w) => w.id !== existing.id));
      toast("Word removed from vocabulary");
    } else {
      const created = await base44.entities.SavedVocab.create({
        word: vocab.word,
        reading: vocab.reading,
        meaning: vocab.meaning,
        song_title: song?.title || "",
        song_id: song?.youtube_id || "",
        mastery_level: 0,
      });
      setSavedWords((prev) => [...prev, created]);
      toast("Word saved to vocabulary!");
    }
  };

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-muted-foreground text-lg mb-4">Song not found</p>
        <Link to="/songs" className="text-primary hover:underline">
          Back to songs
        </Link>
      </div>
    );
  }

  const isWordSaved = (word) => savedWords.some((w) => w.word === word);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
      {/* Back */}
      <Link
        to="/songs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to songs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {song.title}
            </h1>
            {song.title_jp && (
              <p className="font-jp text-lg text-muted-foreground mt-1">
                {song.title_jp}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">{song.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            {song.difficulty && (
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border ${difficultyColors[song.difficulty]}`}
              >
                {song.difficulty}
              </span>
            )}
            <a
              href={song.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              YouTube
            </a>
          </div>
        </div>

        {/* Video */}
        <VideoPlayer song={song} onTimeUpdate={setCurrentTime} />

        {/* Synced Lyrics */}
        {song.lyrics_lines && song.lyrics_lines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">Lyrics</h2>
            <SyncedLyrics lines={song.lyrics_lines} currentTime={currentTime} />
          </div>
        )}

        {/* Vocabulary Section */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Key Vocabulary
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Hover over a word to see its meaning. Click the bookmark to save it.
              </p>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {song.vocabulary?.length || 0} words
            </span>
          </div>

          {/* Interactive Word Cloud */}
          {song.vocabulary && song.vocabulary.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-8">
              {song.vocabulary.map((vocab, i) => (
                <VocabWord
                  key={i}
                  vocab={vocab}
                  isSaved={isWordSaved(vocab.word)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No vocabulary data available yet.
            </p>
          )}

          {/* Vocabulary Table */}
          {song.vocabulary && song.vocabulary.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Word
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Reading
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Meaning
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground w-16">
                      Save
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {song.vocabulary.map((vocab, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-jp font-semibold text-foreground">
                        {vocab.word}
                      </td>
                      <td className="py-3 px-4 text-primary text-xs">
                        {vocab.reading}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {vocab.meaning}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleSave(vocab)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isWordSaved(vocab.word)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          {isWordSaved(vocab.word) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}