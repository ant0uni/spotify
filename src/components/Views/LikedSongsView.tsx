import React from 'react';
import { Play, Pause, Heart, Clock, Headphones } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackRow } from '../Common/TrackRow';
import { formatTotalDuration } from '../../utils/formatTime';

export const LikedSongsView: React.FC = () => {
  const { likedSongs, currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isLikedPlaying = isPlaying && likedSongs.some(s => s.id === currentSong?.id);

  const handlePlayLiked = () => {
    if (likedSongs.length === 0) return;
    if (isLikedPlaying) {
      togglePlay();
    } else {
      playSong(likedSongs[0]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28 select-none">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-indigo-900 via-indigo-950 to-[#121212] flex flex-col sm:flex-row items-end gap-6">
        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center shadow-2xl flex-shrink-0">
          <Heart className="w-20 h-20 text-white fill-white" />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="text-xs uppercase font-bold tracking-wider text-white/80">
            Playlista
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none truncate py-1">
            Polubione utwory
          </h1>
          <p className="text-sm text-neutral-300 mt-2">
            Wszystkie Twoje ulubione utwory w jednym wygodnym miejscu.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-2">
            <span className="text-white font-bold">Użytkownik</span>
            <span>•</span>
            <span>{likedSongs.length} utworów</span>
            {likedSongs.length > 0 && (
              <>
                <span>•</span>
                <span className="text-neutral-300">{formatTotalDuration(likedSongs)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-6 sm:px-8 py-5 flex items-center gap-6 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
        <button
          onClick={handlePlayLiked}
          disabled={likedSongs.length === 0}
          className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          title={isLikedPlaying ? "Wstrzymaj" : "Odtwórz polubione utwory"}
        >
          {isLikedPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-8 pt-4">
        {likedSongs.length > 0 ? (
          <div>
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2.5fr_1.5fr_auto] lg:grid-cols-[16px_4fr_2.5fr_1.5fr_1.5fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <span className="text-center">#</span>
              <span>Tytuł</span>
              <span className="hidden md:block">Album</span>
              <span className="hidden md:flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" /> Odtworzenia
              </span>
              <span className="hidden lg:block">Data dodania</span>
              <div className="flex justify-end pr-8">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              {likedSongs.map((song, idx) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={idx}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900/30 rounded-xl border border-neutral-800 p-8">
            <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Nie masz jeszcze polubionych utworów
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Kliknij ikonę serduszka przy dowolnym utworze, aby dodać go do tej listy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
