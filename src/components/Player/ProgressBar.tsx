import React from 'react';
import { formatTime } from '../../utils/formatTime';
import { usePlayer } from '../../context/PlayerContext';

export const ProgressBar: React.FC = () => {
  const { currentTime, duration, seek } = usePlayer();

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xl group">
      <span className="text-[11px] font-medium text-neutral-400 w-9 text-right tabular-nums select-none">
        {formatTime(currentTime)}
      </span>

      <div className="relative flex-1 flex items-center h-4 cursor-pointer">
        {/* Visual Track */}
        <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-white group-hover:bg-[#1ed760] transition-colors rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real hidden range slider overlay */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Przewiń utwór"
        />

        {/* Visual Thumb */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <span className="text-[11px] font-medium text-neutral-400 w-9 text-left tabular-nums select-none">
        {formatTime(duration)}
      </span>
    </div>
  );
};

