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
  const [boats, setBoats] = useState<{ id: number; top: number; speed: number; }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      // Add wave with random position
      setWaves(prev => [...prev, Date.now()]);
      
      // Remove wave after animation completes
      setTimeout(() => {
        setWaves(prev => prev.slice(1));
      }, 3000);
    }, 60000 + Math.random() * 15000); // 45-75 seconds with randomness
    
    return () => clearInterval(waveInterval);
  }, [enabled]);

  // Add mini boats every 15 minutes
  useEffect(() => {
    if (!enabled) return;
    
    const boatInterval = setInterval(() => {
      // Add boat with random vertical position and speed
      setBoats(prev => [...prev, { 
        id: Date.now(), 
        top: Math.random() * 20 + 40,  // 40% to 60% from top (near water surface)
        speed: 20 + (Math.random() * 8 - 4)  // 16-24 seconds (20% variance)
      }]);
    }, 900000); // 15 minutes
    
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
    <div 
      ref={containerRef}
      className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in relative backdrop-blur-sm h-44"
    >
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
        
        {/* Main wave pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,40 C20,20 40,60 60,30 C80,60 100,20 100,40 L100,100 L0,100 Z" fill="${encodeURIComponent(mutedColor)}"/></svg>')`,
            backgroundSize: '200% 100%',
            animation: 'waveMove 25s linear infinite'
          }} 
        />
        
        {/* Secondary wave pattern */}
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
        
        {/* Mini boats */}
        {boats.map(boat => (
          <div 
            key={boat.id}
            className="absolute pointer-events-none"
            style={{
              top: `${boat.top}%`,
              left: '0%',
              animation: `boatFloat ${boat.speed}s linear forwards, boatBob 3s ease-in-out infinite`,
              zIndex: 15,
              width: '35px',
              height: '35px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
              <path d="M6 26L28 26C28 26 26 22 24 22L8 22C6 22 6 26 6 26Z" fill="#8B4513"/>
              <path d="M8 22L24 22L24 20L8 20Z" fill="#D2691E"/>
              <path d="M16 20L16 8L10 16L16 20Z" fill="#FF6B6B"/>
              <path d="M16 20L16 6L22 14L16 20Z" fill="#4ECDC4"/>
              <path d="M16 6L16 4" stroke="#654321" strokeWidth="1"/>
              <circle cx="7" cy="24" r="1" fill="#FFD700"/>
              <circle cx="25" cy="24" r="1" fill="#FFD700"/>
            </svg>
          </div>
        ))}
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
      
      {/* Content - moved to top left with padding 4 */}
      <div className="absolute top-4 left-4 z-20">
        <button 
          className="bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-800/50 shadow-md hover:bg-gray-800/90 transition-all duration-200 cursor-pointer"
          onClick={() => {
            if (boats.length < 10) {
              setBoats(prev => [...prev, { 
                id: Date.now(), 
                top: Math.random() * 20 + 40,
                speed: 20 + (Math.random() * 8 - 4)
              }]);
            }
          }}
        >
          <div className="text-3xl font-bold text-white tracking-tight">{hours} hrs</div>
        </button>
      </div>
      
      {/* Test controls - top right */}
      {false && (
        <div className="absolute top-4 right-4 z-30 flex space-x-2">
          <button 
            className="bg-gray-900/80 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm shadow-md hover:bg-gray-700 transition-colors"
            onClick={() => setBoats(prev => [...prev, { 
              id: Date.now(), 
              top: Math.random() * 20 + 40 
            }])}
          >
            Test Boat
          </button>
          <button 
            className="bg-gray-900/80 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm shadow-md hover:bg-red-700 transition-colors"
            onClick={() => setBoats(prev => prev.slice(0, -1))}
          >
            Undo Boat
          </button>
        </div>
      )}
      
      {/* Subtle waves */}
      {waves.map((id) => (
        <div 
          key={id}
          className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
          style={{
            animation: `waveRipple 3s ease-out`,
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 15
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes waveMove {
          0% { background-position-x: 200%; }
          100% { background-position-x: 0; }
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
            opacity: 0.3;
            transform: translateY(0) scale(1, 0.4);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(1.5, 1);
          }
        }
        
        @keyframes boatFloat {
          0% { 
            left: -5%;
            opacity: 0;
          }
          5% { 
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% { 
            left: 100%;
            opacity: 0;
          }
        }
        
        @keyframes boatBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-2deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;