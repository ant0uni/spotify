import React from 'react';
import { Heart, Disc, Headphones } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const TrackInfo: React.FC = () => {
  const { currentSong, toggleLike, isLiked, getPlayCount } = usePlayer();

  if (!currentSong) {
    return (
      <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
        <div className="w-14 h-14 bg-neutral-800 rounded flex items-center justify-center text-neutral-600">
          <Disc className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-xs text-neutral-500">
          Nie wybrano utworu
        </div>
      </div>
    );
  }

  const liked = isLiked(currentSong.id);
  const playCount = getPlayCount(currentSong.id);

  return (
    <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[30%]">
      <img
        src={currentSong.coverUrl}
        alt={currentSong.title}
        className="w-14 h-14 rounded object-cover shadow-md flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h4 className="text-white text-sm font-semibold truncate hover:underline cursor-pointer">
          {currentSong.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-neutral-400 text-xs truncate hover:underline cursor-pointer">
            {currentSong.artist}
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#1ed760] font-semibold tabular-nums">
            <Headphones className="w-2.5 h-2.5" />
            {playCount}
          </span>
        </div>
      </div>
      <button
        onClick={() => toggleLike(currentSong)}
        className="p-1.5 text-neutral-400 hover:text-white transition group flex-shrink-0"
        title={liked ? "Usuń z polubionych" : "Dodaj do polubionych"}
      >
        <Heart
          className={`w-5 h-5 transition-transform group-hover:scale-110 active:scale-90 ${
            liked ? 'text-[#1ed760] fill-[#1ed760]' : 'hover:text-white'
          }`}
        />
      </button>
    </div>
  );
};

