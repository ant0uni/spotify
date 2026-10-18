import React, { useState } from 'react';
import { Play, Pause, Shuffle, Clock, Music, Headphones, Trash2, Edit2, Check, X, Sparkles, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackRow } from '../Common/TrackRow';
import { formatTotalDuration } from '../../utils/formatTime';

interface PlaylistViewProps {
  playlistId: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId }) => {
  const { 
    playlists, 
    currentPlaylist, 
    isPlaying, 
    playSong, 
    togglePlay, 
    isShuffle, 
    toggleShuffle,
    getPlayCount,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
    topPlayedSongs
  } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-24">
        <Music className="w-16 h-16 text-neutral-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Nie znaleziono playlisty</h3>
        <p className="text-sm text-neutral-400">Ta playlista mogła zostać usunięta lub zmieniono jej identyfikator.</p>
      </div>
    );
  }

  const isCurrentPlaylist = currentPlaylist?.id === playlist.id;
  const isCurrentlyPlaying = isCurrentPlaylist && isPlaying;

  const totalPlays = playlist.songs.reduce((acc, s) => acc + getPlayCount(s.id), 0);

  const handlePlayPlaylist = () => {
    if (playlist.songs.length === 0) return;

    if (isCurrentPlaylist) {
      togglePlay();
    } else {
      playSong(playlist.songs[0], playlist);
    }
  };

  const handleStartEdit = () => {
    setEditTitle(playlist.title);
    setEditDesc(playlist.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updatePlaylist(playlist.id, editTitle.trim(), editDesc.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć playlistę "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
    }
  };

  // Recommended tracks not yet in this playlist
  const recommendedTracks = topPlayedSongs
    .filter(s => !playlist.songs.some(ps => ps.id === s.id))
    .slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto pb-28 select-none">
      {/* Hero Header with dynamic gradient */}
      <div className={`p-6 sm:p-8 bg-gradient-to-b ${playlist.gradient} to-[#121212] flex flex-col sm:flex-row items-end gap-6`}>
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-lg shadow-2xl flex-shrink-0"
        />

        <div className="flex flex-col gap-2 min-w-0 flex-1 w-full">
          <span className="text-xs uppercase font-bold tracking-wider text-white/80">
            {playlist.isCustom ? 'Własna playlista' : 'Playlista'}
          </span>

          {isEditing ? (
            <div className="space-y-3 py-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Nazwa playlisty"
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-2xl font-bold text-white focus:outline-none focus:border-[#1ed760]"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Opis playlisty"
                rows={2}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#1ed760]"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1ed760] text-black font-bold text-xs hover:scale-105 transition"
                >
                  <Check className="w-3.5 h-3.5" /> Zapisz
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
                >
                  <X className="w-3.5 h-3.5" /> Anuluj
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none truncate py-1">
                {playlist.title}
              </h1>
              <p className="text-sm text-neutral-300 mt-2 line-clamp-2">
                {playlist.description}
              </p>
            </>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90 mt-2">
            <span className="text-white font-bold">{playlist.isCustom ? 'Ty' : 'Spotify'}</span>
            <span>•</span>
            <span>{playlist.songs.length} utworów</span>
            {playlist.songs.length > 0 && (
              <>
                <span>•</span>
                <span className="text-neutral-300">{formatTotalDuration(playlist.songs)}</span>
              </>
            )}
            <span>•</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[#1ed760] font-bold">
              <Headphones className="w-3 h-3" />
              {totalPlays.toLocaleString()} odtworzeń razem
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="px-6 sm:px-8 py-5 flex items-center justify-between bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePlayPlaylist}
            disabled={playlist.songs.length === 0}
            className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            title={isCurrentlyPlaying ? "Wstrzymaj playlistę" : "Odtwórz playlistę"}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={toggleShuffle}
            className={`p-2 transition ${
              isShuffle ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Odtwarzanie losowe"
          >
            <Shuffle className="w-6 h-6" />
          </button>
        </div>

        {playlist.isCustom && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEdit}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
              title="Edytuj szczegóły playlisty"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition"
              title="Usuń playlistę"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Song Table */}
      <div className="px-4 sm:px-8 pt-4">
        {playlist.songs.length > 0 ? (
          <div>
            {/* Table Header */}
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

            {/* Song rows */}
            <div className="space-y-0.5">
              {playlist.songs.map((song, idx) => (
                <TrackRow
                  key={`${song.id}-${idx}`}
                  song={song}
                  index={idx}
                  playlist={playlist}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-900/30 rounded-xl border border-neutral-800 p-8">
            <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Ta playlista jest jeszcze pusta
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              Dodaj do niej utwory z innych playlist za pomocą menu z trzema kropkami (⋮) lub wybierz z poniższych rekomendacji.
            </p>

            {/* Recommended songs to add */}
            {recommendedTracks.length > 0 && (
              <div className="max-w-xl mx-auto text-left border-t border-neutral-800 pt-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#1ed760] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Proponowane utwory do dodania</span>
                </div>
                <div className="space-y-2">
                  {recommendedTracks.map(recSong => (
                    <div
                      key={recSong.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-800/40 hover:bg-neutral-800 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={recSong.coverUrl}
                          alt={recSong.title}
                          className="w-10 h-10 rounded object-cover shadow"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{recSong.title}</p>
                          <p className="text-xs text-neutral-400 truncate">{recSong.artist}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addSongToPlaylist(playlist.id, recSong)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-600 hover:border-white text-xs font-bold text-white hover:scale-105 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Dodaj
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
