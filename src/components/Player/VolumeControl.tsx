import React from 'react';
import { 
  Volume2, 
  Volume1, 
  VolumeX, 
  ListMusic, 
  Mic2
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

interface VolumeControlProps {
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  isQueueOpen,
  setIsQueueOpen
}) => {
  const { 
    volume, 
    setVolume, 
    isMuted, 
    toggleMute,
    isLyricsOpen,
    setIsLyricsOpen
  } = usePlayer();

  const currentVolume = isMuted ? 0 : volume;
  const percentage = currentVolume * 100;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-white" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-4 h-4 text-neutral-400 group-hover:text-white" />;
    }
    return <Volume2 className="w-4 h-4 text-neutral-400 group-hover:text-white" />;
  };

  return (
    <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
      {/* Lyrics / Visualizer toggle */}
      <button
        onClick={() => setIsLyricsOpen(!isLyricsOpen)}
        className={`p-1.5 transition ${
          isLyricsOpen ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
        title="Wizualizer / Tekst utworu"
      >
        <Mic2 className="w-4 h-4" />
      </button>

      {/* Queue Drawer toggle */}
      <button
        onClick={() => setIsQueueOpen(!isQueueOpen)}
        className={`p-1.5 transition ${
          isQueueOpen ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
        title="Kolejka utworów"
      >
        <ListMusic className="w-4 h-4" />
      </button>

      {/* Volume Icon + Slider */}
      <div className="flex items-center gap-2 group">
        <button
          onClick={toggleMute}
          className="p-1 transition"
          title={isMuted ? "Włącz dźwięk (M)" : "Wycisz (M)"}
        >
          {renderVolumeIcon()}
        </button>

        <div className="relative w-20 sm:w-24 flex items-center h-4 cursor-pointer">
          {/* Visual Track */}
          <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-white group-hover:bg-[#1ed760] transition-colors rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Real Slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={currentVolume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Głośność"
          />

          {/* Visual Thumb */}
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
