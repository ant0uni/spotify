import React, { useEffect } from 'react';
import { X, Mic2, Play, Pause, SkipBack, SkipForward, Heart, Headphones } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { ProgressBar } from '../Player/ProgressBar';

export const LyricsModal: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    isLyricsOpen, 
    setIsLyricsOpen,
    toggleLike, 
    isLiked,
    getPlayCount,
    currentTime,
    duration
  } = usePlayer();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLyricsOpen) {
        setIsLyricsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isLyricsOpen, setIsLyricsOpen]);

  if (!isLyricsOpen || !currentSong) return null;

  const liked = isLiked(currentSong.id);
  const playCount = getPlayCount(currentSong.id);

  // Dynamic lyrics lines from track or procedural atmospheric lyrics
  const lyricsList: string[] = currentSong.lyrics && currentSong.lyrics.length > 0
    ? currentSong.lyrics
    : [
        "W rytmie nocy, gdy światła gasną w oddali",
        `Dźwięki ${currentSong.title} wypełniają przestrzeń`,
        `Głęboki bas i harmonia od ${currentSong.artist}`,
        "Cyfrowa melodia niesie nas ponad miastem",
        "Każdy ton to nowa podróż bez granic",
        "Zamknij oczy i zanurz się w czystym brzmieniu",
        "Muzyka, która zostaje w pamięci na zawsze"
      ];

  // Calculate active lyric index based on current progress
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const activeIndex = Math.min(
    lyricsList.length - 1,
    Math.floor(progressRatio * lyricsList.length)
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 select-none animate-fade-in text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-400">
            <Mic2 className="w-5 h-5 text-[#1ed760]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#1ed760]">
              Tekst i Wizualizer na żywo
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#1ed760]">
            <Headphones className="w-3.5 h-3.5" />
            <span>{playCount.toLocaleString()} {playCount === 1 ? 'odsłuchanie' : 'odtworzeń'}</span>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition hover:scale-105"
          title="Zamknij (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Body: Artwork + Animated Visualizer + Lyrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full my-auto">
        {/* Left: Album cover with glow and equalizers */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative group">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl object-cover shadow-2xl transition duration-500 group-hover:scale-105 border border-white/10"
            />
            {/* Glowing background halo */}
            <div 
              className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl -z-10 bg-gradient-to-tr from-[#1ed760] to-purple-600 animate-pulse"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentSong.title}
            </h2>
            <p className="text-lg text-neutral-400 mt-1">
              {currentSong.artist} • <span className="text-neutral-500 text-sm">{currentSong.album}</span>
            </p>
          </div>

          {/* Animated sound wave equalizer */}
          <div className="flex items-end justify-center gap-1.5 h-12 mt-6">
            {[45, 80, 55, 95, 65, 85, 40, 100, 75, 90, 50, 95, 60, 45, 85, 70].map((height, i) => (
              <span
                key={i}
                className="w-1.5 bg-[#1ed760] rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(20, height * (0.5 + ((i % 3) * 0.2)))}%` : '15%',
                  opacity: isPlaying ? 0.95 : 0.3
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Lyrics lines with synchronized highlighting */}
        <div className="space-y-6 text-left overflow-y-auto max-h-[440px] px-4 py-2">
          {lyricsList.map((text, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <p
                key={idx}
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-2xl sm:text-4xl font-extrabold text-[#1ed760] scale-[1.03] origin-left drop-shadow-md'
                    : isPast
                    ? 'text-xl sm:text-2xl font-bold text-white/50'
                    : 'text-xl sm:text-2xl font-bold text-white/25 hover:text-white/60'
                }`}
              >
                {text}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-xl mx-auto w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-6">
          <button
            onClick={() => toggleLike(currentSong)}
            className="p-2 text-neutral-400 hover:text-white transition"
          >
            <Heart className={`w-5 h-5 ${liked ? 'text-[#1ed760] fill-[#1ed760]' : ''}`} />
          </button>

          <button
            onClick={prevTrack}
            className="text-neutral-300 hover:text-white transition"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="text-neutral-300 hover:text-white transition"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <ProgressBar />
      </div>
    </div>
  );
};
