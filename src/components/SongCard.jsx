import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const difficultyColors = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SongCard({ song, index }) {
  return (
    <Link
      to={`/songs/${encodeURIComponent(song.title)}`}
      className="group block rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:glow-primary"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {song.title}
          </h3>
          {song.difficulty && (
            <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${difficultyColors[song.difficulty]}`}>
              {song.difficulty}
            </span>
          )}
        </div>
        {song.title_jp && (
          <p className="font-jp text-xs text-muted-foreground mb-2">{song.title_jp}</p>
        )}
        <p className="text-xs text-muted-foreground">{song.artist}</p>
        {song.vocabulary && (
          <p className="text-xs text-primary/70 mt-2">
            {song.vocabulary.length} vocabulary words
          </p>
        )}
      </div>
    </Link>
  );
}