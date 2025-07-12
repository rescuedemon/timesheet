import React from 'react';

interface WaveBackgroundProps {
  mutedColor: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ mutedColor }) => {
  return (
    <>
      <div 
        className="absolute inset-0 opacity-40"
        style={{ 
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,40 C20,20 40,60 60,30 C80,60 100,20 100,40 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
          backgroundSize: '200% 100%',
          animation: 'waveMove 15s ease-in-out infinite alternate'
        }} 
      />
      
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,60 C15,40 35,70 50,50 C65,70 85,40 100,60 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
          backgroundSize: '150% 100%',
          animation: 'waveMove 20s ease-in-out infinite alternate'
        }} 
      />
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C10,30 30,70 50,50 C70,70 90,30 100,50 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
          backgroundSize: '250% 100%',
          animation: 'waveMove 18s ease-in-out infinite alternate-reverse'
        }} 
      />
    </>
  );
};

export default WaveBackground;