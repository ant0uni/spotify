import React from 'react';
import { Play, Pause } from 'lucide-react';
import type { Playlist } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface QuickPlayCardProps {
  playlist: Playlist;
  onOpen: () => void;
}

export const QuickPlayCard: React.FC<QuickPlayCardProps> = ({ playlist, onOpen }) => {
  const { currentPlaylist, isPlaying, playSong, togglePlay } = usePlayer();

  const isCurrentPlaylist = currentPlaylist?.id === playlist.id;
  const isCurrentlyPlaying = isCurrentPlaylist && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaylist) {
      togglePlay();
    } else if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist);
    }
  };

  return (
    <div
      onClick={onOpen}
      className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition-colors duration-200"
    >
      <img
        src={playlist.coverUrl}
        alt={playlist.title}
        className="w-16 h-16 object-cover shadow-lg flex-shrink-0"
      />
      <span className="font-bold text-sm text-white truncate flex-1 pr-2">
        {playlist.title}
      </span>

      {/* Floating green play button on hover */}
      <button
        onClick={handlePlayClick}
        className={`mr-4 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
          isCurrentlyPlaying
            ? 'opacity-100 scale-100'
            : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
        }`}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        )}
      </button>
    </div>
  );
};
