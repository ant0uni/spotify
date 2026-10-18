import React from 'react';
import { 
  Flame, 
  Headphones, 
  Clock, 
  Award, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  User,
  Music
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export const StatsView: React.FC = () => {
  const { 
    topPlayedSongs, 
    getPlayCount, 
    resetPlayCounts, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay 
  } = usePlayer();

  const totalPlays = topPlayedSongs.reduce((sum, s) => sum + getPlayCount(s.id), 0);
  const totalSeconds = topPlayedSongs.reduce((sum, s) => sum + (s.duration * getPlayCount(s.id)), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Top artist calculation
  const artistMap: Record<string, number> = {};
  topPlayedSongs.forEach(s => {
    const count = getPlayCount(s.id);
    artistMap[s.artist] = (artistMap[s.artist] || 0) + count;
  });
  const topArtistEntry = Object.entries(artistMap).sort((a, b) => b[1] - a[1])[0];
  const topArtist = topArtistEntry ? topArtistEntry[0] : 'Brak danych';
  const topArtistPlays = topArtistEntry ? topArtistEntry[1] : 0;

  // Genre breakdown
  const genreMap: Record<string, number> = {};
  topPlayedSongs.forEach(s => {
    const genre = s.genre || 'Inne';
    const count = getPlayCount(s.id);
    genreMap[genre] = (genreMap[genre] || 0) + count;
  });
  const sortedGenres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);

  const numberOneSong = topPlayedSongs[0];
  const maxPlays = numberOneSong ? Math.max(1, getPlayCount(numberOneSong.id)) : 1;

  const handleReset = () => {
    if (window.confirm('Czy na pewno chcesz zresetować wszystkie statystyki odtworzeń? Liczniki wrócą do zera.')) {
      resetPlayCounts();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28 select-none">
      {/* Hero Banner with Spotify Wrapped Gradient */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-800 via-teal-950 to-[#121212] flex flex-col sm:flex-row items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-br from-[#1ed760] via-teal-400 to-indigo-600 p-1 flex items-center justify-center shadow-2xl flex-shrink-0 group">
            <div className="w-full h-full bg-[#121212]/70 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-4">
              <Award className="w-14 h-14 text-[#1ed760] mb-2 animate-bounce" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Statystyki</span>
              <span className="text-2xl font-black text-white">Wrapped Live</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1ed760] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Twoje Centrum Odsłuchań
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Statystyki Słuchania
            </h1>
            <p className="text-sm text-neutral-300 mt-2 max-w-xl">
              Sprawdź ile razy przesłuchałeś poszczególnych piosenek, jaki jest Twój ulubiony artysta oraz ile łącznie czasu spędziłeś z muzyką.
            </p>
          </div>
        </div>

        {/* Reset stats button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition hover:scale-105 flex-shrink-0"
          title="Zresetuj wszystkie liczniki"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetuj liczniki</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="px-6 sm:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Total Plays */}
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800/80 hover:border-emerald-500/40 transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-[#1ed760] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-neutral-400">Odtworzeń razem</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{totalPlays.toLocaleString()}</h3>
            </div>
          </div>

          {/* 2. Total Time */}
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800/80 hover:border-amber-500/40 transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-neutral-400">Czas słuchania</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{totalMinutes} min</h3>
            </div>
          </div>

          {/* 3. Top Artist */}
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800/80 hover:border-purple-500/40 transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase font-semibold text-neutral-400">Top Wykonawca</p>
              <h3 className="text-lg font-bold text-white truncate mt-0.5" title={topArtist}>{topArtist}</h3>
              <p className="text-[11px] text-neutral-400">{topArtistPlays} odsłuchań</p>
            </div>
          </div>

          {/* 4. Top Track */}
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800/80 hover:border-rose-500/40 transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase font-semibold text-neutral-400">Najczęstszy utwór</p>
              <h3 className="text-lg font-bold text-white truncate mt-0.5" title={numberOneSong?.title}>
                {numberOneSong ? numberOneSong.title : 'Brak danych'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {numberOneSong ? `${getPlayCount(numberOneSong.id)} odsłuchań` : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Highlight: #1 Song Feature Spotlight */}
        {numberOneSong && (
          <div className="mb-10 bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-[#181818] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={numberOneSong.coverUrl}
                  alt={numberOneSong.title}
                  className="w-24 h-24 rounded-xl object-cover shadow-2xl"
                />
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-[#1ed760] text-black font-black text-xs flex items-center justify-center shadow">
                  #1
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1ed760]">
                  Twój absolutny hit roku
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {numberOneSong.title}
                </h2>
                <p className="text-sm text-neutral-300">
                  {numberOneSong.artist} • <span className="text-neutral-400">{numberOneSong.album}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-300">
                  <span className="font-bold text-[#1ed760] text-sm">
                    {getPlayCount(numberOneSong.id)} odtworzeń
                  </span>
                  <span>•</span>
                  <span>{formatTime(numberOneSong.duration)} na utwór</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isPlaying && currentSong?.id === numberOneSong.id) togglePlay();
                else playSong(numberOneSong);
              }}
              className="px-6 py-3 rounded-full bg-[#1ed760] text-black font-extrabold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition shadow-xl"
            >
              {isPlaying && currentSong?.id === numberOneSong.id ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Wstrzymaj</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  <span>Odtwórz teraz</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Grid: Full Top Songs List & Genre Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Tracks Leaderboard with Visual Bars */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Ranking Najpopularniejszych Utworów</span>
              </h2>
              <span className="text-xs text-neutral-400">
                Wg liczby odsłuchań
              </span>
            </div>

            <div className="space-y-2">
              {topPlayedSongs.map((song, idx) => {
                const count = getPlayCount(song.id);
                const percentOfMax = Math.round((count / maxPlays) * 100);
                const isPlayingThis = isPlaying && currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      if (isPlayingThis) togglePlay();
                      else playSong(song);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-emerald-950/30 border-[#1ed760]/50'
                        : 'bg-[#181818] border-neutral-800/80 hover:bg-[#232323] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-6 text-center text-sm font-black ${
                          idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-neutral-300' : idx === 2 ? 'text-amber-600' : 'text-neutral-500'
                        }`}>
                          #{idx + 1}
                        </span>

                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />

                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${isPlayingThis ? 'text-[#1ed760]' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-bold text-white tabular-nums">
                            {count}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">
                            odtworzeń
                          </span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1ed760] hover:text-black transition">
                          {isPlayingThis ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Play percentage bar */}
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-[#1ed760] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percentOfMax)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Genre Distribution & Summary */}
          <div className="space-y-6">
            <div className="bg-[#181818] p-5 rounded-2xl border border-neutral-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Music className="w-4 h-4 text-[#1ed760]" />
                <span>Rozkład Gatunków</span>
              </h3>

              <div className="space-y-4">
                {sortedGenres.map(([genre, count]) => {
                  const percent = totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0;
                  return (
                    <div key={genre}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white font-semibold">{genre}</span>
                        <span className="text-neutral-400 tabular-nums">{count} odsłuchań ({percent}%)</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1ed760] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listening Habit Tips Card */}
            <div className="bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-purple-500/20 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Twoje Nawyki Słuchania</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Każde uruchomienie utworu lub przejście w kolejce automatycznie zlicza się na Twoim koncie i jest bezpiecznie zapisywane w pamięci lokalnej przeglądarki.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
