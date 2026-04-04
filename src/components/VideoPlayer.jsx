import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoPlayer({ song }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border mb-8 aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${song.youtube_id}?autoplay=1&rel=0`}
          title={song.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-border mb-8 aspect-video bg-black relative cursor-pointer group"
      onClick={() => setPlaying(true)}
    >
      <img
        src={`https://img.youtube.com/vi/${song.youtube_id}/maxresdefault.jpg`}
        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`; }}
        alt={song.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
        <span className="text-white text-sm font-medium drop-shadow">Click to play on YouTube</span>
      </div>
    </div>
  );
}