import React from 'react';

interface ProgressBarDisplayProps {
  hours: string;
  progressPercentage: number;
  color: string;
  onBoatClick: () => void;
  canAddBoat: boolean;
  children: React.ReactNode;
}

const ProgressBarDisplay: React.FC<ProgressBarDisplayProps> = ({
  hours,
  progressPercentage,
  color,
  onBoatClick,
  canAddBoat,
  children
}) => {
  const rgb = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16)
  };
  const mutedColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;

  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in backdrop-blur-sm relative overflow-hidden h-44">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" />
      
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-1000 ease-out"
        style={{ 
          width: `${progressPercentage}%`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-80"
          style={{ 
            background: `linear-gradient(135deg, ${mutedColor} 0%, ${color} 100%)`,
          }}
        />
        
        {children}
        
        <div 
          className="absolute top-0 left-0 w-full h-20 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)`,
            opacity: 0.15,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      <div 
        className="absolute top-0 bottom-0 transition-all duration-1000 ease-out"
        style={{ 
          left: `${progressPercentage}%`,
          width: '2px',
          marginLeft: '-1px',
          zIndex: 10,
          background: `linear-gradient(to bottom, transparent, ${color} 20%, ${color} 80%, transparent)`,
          boxShadow: `0 0 12px ${mutedColor}`
        }}
      />
      
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-out"
        style={{ 
          width: `${progressPercentage}%`,
          background: `linear-gradient(90deg, transparent, ${color})`,
          zIndex: 5
        }}
      />
      
      <div className="absolute top-4 left-4 z-20">
        <button 
          className="bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-800/50 shadow-md hover:bg-gray-800/90 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canAddBoat}
          onClick={onBoatClick}
        >
          <div className="text-3xl font-bold text-white tracking-tight">{hours} hrs</div>
        </button>
      </div>
    </div>
  );
};

export default ProgressBarDisplay;