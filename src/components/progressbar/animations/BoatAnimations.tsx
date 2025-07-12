import React from 'react';

interface BoatAnimationsProps {
  boats: Array<{ id: number; top: number; speed: number; type: string; }>;
  progressPercentage: number;
}

const BoatAnimations: React.FC<BoatAnimationsProps> = ({ boats, progressPercentage }) => {
  const renderBoat = (type: string) => {
    const boatSVGs = {
      sailboat: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M6 26L28 26C28 26 26 22 24 22L8 22C6 22 6 26 6 26Z" fill="#8B4513"/>
          <path d="M8 22L24 22L24 20L8 20Z" fill="#D2691E"/>
          <path d="M16 20L16 8L10 16L16 20Z" fill="#FF6B6B"/>
          <path d="M16 20L16 6L22 14L16 20Z" fill="#4ECDC4"/>
          <path d="M16 6L16 4" stroke="#654321" strokeWidth="1"/>
          <circle cx="7" cy="24" r="1" fill="#FFD700"/>
          <circle cx="25" cy="24" r="1" fill="#FFD700"/>
        </svg>
      ),
      motorboat: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 18 24;2 18 24;0 18 24;-2 18 24;0 18 24" keyTimes="0;0.25;0.5;0.75;1" dur="4s" repeatCount="indefinite"/>
            <path d="M4 22 Q6 24, 8 24 L28 24 Q30 24, 32 22 L28 20 Q26 18, 24 20 L12 20 Q10 18, 8 20 Z" fill="url(#motorboatGradient)"/>
            <rect x="14" y="18" width="8" height="4" fill="#FFFFFF"/>
            <circle cx="16" cy="20" r="1" fill="#87CEEB"/>
            <circle cx="20" cy="20" r="1" fill="#87CEEB"/>
            <polygon points="22,18 24,16 26,18" fill="#FF0000"/>
          </g>
          <defs>
            <linearGradient id="motorboatGradient" x1="4" y1="24" x2="32" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2563EB"/>
              <stop offset="0.4" stopColor="#2563EB"/>
              <stop offset="0.5" stopColor="#FFFFFF"/>
              <stop offset="0.6" stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      canoe: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M4 22C4 22 6 18 10 18L26 18C30 18 32 22 32 22C32 24 30 26 26 26L10 26C6 26 4 24 4 22Z" fill="url(#canoeGradient)"/>
          <path d="M8 20L28 20C28 20 28 22 28 22L8 22C8 22 8 20 8 20Z" fill="#D2691E"/>
          <path d="M14 16L16 10L18 16Z" fill="#CD853F"/>
          <path d="M18 16L20 10L22 16Z" fill="#CD853F"/>
          <path d="M15 10L21 10" stroke="#8B4513" strokeWidth="1"/>
          <defs>
            <linearGradient id="canoeGradient" x1="4" y1="22" x2="32" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B4513"/>
              <stop offset="1" stopColor="#A0522D"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      fish: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="18" rx="12" ry="6" fill="url(#fishGradient)"/>
            <path d="M14 16 L10 14 L10 18 Z" fill="#FF6B35"/>
            <path d="M22 16 L26 14 L26 18 Z" fill="#FF6B35"/>
            <path d="M18 12 L20 10 L22 12 Z" fill="#FF6B35"/>
            <circle cx="14" cy="16" r="1.5" fill="#FFFFFF"/>
            <circle cx="14" cy="16" r="0.5" fill="#000000"/>
            <g transform="translate(30,18)">
              <animateTransform attributeName="transform" type="rotate" values="0;15;0;-15;0" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" additive="sum"/>
              <polygon points="0,0 4,-2 4,2" fill="#FF6B35"/>
            </g>
          </g>
          <defs>
            <linearGradient id="fishGradient" x1="6" y1="18" x2="30" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF4500"/>
              <stop offset="0.4" stopColor="#FF6B35"/>
              <stop offset="0.5" stopColor="#FFFFFF"/>
              <stop offset="0.6" stopColor="#FF8C42"/>
              <stop offset="1" stopColor="#FF8C42"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      whale: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <path d="M32 20C32 24 28 28 24 28L16 28C12 28 8 24 8 20C8 16 12 12 16 12L24 12C28 12 32 16 32 20Z" fill="url(#whaleGradient)" />
            <path d="M10 18C10 18 12 16 14 16C16 16 18 18 18 18" fill="#4A90E2"/>
            <circle cx="26" cy="18" r="1" fill="#FFFFFF"/>
            <path d="M14 10L16 16L12 16Z" fill="#4A90E2"/>
            <path d="M32 20L34 18L34 22Z" fill="#87CEEB"/>
            <circle cx="18" cy="14" r="2" fill="#87CEEB"/>
            <circle cx="24" cy="14" r="1" fill="#87CEEB">
              <animate attributeName="cy" from="14" to="10" dur="1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="25" cy="14" r="1" fill="#87CEEB">
              <animate attributeName="cy" from="14" to="10" dur="1s" begin="0.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/>
            </circle>
          </g>
          <defs>
            <linearGradient id="whaleGradient" x1="8" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A90E2"/>
              <stop offset="1" stopColor="#87CEEB"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      shark: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M32 18C32 22 28 26 24 26L12 26C8 26 4 22 4 18C4 14 8 10 12 10L24 10C28 10 32 14 32 18Z" fill="url(#sharkGradient)" />
          <path d="M18 10L20 6L22 10" fill="#708090"/>
          <path d="M24 18L28 16L28 20Z" fill="#708090"/>
          <circle cx="14" cy="20" r="0.5" fill="#FFFFFF"/>
          <path d="M12 18L8 16L8 20Z" fill="#708090"/>
          <defs>
            <linearGradient id="sharkGradient" x1="4" y1="18" x2="32" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#708090"/>
              <stop offset="1" stopColor="#B0C4DE"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      mermaid: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,1;0,0;0,-1;0,0" dur="3s" repeatCount="indefinite"/>
            <path d="M22 22C22 24 20 26 18 26C16 26 14 24 14 22C14 20 16 18 18 18C20 18 22 20 22 22Z" fill="#20B2AA"/>
            <path d="M24 26C24 28 22 30 20 30L16 30C14 30 12 28 12 26C12 24 14 22 18 22C22 22 24 24 24 26Z" fill="url(#mermaidGradient)" />
            <path d="M18 24L14 28L18 26L22 28Z" fill="#20B2AA"/>
            <path d="M16 20L18 16L20 20" fill="#FFB6C1"/>
            <circle cx="17" cy="18" r="0.5" fill="#FFFFFF"/>
            <circle cx="19" cy="18" r="0.5" fill="#FFFFFF"/>
            <path d="M16 14C16 14 18 12 20 14" stroke="#FFB6C1" strokeWidth="1"/>
          </g>
          <defs>
            <linearGradient id="mermaidGradient" x1="12" y1="26" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#48D1CC"/>
              <stop offset="1" stopColor="#20B2AA"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      turtle: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="20" rx="12" ry="8" fill="url(#turtleGradient)"/>
            <path d="M10 20L8 22L10 24" fill="#228B22"/>
            <path d="M26 20L28 22L26 24" fill="#228B22"/>
            <circle cx="18" cy="14" r="3" fill="#228B22"/>
            <circle cx="17" cy="13" r="0.5" fill="#FFFFFF"/>
            <circle cx="19" cy="13" r="0.5" fill="#FFFFFF"/>
            <path d="M14 18L16 16L18 18L20 16L22 18" stroke="#006400" strokeWidth="1"/>
            <path d="M12 20L14 22L16 20" stroke="#006400" strokeWidth="1"/>
            <path d="M20 20L22 22L24 20" stroke="#006400" strokeWidth="1"/>
          </g>
          <defs>
            <linearGradient id="turtleGradient" x1="6" y1="20" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#228B22"/>
              <stop offset="1" stopColor="#32CD32"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      buoy: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0;0,2;0,0" dur="3s" repeatCount="indefinite"/>
            <ellipse cx="18" cy="22" rx="4" ry="6" fill="url(#buoyGradient)"/>
            <ellipse cx="18" cy="18" rx="4" ry="2" fill="#FFFFFF"/>
            <ellipse cx="18" cy="26" rx="4" ry="2" fill="#FFFFFF"/>
            <path d="M16 14L18 10L20 14" stroke="#FF0000" strokeWidth="1"/>
            <circle cx="18" cy="28" r="2" fill="#4169E1"/>
            <path d="M18 30L18 34" stroke="#4169E1" strokeWidth="1"/>
          </g>
          <defs>
            <linearGradient id="buoyGradient" x1="14" y1="22" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000"/>
              <stop offset="1" stopColor="#FF4500"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      jellyfish: (
        <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
          <g>
            <ellipse cx="18" cy="16" rx="8" ry="6" fill="url(#jellyfishGradient)" opacity="0.8">
              <animate attributeName="ry" values="6;7;6;5;6" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <path d="M12 22C12 22 14 26 14 30" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8"/>
            <path d="M16 22C16 22 16 28 18 32" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8"/>
            <path d="M20 22C20 22 20 28 18 32" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8"/>
            <path d="M24 22C24 22 22 26 22 30" stroke="#FF69B4" strokeWidth="1.5" opacity="0.8"/>
            <circle cx="16" cy="14" r="1" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="20" cy="14" r="1" fill="#FFFFFF" opacity="0.6"/>
          </g>
          <defs>
            <linearGradient id="jellyfishGradient" x1="10" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF69B4"/>
              <stop offset="1" stopColor="#FFB6C1"/>
            </linearGradient>
          </defs>
        </svg>
      )
    };
    
    return boatSVGs[type] || boatSVGs.sailboat;
  };

  return (
    <>
      {boats.map(boat => (
        <div 
          key={boat.id}
          className="absolute pointer-events-none"
          style={{
            top: `${boat.top}%`,
            left: '0%',
            animation: `${boat.type === 'fish' || boat.type === 'jellyfish' ? 'fishSwim' : 'boatFloat'} ${boat.speed}s linear forwards, ${boat.type === 'buoy' ? 'buoyBob' : boat.type === 'jellyfish' ? 'jellyfishFloat' : 'boatBob'} 3s ease-in-out infinite`,
            zIndex: 15,
            width: '35px',
            height: '35px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          {renderBoat(boat.type)}
        </div>
      ))}
    </>
  );
};

export default BoatAnimations;