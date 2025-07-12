import React, { useEffect, useRef, useState } from 'react';
import ProgressBarDisplay from './progressbar/ProgressBarDisplay';
import SimpleProgressBar from './progressbar/SimpleProgressBar';
import BoatAnimations from './progressbar/animations/BoatAnimations';
import WindEffect from './progressbar/animations/WindEffect';
import WaveEffect from './progressbar/animations/WaveEffect';
import WaveBackground from './progressbar/animations/WaveBackground';
import AnimationStyles from './progressbar/animations/AnimationStyles';

interface ProgressBarProps {
  currentHours: number;
  targetHours?: number;
  color?: string;
  enabled?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentHours,
  targetHours = 8,
  color = '#10b981',
  enabled = false
}) => {
  const progressPercentage = Math.min(currentHours / 3600 / targetHours * 100, 100);
  const hours = (currentHours / 3600).toFixed(1);
  
  const [waves, setWaves] = useState<number[]>([]);
  const [boats, setBoats] = useState<{ id: number; top: number; speed: number; type: string; }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add subtle waves approximately once per minute
  useEffect(() => {
    if (!enabled) return;
    
    const waveInterval = setInterval(() => {
      setWaves(prev => [...prev, Date.now()]);
      setTimeout(() => {
        setWaves(prev => prev.slice(1));
      }, 3000);
    }, 60000 + Math.random() * 15000);
    
    return () => clearInterval(waveInterval);
  }, [enabled]);

  // Add mini boats every 15 minutes
  useEffect(() => {
    if (!enabled) return;
    
    const boatInterval = setInterval(() => {
      const boatTypes = ['sailboat', 'motorboat', 'canoe', 'fish', 'whale', 'shark', 'mermaid', 'turtle', 'buoy', 'jellyfish'];
      const randomType = boatTypes[Math.floor(Math.random() * boatTypes.length)];
      
      setBoats(prev => [...prev, { 
        id: Date.now(), 
        top: Math.random() * 20 + 40,
        speed: 20 + (Math.random() * 8 - 4),
        type: randomType
      }]);
    }, 900000);
    
    return () => clearInterval(boatInterval);
  }, [enabled]);

  // Remove boats after they complete their journey
  useEffect(() => {
    if (!enabled) return;
    
    const cleanup = setInterval(() => {
      setBoats(prev => prev.filter(boat => Date.now() - boat.id <= (boat.speed + 6) * 1000));
    }, 1000);
    
    return () => clearInterval(cleanup);
  }, [enabled]);

  // Calculate muted color for background
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgb = hexToRgb(color);
  const mutedColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;

  const handleBoatClick = () => {
    if (parseFloat(hours) >= 5 && boats.length < 10) {
      const boatTypes = ['sailboat', 'motorboat', 'canoe', 'fish', 'whale', 'shark', 'mermaid', 'turtle', 'buoy', 'jellyfish'];
      const randomType = boatTypes[Math.floor(Math.random() * boatTypes.length)];
      setBoats(prev => [...prev, { 
        id: Date.now(), 
        top: Math.random() * 20 + 40,
        speed: 20 + (Math.random() * 8 - 4),
        type: randomType
      }]);
    }
  };

  if (!enabled) {
    return <SimpleProgressBar hours={hours} />;
  }

  return (
    <div ref={containerRef}>
      <AnimationStyles />
      <ProgressBarDisplay
        hours={hours}
        progressPercentage={progressPercentage}
        color={color}
        onBoatClick={handleBoatClick}
        canAddBoat={parseFloat(hours) >= 5}
      >
        <WaveBackground mutedColor={mutedColor} />
        <WindEffect enabled={enabled} progressPercentage={progressPercentage} />
        <BoatAnimations boats={boats} progressPercentage={progressPercentage} />
        <WaveEffect waves={waves} mutedColor={mutedColor} />
      </ProgressBarDisplay>
    </div>
  );
};

export default ProgressBar;