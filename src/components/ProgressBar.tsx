import React, { useEffect, useRef, useState } from 'react';

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
  
  const windRef = useRef<HTMLDivElement>(null);
  const [waves, setWaves] = useState<number[]>([]);
  const [boats, setBoats] = useState<{id: number, startTime: number}[]>([]);
  
  // Generate wind effect particles
  useEffect(() => {
    if (!enabled || !windRef.current) return;
    
    const createWindParticles = () => {
      windRef.current!.innerHTML = '';
      
      const particleCount = 24;
      const baseSize = 2;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none';
        
        // Position based on progress
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

  // Add subtle waves approximately once per minute
  useEffect(() => {
    if (!enabled) return;
    
    const waveInterval = setInterval(() => {
      setWaves(prev => [...prev, Date.now()]);
      
      // Remove wave after animation completes
      setTimeout(() => {
        setWaves(prev => prev.slice(1));
      }, 3000);
    }, 60000 + Math.random() * 15000); // 45-75 seconds with randomness
    
    return () => clearInterval(waveInterval);
  }, [enabled]);

  // Add boats every 30 minutes (only after 5+ hours)
  useEffect(() => {
    if (!enabled || currentHours < 5 * 3600) return;
    
    const boatInterval = setInterval(() => {
      setBoats(prev => [...prev, { id: Date.now(), startTime: Date.now() }]);
      
      // Remove boat after 5 minutes
      setTimeout(() => {
        setBoats(prev => prev.slice(1));
      }, 300000); // 5 minutes
    }, 1800000); // 30 minutes
    
    return () => clearInterval(boatInterval);
  }, [enabled, currentHours]);

  // Calculate muted color for background
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgb = hexToRgb(color);
  const mutedColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
  
  // Calculate text color based on background luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? 'text-gray-900' : 'text-white';

  if (!enabled) {
    return (
      <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Time Today</div>
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{hours} hrs</div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 dark:border-gray-700">
              <div className="text-2xl font-bold text-white">{Math.round(parseFloat(hours))}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden relative backdrop-blur-sm h-44">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" />
      
      {/* Completed portion */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-1000 ease-out"
        style={{ 
          width: `${progressPercentage}%`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        {/* Base layer with subtle texture */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{ 
            background: `linear-gradient(135deg, 
              ${mutedColor} 0%, 
              ${color} 100%)`,
          }}
        />
        
        {/* Main wave pattern - FIXED DIRECTION (left to right) */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,40 C20,20 40,60 60,30 C80,60 100,20 100,40 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '200% 100%',
            animation: 'waveMove 25s linear infinite reverse'
          }} 
        />
        
        {/* Secondary wave pattern - FIXED DIRECTION (left to right) */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,60 C15,40 35,70 50,50 C65,70 85,40 100,60 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '150% 100%',
            animation: 'waveMove 35s linear infinite'
          }} 
        />
        
        {/* Wind particles */}
        <div ref={windRef} className="absolute inset-0" />
        
        {/* Light reflection */}
        <div 
          className="absolute top-0 left-0 w-full h-20 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)`,
            opacity: 0.15,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Progress divider */}
      <div 
        className="absolute top-0 bottom-0 transition-all duration-1000 ease-out"
        style={{ 
          left: `${progressPercentage}%`,
          width: '2px',
          marginLeft: '-1px',
          zIndex: 10,
          background: `linear-gradient(to bottom, 
            transparent, 
            ${color} 20%, 
            ${color} 80%, 
            transparent)`,
          boxShadow: `0 0 12px ${mutedColor}`
        }}
      />
      
      {/* Progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-out"
        style={{ 
          width: `${progressPercentage}%`,
          background: `linear-gradient(90deg, transparent, ${color})`,
          zIndex: 5
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 absolute top-3 left-3 border border-gray-800/50 shadow-md">
          <div className="text-3xl font-bold text-white tracking-tight">{hours} hrs</div>
        </div>
      </div>
      
      {/* Subtle waves */}
      {waves.map((id) => (
        <div 
          key={id}
          className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
          style={{
            animation: `waveRipple 3s ease-out`,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
            opacity: 0.4,
          }}
        />
      ))}
      
      {/* Mini boats (only after 5+ hours) */}
      {boats.map((boat) => {
        const elapsed = (Date.now() - boat.startTime) / 1000; // seconds
        const progress = Math.min(elapsed / 300, 1); // 5 minutes = 300 seconds
        return (
          <div
            key={boat.id}
            className="absolute top-1/3 transform -translate-y-1/2 pointer-events-none"
            style={{
              left: `${progress * 100}%`,
              animation: `boatFloat 2s ease-in-out infinite alternate`,
              transition: 'left 0.5s linear',
              zIndex: 20,
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              className="transform -translate-x-1/2"
            >
              <path d="M3 18c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm18-4h-8v-2h8v2z" fill="#FF9800"/>
              <path d="M21 14h-8v-2h8v2zm-4-4h-4V8h4v2z" fill="#FFC107"/>
              <path d="M3 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="#4CAF50"/>
            </svg>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes waveMove {
          0% { background-position-x: 0; }
          100% { background-position-x: 200%; }
        }
        
        @keyframes windFloat {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.05;
          }
          50% { 
            transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20 + 5}px, -${Math.random() * 15 + 5}px);
            opacity: 0.3;
          }
        }
        
        @keyframes waveRipple {
          0% {
            opacity: 0.5;
            transform: translateY(0) scale(1, 0.3);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.8, 1);
          }
        }
        
        @keyframes boatFloat {
          0%, 100% { 
            transform: translateY(-50%) translateY(-2px);
          }
          50% { 
            transform: translateY(-50%) translateY(2px);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;