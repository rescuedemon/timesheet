// Stopwatch control buttons component
// Handles start, pause, and stop functionality with visual feedback

import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface StopwatchControlsProps {
  isRunning: boolean;
  canStart: boolean;
  canPauseOrStop: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  canStart,
  canPauseOrStop,
  onStart,
  onPause,
  onStop
}) => {
  const buttonBaseStyle = "relative h-14 px-6 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none overflow-hidden group";
  const minWidth = { minWidth: '120px' };

  return (
    <div className="flex items-center gap-4 z-10">
      {!isRunning ? (
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`${buttonBaseStyle} bg-gradient-to-br from-[#34A853] to-[#2a8c43] text-white`}
          style={{
            ...minWidth,
            boxShadow: '0 5px 15px rgba(52, 168, 83, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <span className="relative z-10 flex items-center justify-center">
            <Play className="h-5 w-5 mr-2" strokeWidth={2.5} />
            Start
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          <span className="absolute inset-0 bg-gradient-to-br from-[#43b463] to-[#34A853] opacity-0 group-active:opacity-100 transition-opacity duration-200"></span>
        </button>
      ) : (
        <button
          onClick={onStop}
          disabled={!canPauseOrStop}
          className={`${buttonBaseStyle} bg-gradient-to-br from-[#EA4335] to-[#d03124] text-white`}
          style={{
            ...minWidth,
            boxShadow: '0 5px 15px rgba(234, 67, 53, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <span className="relative z-10 flex items-center justify-center">
            <Square className="h-5 w-5 mr-2" strokeWidth={2.5} />
            Stop
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          <span className="absolute inset-0 bg-gradient-to-br from-[#f55c47] to-[#EA4335] opacity-0 group-active:opacity-100 transition-opacity duration-200"></span>
        </button>
      )}
      
      <button
        onClick={onPause}
        disabled={!canPauseOrStop}
        className={`${buttonBaseStyle} bg-gradient-to-br from-[#4285F4] to-[#3367d6] text-white`}
        style={{
          ...minWidth,
          boxShadow: '0 5px 15px rgba(66, 133, 244, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <span className="relative z-10 flex items-center justify-center">
          <Pause className="h-5 w-5 mr-2" strokeWidth={2.5} />
          Pause
        </span>
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        <span className="absolute inset-0 bg-gradient-to-br from-[#5a95f5] to-[#4285F4] opacity-0 group-active:opacity-100 transition-opacity duration-200"></span>
      </button>
    </div>
  );
};

export default StopwatchControls;