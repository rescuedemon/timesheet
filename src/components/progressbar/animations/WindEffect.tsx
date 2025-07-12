import React, { useRef, useEffect } from 'react';

interface WindEffectProps {
  enabled: boolean;
  progressPercentage: number;
}

const WindEffect: React.FC<WindEffectProps> = ({ enabled, progressPercentage }) => {
  const windRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !windRef.current) return;
    
    const createWindParticles = () => {
      windRef.current!.innerHTML = '';
      
      const particleCount = 24;
      const baseSize = 2;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none';
        
        const left = Math.random() * progressPercentage;
        const top = Math.random() * 80 + 10;
        const size = Math.random() * baseSize + baseSize;
        const delay = Math.random() * 4;
        const duration = Math.random() * 8 + 6;
        const opacity = Math.random() * 0.3 + 0.05;
        const blur = Math.random() * 3 + 1;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.opacity = `${opacity}`;
        particle.style.filter = `blur(${blur}px)`;
        particle.style.background = `rgba(255, 255, 255, ${opacity})`;
        particle.style.animation = `windFloat ${duration}s ease-in-out ${delay}s infinite`;
        
        windRef.current!.appendChild(particle);
      }
    };
    
    createWindParticles();
  }, [enabled, progressPercentage]);

  return <div ref={windRef} className="absolute inset-0" />;
};

export default WindEffect;