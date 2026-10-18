import { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Upload, 
  User,
  BarChart2
} from 'lucide-react';
import type { CurrentView, Song } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface HeaderProps {
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery
}) => {
  const { addUploadedSong, topPlayedSongs, getPlayCount } = usePlayer();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalPlays = topPlayedSongs.reduce((sum, s) => sum + getPlayCount(s.id), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const audioUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(audioUrl);

      tempAudio.addEventListener('loadedmetadata', () => {
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        const parts = rawName.split(' - ');
        const artist = parts.length > 1 ? parts[0].trim() : 'Własny utwór';
        const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : rawName;

        const newSong: Song = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: title,
          artist: artist,
          album: 'Pliki lokalne',
          duration: Math.round(tempAudio.duration) || 200,
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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md transition-colors select-none">
      {/* Navigation history & search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white/70 hover:text-white transition disabled:opacity-40"
            title="Powrót do strony głównej"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentView({ type: 'search' })}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white/70 hover:text-white transition"
            title="Przejdź do wyszukiwania"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search input field (visible in search view or can trigger search view) */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Czego chcesz posłuchać?"
            value={searchQuery}
            onFocus={() => {
              if (currentView.type !== 'search') {
                setCurrentView({ type: 'search' });
              }
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView.type !== 'search') {
                setCurrentView({ type: 'search' });
              }
            }}
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#242424] text-white text-sm rounded-full pl-10 pr-9 py-2.5 border border-transparent focus:border-white focus:outline-none placeholder-neutral-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right actions: Stats button, Upload MP3 button & User Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView({ type: 'stats' })}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition hover:scale-105 active:scale-95 ${
            currentView.type === 'stats'
              ? 'bg-[#1ed760] text-black border-[#1ed760]'
              : 'bg-[#242424] hover:bg-[#2f2f2f] text-white border-neutral-700/60'
          }`}
          title="Zobacz statystyki odsłuchań"
        >
          <BarChart2 className={`w-3.5 h-3.5 ${currentView.type === 'stats' ? 'text-black' : 'text-[#1ed760]'}`} />
          <span className="hidden sm:inline">Statystyki ({totalPlays})</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden sm:flex items-center gap-2 bg-[#242424] hover:bg-[#2f2f2f] text-white text-xs font-bold px-3.5 py-2 rounded-full border border-neutral-700/60 transition hover:scale-105 active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-[#1ed760]" />
          <span>Wgraj MP3</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <div 
          onClick={() => setCurrentView({ type: 'stats' })}
          className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#282828] text-white rounded-full p-1 pr-3 cursor-pointer transition border border-neutral-800"
          title="Twój profil i statystyki"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center font-bold text-xs text-black shadow">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold hidden md:inline">Użytkownik</span>
        </div>
      </div>
    </header>
  );
};
