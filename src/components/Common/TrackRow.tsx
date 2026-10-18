import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Plus, 
  ListPlus,
  Check,
  Headphones,
  Trash2,
  Mic2
} from 'lucide-react';
import type { Song, Playlist } from '../../types/music';
import { formatTime } from '../../utils/formatTime';
import { usePlayer } from '../../context/PlayerContext';

interface TrackRowProps {
  song: Song;
  index: number;
  playlist?: Playlist;
  showAlbum?: boolean;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  song,
  index,
  playlist,
  showAlbum = true
}) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    toggleLike, 
    isLiked,
    addToQueue,
    playlists,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlayCount,
    setIsLyricsOpen
  } = usePlayer();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  const liked = isLiked(song.id);
  const playCount = getPlayCount(song.id);

  const handlePlayToggle = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, playlist);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    setMenuOpen(false);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleAddToCustomPlaylist = (e: React.MouseEvent, pId: string) => {
    e.stopPropagation();
    addSongToPlaylist(pId, song);
    setShowPlaylistSubmenu(false);
    setMenuOpen(false);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleRemoveFromThisPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist?.isCustom) {
      removeSongFromPlaylist(playlist.id, song.id);
    }
    setMenuOpen(false);
  };

  const handleOpenLyrics = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCurrentSong) {
      playSong(song, playlist);
    }
    setIsLyricsOpen(true);
    setMenuOpen(false);
  };

  return (
    <div
      onClick={handlePlayToggle}
      className={`group grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2.5fr_1.5fr_auto] lg:grid-cols-[16px_4fr_2.5fr_1.5fr_1.5fr_auto] gap-4 px-4 py-2.5 rounded-md items-center text-sm cursor-pointer select-none transition-colors ${
        isCurrentSong
          ? 'bg-white/10 text-[#1ed760]'
          : 'hover:bg-white/5 text-neutral-400 hover:text-white'
      }`}
    >
      {/* 1. Track Index / Play button / Animated Audio Bars */}
      <div className="flex items-center justify-center w-4">
        {isCurrentlyPlaying ? (
          <div className="group-hover:hidden flex items-end gap-[2px] h-3.5 w-3.5">
            <span className="w-[3px] bg-[#1ed760] rounded-sm animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
            <span className="w-[3px] bg-[#1ed760] rounded-sm animate-[bounce_1.1s_ease-in-out_infinite_0.2s] h-2/3" />
            <span className="w-[3px] bg-[#1ed760] rounded-sm animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-4/5" />
          </div>
        ) : (
          <span className={`text-sm tabular-nums group-hover:hidden ${
            isCurrentSong ? 'text-[#1ed760] font-bold' : 'text-neutral-400'
          }`}>
            {index + 1}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayToggle();
          }}
          className="hidden group-hover:flex items-center justify-center text-white"
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>
      </div>

      {/* 2. Title & Artist (with cover thumbnail) */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-10 h-10 rounded object-cover flex-shrink-0 shadow"
        />
        <div className="min-w-0 flex-1">
          <p className={`font-semibold truncate text-sm ${
            isCurrentSong ? 'text-[#1ed760]' : 'text-white'
          }`}>
            {song.title}
          </p>
          <p className="text-xs text-neutral-400 truncate group-hover:text-neutral-300">
            {song.artist}
          </p>
        </div>
      </div>

      {/* 3. Album Name */}
      {showAlbum && (
        <div className="hidden md:block truncate text-neutral-400 group-hover:text-neutral-300 text-sm">
          {song.album}
        </div>
      )}

      {/* 4. Play Count indicator */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-neutral-300 tabular-nums">
        <Headphones className="w-3.5 h-3.5 text-[#1ed760]/80 flex-shrink-0" />
        <span className="font-medium">
          {playCount.toLocaleString()} {playCount === 1 ? 'odsłuchanie' : 'odtworzeń'}
        </span>
      </div>

      {/* 5. Date Added */}
      <div className="hidden lg:block truncate text-neutral-400 text-xs">
        {song.addedAt || 'Niedawno'}
      </div>

      {/* 6. Actions: Like, Duration, More menu */}
      <div className="flex items-center gap-3 justify-end relative">
        {addedNotice && (
          <span className="text-xs text-[#1ed760] font-semibold flex items-center gap-1 animate-pulse">
            <Check className="w-3.5 h-3.5" /> Dodano!
          </span>
        )}

        {/* Like Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song);
          }}
          className={`p-1 transition ${
            liked
              ? 'opacity-100 text-[#1ed760]'
              : 'opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white'
          }`}
          title={liked ? "Usuń z polubionych" : "Polub utwór"}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Duration */}
        <span className="text-xs text-neutral-400 tabular-nums w-10 text-right">
          {formatTime(song.duration)}
        </span>

        {/* More Options Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white transition"
            title="Więcej opcji"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-50 w-56 bg-[#282828] border border-neutral-700 rounded-md shadow-2xl py-1 text-xs text-neutral-200 animate-fade-in"
            >
              <button
                onClick={handleAddToQueue}
                className="w-full text-left px-3 py-2 hover:bg-neutral-700 flex items-center gap-2 transition"
              >
                <ListPlus className="w-4 h-4 text-neutral-400" />
                <span>Dodaj do kolejki</span>
              </button>

              <button
                onClick={handleOpenLyrics}
                className="w-full text-left px-3 py-2 hover:bg-neutral-700 flex items-center gap-2 transition"
              >
                <Mic2 className="w-4 h-4 text-neutral-400" />
                <span>Tekst utworu</span>
              </button>

              <div
                className="relative"
                onMouseEnter={() => setShowPlaylistSubmenu(true)}
                onMouseLeave={() => setShowPlaylistSubmenu(false)}
              >
                <button
                  className="w-full text-left px-3 py-2 hover:bg-neutral-700 flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-neutral-400" />
                    <span>Dodaj do playlisty</span>
                  </div>
                  <span>▸</span>
                </button>

                {showPlaylistSubmenu && (
                  <div className="absolute right-full top-0 w-48 bg-[#282828] border border-neutral-700 rounded-md shadow-2xl py-1 max-h-48 overflow-y-auto">
                    {playlists.map(pl => (
                      <button
                        key={pl.id}
                        onClick={(e) => handleAddToCustomPlaylist(e, pl.id)}
                        className="w-full text-left px-3 py-2 hover:bg-neutral-700 truncate transition text-xs"
                      >
                        {pl.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {playlist?.isCustom && (
                <button
                  onClick={handleRemoveFromThisPlaylist}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2 transition border-t border-neutral-700 mt-1"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Usuń z tej playlisty</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
