import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

function loadYouTubeApi() {
  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }
}

export default function VideoPlayer({ song, onTimeUpdate }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const iframeId = `yt-player-${song.youtube_id}`;

  useEffect(() => {
    if (!playing) return;

    const attachPlayer = () => {
      if (playerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady: (event) => {
            const player = event.target;
            // the embed starts muted so every browser lets it play right away
            player.playVideo();
            // then restore sound; if the browser refuses audible autoplay it
            // pauses the video, so fall back to silent playback rather than
            // leaving the viewer with a play button
            setTimeout(() => {
              try {
                player.unMute();
                player.setVolume(100);
                setTimeout(() => {
                  // 2 = paused: the browser refused sound, so resume silently
                  if (player.getPlayerState() === 2) {
                    player.mute();
                    player.playVideo();
                  }
                }, 600);
              } catch (e) {
                /* keep the muted playback running */
              }
            }, 400);
            if (onTimeUpdate) {
              intervalRef.current = setInterval(() => {
                const t = playerRef.current?.getCurrentTime?.();
                if (t != null) onTimeUpdate(t);
              }, 250);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      attachPlayer();
    } else {
      loadYouTubeApi();
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        attachPlayer();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      playerRef.current = null;
    };
  }, [playing, song.youtube_id]);

  if (playing) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border mb-8 aspect-video bg-black">
        <iframe
          id={iframeId}
          src={`https://www.youtube.com/embed/${song.youtube_id}?autoplay=1&mute=1&rel=0&playsinline=1&enablejsapi=1`}
          title={song.title}
          className="w-full h-full"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
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
        <span className="text-white text-sm font-medium drop-shadow">Click to play</span>
      </div>
    </div>
  );
}