import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { QuickPlayCard } from '../Common/QuickPlayCard';
import { SongCard } from '../Common/SongCard';
import type { CurrentView } from '../../types/music';
import { Play, Pause, Flame, BarChart2, Headphones, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  setCurrentView: (view: CurrentView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentView }) => {
  const { 
    playlists, 
    likedSongs, 
    uploadedSongs, 
    topPlayedSongs, 
    getPlayCount, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay 
  } = usePlayer();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Dzień dobry';
    if (hour >= 12 && hour < 18) return 'Dobre popołudnie';
    return 'Dobry wieczór';
  };

  const topSixPlaylists = playlists.slice(0, 6);
  const totalPlays = topPlayedSongs.reduce((acc, s) => acc + getPlayCount(s.id), 0);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-28 pt-2 select-none">
      {/* Dynamic Greeting & Quick Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Witaj w Twoim osobistym centrum muzyki
          </p>
        </div>

        {/* Listening Counter Quick Badge */}
        <div 
          onClick={() => setCurrentView({ type: 'stats' })}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/60 to-neutral-900 border border-emerald-500/30 hover:border-[#1ed760] px-4 py-2.5 rounded-xl cursor-pointer transition hover:scale-[1.02] shadow-lg group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1ed760] text-black flex items-center justify-center font-bold shadow">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span>Twoje Statystyki</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-sm font-semibold text-white">
              {totalPlays.toLocaleString()} odtworzeń razem
            </p>
          </div>
        </div>
      </div>

      {/* Top 6 Quick Play Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {topSixPlaylists.map((pl) => (
          <QuickPlayCard
            key={pl.id}
            playlist={pl}
            onOpen={() => setCurrentView({ type: 'playlist', playlistId: pl.id })}
          />
        ))}
      </div>

      {/* Section: Najczęściej słuchane (On Repeat) - Highlight of the play count feature */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Najczęściej słuchane
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  On Repeat
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Piosenki z największą liczbą odtworzeń na Twoim koncie
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView({ type: 'stats' })}
            className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition flex items-center gap-1"
          >
            <span>Wszystkie statystyki</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {topPlayedSongs.slice(0, 6).map((song, idx) => {
            const isThisPlaying = isPlaying && currentSong?.id === song.id;
            const count = getPlayCount(song.id);

            return (
              <div
                key={song.id}
                onClick={() => {
                  if (isThisPlaying) togglePlay();
                  else playSong(song);
                }}
                className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition duration-300 flex flex-col justify-between relative shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Ranking Medal */}
                <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-xs font-black text-white shadow">
                  #{idx + 1}
                </div>

                <div className="relative mb-3 aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {/* Play Button Overlay */}
                  <div className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition duration-200 hover:scale-105 active:scale-95 ${
                    isThisPlaying
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}>
                    {isThisPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className={`font-bold text-sm truncate mb-0.5 ${isThisPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mb-2">
                    {song.artist}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1ed760] bg-white/5 py-1 px-2 rounded-md">
                    <Headphones className="w-3 h-3 flex-shrink-0" />
                    <span>{count.toLocaleString()} {count === 1 ? 'odsłuchanie' : 'odtworzeń'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Polecane playlisty */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Polecane playlisty
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Dopasowane do Twoich ulubionych gatunków
            </p>
          </div>
          <button
            onClick={() => setCurrentView({ type: 'search' })}
            className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition"
          >
            Pokaż wszystko
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <SongCard
              key={playlist.id}
              playlist={playlist}
              onOpen={() => setCurrentView({ type: 'playlist', playlistId: playlist.id })}
            />
          ))}
        </div>
      </section>

      {/* Section: Twoja Kolekcja */}
      {(likedSongs.length > 0 || uploadedSongs.length > 0) && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Twoja Kolekcja
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Polubione i własne utwory
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedSongs.length > 0 && (
              <div
                onClick={() => setCurrentView({ type: 'liked' })}
                className="bg-gradient-to-br from-indigo-800 to-purple-900 p-5 rounded-lg cursor-pointer hover:shadow-2xl transition hover:scale-[1.02] flex flex-col justify-between h-44 relative group"
              >
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">Kolekcja</span>
                  <h3 className="text-2xl font-bold text-white mt-2">Polubione utwory</h3>
                  <p className="text-xs text-neutral-300 mt-1">{likedSongs.length} utworów</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">Odtwórz teraz</span>
                  <div className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>
            )}

            {uploadedSongs.length > 0 && (
              <div
                onClick={() => setCurrentView({ type: 'uploaded' })}
                className="bg-gradient-to-br from-teal-800 to-emerald-950 p-5 rounded-lg cursor-pointer hover:shadow-2xl transition hover:scale-[1.02] flex flex-col justify-between h-44 relative group"
              >
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-teal-200">Pliki lokalne</span>
                  <h3 className="text-2xl font-bold text-white mt-2">Wgrane z dysku</h3>
                  <p className="text-xs text-neutral-300 mt-1">{uploadedSongs.length} wgranych plików</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">Odtwórz teraz</span>
                  <div className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
