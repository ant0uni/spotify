import React from 'react';
import { Play, Pause } from 'lucide-react';
import type { Playlist } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface SongCardProps {
  playlist: Playlist;
  onOpen: () => void;
  isRound?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ playlist, onOpen, isRound = false }) => {
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
      className="group relative bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg cursor-pointer transition-all duration-300 flex flex-col"
    >
      {/* Cover image container */}
      <div className="relative mb-3 aspect-square w-full shadow-lg overflow-hidden">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className={`w-full h-full object-cover transition duration-300 ${
            isRound ? 'rounded-full' : 'rounded-md'
          }`}
        />

        {/* Hover play button */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isCurrentlyPlaying
              ? 'opacity-100 translate-y-0 shadow-lg'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          title={isCurrentlyPlaying ? "Wstrzymaj" : "Odtwórz"}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Info */}
      <h3 className="font-bold text-white text-sm truncate mb-1">
        {playlist.title}
      </h3>
      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
        {playlist.description}
      </p>
    </div>
  );
};
