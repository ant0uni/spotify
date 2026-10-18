import React from 'react';
import { X, Trash2, Volume2, Headphones } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentSong, queue, playSong, removeFromQueue, clearQueue, isPlaying, getPlayCount } = usePlayer();

  if (!isOpen) return null;

  // Filter queue into upcoming tracks after current song (or full list)
  const currentIndex = currentSong ? queue.findIndex(s => s.id === currentSong.id) : -1;
  const upcomingTracks = currentIndex !== -1 ? queue.slice(currentIndex + 1) : queue;

  return (
    <aside className="w-80 md:w-96 flex-shrink-0 bg-[#121212] border-l border-neutral-800/80 flex flex-col h-full z-20 select-none animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h3 className="font-bold text-white text-base">
          Kolejka odtwarzania
        </h3>

        <div className="flex items-center gap-1">
          {upcomingTracks.length > 0 && (
            <button
              onClick={clearQueue}
              className="p-1.5 text-neutral-400 hover:text-red-400 transition"
              title="Wyczyść kolejkę"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white transition"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing */}
        <div>
          <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-3">
            Teraz odtwarzane
          </h4>

          {currentSong ? (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/10 text-white">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded object-cover shadow"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-[#1ed760]">
                  {currentSong.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-neutral-400 truncate">
                    {currentSong.artist}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#1ed760] font-semibold tabular-nums">
                    <Headphones className="w-2.5 h-2.5" />
                    {getPlayCount(currentSong.id)}
                  </span>
                </div>
              </div>
              {isPlaying && (
                <Volume2 className="w-4 h-4 text-[#1ed760] animate-pulse flex-shrink-0" />
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">Brak aktywnego utworu</p>
          )}
        </div>

        {/* Upcoming in Queue */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Następne utwory ({upcomingTracks.length})
            </h4>
          </div>

          {upcomingTracks.length > 0 ? (
            <div className="space-y-1">
              {upcomingTracks.map((song, idx) => (
                <div
                  key={`${song.id}-${idx}`}
                  onClick={() => playSong(song)}
                  className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 cursor-pointer transition text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate text-xs group-hover:text-[#1ed760] transition">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 tabular-nums">
                      <Headphones className="w-2.5 h-2.5 text-[#1ed760]/70" />
                      {getPlayCount(song.id)}
                    </span>
                    <span className="text-[11px] text-neutral-400 tabular-nums">
                      {formatTime(song.duration)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(idx + (currentIndex + 1));
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-400 transition"
                      title="Usuń z kolejki"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic py-2">
              Kolejka jest pusta. Dodaj utwory za pomocą menu opcji.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
