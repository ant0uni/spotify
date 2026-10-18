import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const PlayerControls: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat
  } = usePlayer();

  return (
    <div className="flex items-center gap-5 justify-center">
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`relative p-1.5 transition ${
          isShuffle ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
        title={isShuffle ? "Wyłącz odtwarzanie losowe" : "Włącz odtwarzanie losowe"}
      >
        <Shuffle className="w-4 h-4" />
        {isShuffle && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full" />
        )}
      </button>

      {/* Previous Song */}
      <button
        onClick={prevTrack}
        className="text-neutral-400 hover:text-white transition active:scale-95 p-1.5"
        title="Poprzedni utwór"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Play / Pause Main Button */}
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
        title={isPlaying ? "Wstrzymaj (Spacja)" : "Odtwarzaj (Spacja)"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        )}
      </button>

      {/* Next Song */}
      <button
        onClick={nextTrack}
        className="text-neutral-400 hover:text-white transition active:scale-95 p-1.5"
        title="Następny utwór"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className={`relative p-1.5 transition ${
          repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
        title={`Tryb powtarzania: ${repeatMode === 'off' ? 'Wyłączony' : repeatMode === 'all' ? 'Wszystkie' : 'Jeden utwór'}`}
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-4 h-4" />
        ) : (
          <Repeat className="w-4 h-4" />
        )}
        {repeatMode !== 'off' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full" />
        )}
      </button>
    </div>
  );
};

