import React, { useRef, useEffect } from 'react';
import { formatTime } from '@/utils/timeUtils';
import AuroraEffect from './aurora/AuroraEffect';

interface StopwatchDisplayProps {
  isRunning: boolean;
  elapsedTime: number;
  displayTime: number;
}

const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
  isRunning,
  elapsedTime,
  displayTime
}) => {
  const formattedTime = formatTime(Math.floor(displayTime));
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-2 border-gray-200 shadow-lg overflow-hidden">
      <AuroraEffect isRunning={isRunning} displayTime={displayTime} />
      
      {(isRunning || elapsedTime > 0) && (
        <div className="relative flex flex-col items-center justify-center z-20 w-full h-full">
          <div className="text-center w-full z-30">
            <div 
              className="text-5xl font-medium text-gray-800 tracking-tighter font-mono px-4"
              style={{ 
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              {formattedTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopwatchDisplay;