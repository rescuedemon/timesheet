import React from 'react';

interface WaveEffectProps {
  waves: number[];
  mutedColor: string;
}

const WaveEffect: React.FC<WaveEffectProps> = ({ waves, mutedColor }) => {
  return (
    <>
      {waves.map((id) => (
        <div 
          key={id}
          className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
          style={{
            animation: `waveRipple 3s ease-out`,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 15
          }}
        />
      ))}
    </>
  );
};

export default WaveEffect;