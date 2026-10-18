import React, { useState } from 'react';
import { CATEGORIES } from '../../data/mockData';
import { usePlayer } from '../../context/PlayerContext';
import type { CurrentView } from '../../types/music';
import { TrackRow } from '../Common/TrackRow';
import { SongCard } from '../Common/SongCard';
import { Play, Pause, Search as SearchIcon, Headphones, Flame } from 'lucide-react';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: CurrentView) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  setSearchQuery,
  setCurrentView
}) => {
  const { playlists, uploadedSongs, currentSong, isPlaying, playSong, togglePlay, getPlayCount } = usePlayer();
  const [filterType, setFilterType] = useState<'all' | 'songs' | 'playlists' | 'popular'>('all');

  // Combine all songs
  const allSongs = [
    ...playlists.flatMap(p => p.songs),
    ...uploadedSongs
  ];
  // Deduplicate by ID
  const uniqueSongs = Array.from(new Map(allSongs.map(s => [s.id, s])).values());

  const query = searchQuery.trim().toLowerCase();

  let matchingSongs = query
    ? uniqueSongs.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query) ||
        (s.genre && s.genre.toLowerCase().includes(query))
      )
    : [];

  if (filterType === 'popular') {
    matchingSongs = [...matchingSongs].sort((a, b) => getPlayCount(b.id) - getPlayCount(a.id));
  }

  const matchingPlaylists = query
    ? playlists.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    : [];

  const topResult = matchingSongs.length > 0 ? matchingSongs[0] : null;
  const isTopResultPlaying = isPlaying && currentSong?.id === topResult?.id;

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-28 pt-2 select-none">
      {!query ? (
        // Browse All Categories View
        <div>
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Przeglądaj wszystko
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSearchQuery(cat.title.replace('Muzyka ', ''));
                }}
                className={`relative h-44 p-4 rounded-xl cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-[1.02] shadow-lg ${cat.color}`}
              >
                <h3 className="text-xl font-bold text-white leading-tight max-w-[80%]">
                  {cat.title}
                </h3>
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="absolute -right-3 -bottom-2 w-24 h-24 object-cover shadow-2xl rounded-md rotate-[25deg] pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Search Results View
        <div className="space-y-6 animate-fade-in">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                filterType === 'all'
                  ? 'bg-white text-black'
                  : 'bg-[#282828] text-white hover:bg-[#333333]'
              }`}
            >
              Wszystko
            </button>
            <button
              onClick={() => setFilterType('songs')}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                filterType === 'songs'
                  ? 'bg-white text-black'
                  : 'bg-[#282828] text-white hover:bg-[#333333]'
              }`}
            >
              Utwory ({matchingSongs.length})
            </button>
            <button
              onClick={() => setFilterType('playlists')}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                filterType === 'playlists'
                  ? 'bg-white text-black'
                  : 'bg-[#282828] text-white hover:bg-[#333333]'
              }`}
            >
              Playlisty ({matchingPlaylists.length})
            </button>
            <button
              onClick={() => setFilterType('popular')}
              className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition ${
                filterType === 'popular'
                  ? 'bg-[#1ed760] text-black font-bold'
                  : 'bg-[#282828] text-white hover:bg-[#333333]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Najczęściej słuchane</span>
            </button>
          </div>

          {matchingSongs.length === 0 && matchingPlaylists.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">
                Brak wyników dla "{searchQuery}"
              </h3>
              <p className="text-sm text-neutral-400 mt-2 max-w-md mx-auto">
                Upewnij się, że wszystkie słowa zostały wpisane poprawnie lub spróbuj użyć innych słów kluczowych.
              </p>
            </div>
          ) : (
            <>
              {/* Top Result & Matching Songs */}
              {filterType !== 'playlists' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Top Result */}
                  {topResult && (
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-bold text-white mb-3">
                        Najlepszy wynik
                      </h2>
                      <div
                        onClick={() => {
                          if (isTopResultPlaying) {
                            togglePlay();
                          } else {
                            playSong(topResult);
                          }
                        }}
                        className="group bg-[#181818] hover:bg-[#282828] p-5 rounded-lg cursor-pointer transition relative flex flex-col justify-between h-60 shadow-xl"
                      >
                        <img
                          src={topResult.coverUrl}
                          alt={topResult.title}
                          className="w-24 h-24 rounded-md object-cover shadow-xl mb-3"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-white truncate mb-1">
                            {topResult.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-neutral-400">
                            <span className="text-white font-medium">{topResult.artist}</span>
                            <span className="px-2 py-0.5 bg-black/40 rounded-full text-xs text-neutral-300">
                              {topResult.genre || 'Utwór'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-[#1ed760] font-semibold">
                              <Headphones className="w-3 h-3" />
                              {getPlayCount(topResult.id)} odtworzeń
                            </span>
                          </div>
                        </div>

                        {/* Play button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTopResultPlaying) {
                              togglePlay();
                            } else {
                              playSong(topResult);
                            }
                          }}
                          className={`absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-2xl transition duration-200 hover:scale-105 active:scale-95 ${
                            isTopResultPlaying
                              ? 'opacity-100 scale-100'
                              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                          }`}
                        >
                          {isTopResultPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tracks matching search */}
                  <div className={topResult ? "lg:col-span-3" : "col-span-full"}>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Utwory
                    </h2>
                    <div className="space-y-1">
                      {matchingSongs.slice(0, 5).map((song, idx) => (
                        <TrackRow
                          key={song.id}
                          song={song}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Matching Playlists */}
              {filterType !== 'songs' && matchingPlaylists.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Playlisty
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {matchingPlaylists.map(playlist => (
                      <SongCard
                        key={playlist.id}
                        playlist={playlist}
                        onOpen={() => setCurrentView({ type: 'playlist', playlistId: playlist.id })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
