import React from 'react';
import { TrackInfo } from './TrackInfo';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

interface PlayerBarProps {
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  isQueueOpen,
  setIsQueueOpen
}) => {
  return (
    <footer className="h-20 bg-black border-t border-neutral-900 px-4 flex items-center justify-between z-40 select-none">
      {/* Left: Track Information */}
      <TrackInfo />

      {/* Center: Controls and Progress Bar */}
      <div className="flex flex-col items-center justify-center gap-1.5 flex-1 max-w-2xl px-4">
        <PlayerControls />
        <ProgressBar />
      </div>

      {/* Right: Extra Controls & Volume */}
      <VolumeControl
        isQueueOpen={isQueueOpen}
        setIsQueueOpen={setIsQueueOpen}
      />
    </footer>
  );
};

