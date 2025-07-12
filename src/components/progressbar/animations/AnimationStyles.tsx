import React from 'react';

const AnimationStyles: React.FC = () => {
  return (
    <style>{`
      @keyframes waveMove {
        0% { background-position-x: 200%; }
        100% { background-position-x: 0%; }
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
          opacity: 0.4;
          transform: translateY(0) scale(1, 0.4);
        }
        50% {
          opacity: 0.6;
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
      
      @keyframes fishSwim {
        0% { 
          left: -5%;
          opacity: 0;
          transform: translateY(0) rotate(0deg);
        }
        5% { 
          opacity: 1;
        }
        25% { 
          transform: translateY(-5px) rotate(-3deg);
        }
        50% { 
          transform: translateY(0) rotate(0deg);
        }
        75% { 
          transform: translateY(5px) rotate(3deg);
        }
        95% {
          opacity: 1;
        }
        100% { 
          left: 100%;
          opacity: 0;
          transform: translateY(0) rotate(0deg);
        }
      }
      
      @keyframes buoyBob {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-5px) rotate(-2deg); }
        50% { transform: translateY(0) rotate(0deg); }
        75% { transform: translateY(-3px) rotate(2deg); }
      }
      
      @keyframes boatBob {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-4px) rotate(-2deg); }
        50% { transform: translateY(0px) rotate(0deg); }
        75% { transform: translateY(-3px) rotate(2deg); }
      }
      
      @keyframes jellyfishFloat {
        0%, 100% { 
          transform: translateY(0) scale(1);
        }
        50% { 
          transform: translateY(-4px) scale(1.05);
        }
      }
      
      @keyframes whaleFloat {
        0%, 100% { 
          transform: translateY(0) rotate(0deg);
        }
        50% { 
          transform: translateY(-5px) rotate(-1deg);
        }
      }
      
      @keyframes turtleFloat {
        0%, 100% { 
          transform: translateY(0) rotate(0deg);
        }
        25% { 
          transform: translateY(-2px) rotate(-1deg);
        }
        50% { 
          transform: translateY(0) rotate(0deg);
        }
        75% { 
          transform: translateY(-3px) rotate(1deg);
        }
      }
    `}</style>
  );
};

export default AnimationStyles;