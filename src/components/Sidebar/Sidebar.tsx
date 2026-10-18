import React, { useState, useRef } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Upload, 
  Disc3, 
  Volume2,
  BarChart2,
  Flame
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import type { CurrentView, Song } from '../../types/music';
import { CreatePlaylistModal } from './CreatePlaylistModal';

interface SidebarProps {
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { 
    playlists, 
    likedSongs, 
    uploadedSongs, 
    addUploadedSong, 
    isPlaying,
    currentPlaylist,
    topPlayedSongs,
    getPlayCount
  } = usePlayer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'playlists' | 'uploaded'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalPlays = topPlayedSongs.reduce((acc, s) => acc + getPlayCount(s.id), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const audioUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(audioUrl);

      tempAudio.addEventListener('loadedmetadata', () => {
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        const parts = rawName.split(' - ');
        const artist = parts.length > 1 ? parts[0].trim() : 'Własny plik';
        const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : rawName;

        const newSong: Song = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: title,
          artist: artist,
          album: 'Wgrane z dysku',
          duration: Math.round(tempAudio.duration) || 210,
          coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
          audioUrl: audioUrl,
          addedAt: 'Przed chwilą',
          isLocal: true
        };

        addUploadedSong(newSong);
        setCurrentView({ type: 'uploaded' });
      });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredPlaylists = playlists.filter(() => {
    if (filter === 'all' || filter === 'playlists') return true;
    return false;
  });

  return (
    <aside className="w-64 md:w-72 lg:w-80 flex-shrink-0 flex flex-col gap-2 p-2 h-full bg-black select-none text-neutral-400">
      {/* Top navigation container */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {/* Brand logo */}
        <div 
          onClick={() => setCurrentView({ type: 'home' })}
          className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer hover:opacity-90 transition px-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black">
            <Disc3 className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
          </div>
          <span className="tracking-tight text-lg">Spotify Clone</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 pt-1">
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition ${
              currentView.type === 'home'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Główna</span>
          </button>

          <button
            onClick={() => setCurrentView({ type: 'search' })}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition ${
              currentView.type === 'search'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-6 h-6" />
            <span>Szukaj</span>
          </button>

          <button
            onClick={() => setCurrentView({ type: 'stats' })}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition ${
              currentView.type === 'stats'
                ? 'text-[#1ed760]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-6 h-6" />
            <span>Statystyki odsłuchań</span>
          </button>
        </nav>
      </div>

      {/* Library container */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Library header */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3 px-2">
            <button
              onClick={() => setCurrentView({ type: 'home' })}
              className="flex items-center gap-3 text-neutral-400 hover:text-white font-bold text-sm transition"
            >
              <Library className="w-6 h-6" />
              <span>Twoja biblioteka</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Wgraj plik MP3 z dysku"
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => setIsModalOpen(true)}
                title="Utwórz nową playlistę"
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 px-1 pb-2 overflow-x-auto text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Wszystko
            </button>
            <button
              onClick={() => setFilter('playlists')}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                filter === 'playlists'
                  ? 'bg-white text-black'
                  : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Playlisty
            </button>
            {uploadedSongs.length > 0 && (
              <button
                onClick={() => setFilter('uploaded')}
                className={`px-3 py-1.5 rounded-full font-medium transition ${
                  filter === 'uploaded'
                    ? 'bg-white text-black'
                    : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                Wgrane ({uploadedSongs.length})
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list of items */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {/* Top Played / On Repeat item */}
          {(filter === 'all' || filter === 'playlists') && (
            <div
              onClick={() => setCurrentView({ type: 'stats' })}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition group ${
                currentView.type === 'stats' ? 'bg-[#282828] text-white' : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-500 via-rose-600 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${currentView.type === 'stats' ? 'text-[#1ed760]' : 'text-white'}`}>
                  Najczęściej słuchane
                </p>
                <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                  <span>On Repeat</span>
                  <span>•</span>
                  <span>{totalPlays.toLocaleString()} odtworzeń</span>
                </p>
              </div>
            </div>
          )}

          {/* Liked songs item */}
          {(filter === 'all' || filter === 'playlists') && (
            <div
              onClick={() => setCurrentView({ type: 'liked' })}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition group ${
                currentView.type === 'liked' ? 'bg-[#282828] text-white' : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${currentView.type === 'liked' ? 'text-[#1ed760]' : 'text-white'}`}>
                  Polubione utwory
                </p>
                <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                  <span>Playlista</span>
                  <span>•</span>
                  <span>{likedSongs.length} utworów</span>
                </p>
              </div>
            </div>
          )}

          {/* Uploaded songs item */}
          {(filter === 'all' || filter === 'uploaded') && uploadedSongs.length > 0 && (
            <div
              onClick={() => setCurrentView({ type: 'uploaded' })}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition group ${
                currentView.type === 'uploaded' ? 'bg-[#282828] text-white' : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-cyan-600 to-teal-800 flex items-center justify-center flex-shrink-0 shadow-md">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${currentView.type === 'uploaded' ? 'text-[#1ed760]' : 'text-white'}`}>
                  Wgrane z dysku
                </p>
                <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                  <span>Pliki lokalne</span>
                  <span>•</span>
                  <span>{uploadedSongs.length} utworów</span>
                </p>
              </div>
            </div>
          )}

          {/* User & Default Playlists */}
          {filter !== 'uploaded' && filteredPlaylists.map((playlist) => {
            const isSelected = currentView.type === 'playlist' && currentView.playlistId === playlist.id;
            const isPlayingThis = isPlaying && currentPlaylist?.id === playlist.id;

            return (
              <div
                key={playlist.id}
                onClick={() => setCurrentView({ type: 'playlist', playlistId: playlist.id })}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition group ${
                  isSelected ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm truncate ${isPlayingThis ? 'text-[#1ed760]' : 'text-white group-hover:text-white'}`}>
                      {playlist.title}
                    </p>
                    {isPlayingThis && (
                      <Volume2 className="w-3.5 h-3.5 text-[#1ed760] animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                    <span>{playlist.isCustom ? 'Własna playlista' : 'Spotify'}</span>
                    <span>•</span>
                    <span>{playlist.songs.length} utworów</span>
                  </p>
                </div>
              </div>
            );
          })}

          {filteredPlaylists.length === 0 && (
            <div className="p-4 text-center text-xs text-neutral-500">
              Brak playlist w tej kategorii
            </div>
          )}
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlaylistCreated={(playlist) => {
          setCurrentView({ type: 'playlist', playlistId: playlist.id });
        }}
      />
    </aside>
  );
};
