import React, { useRef, useEffect } from 'react';
import AuroraCanvas from './AuroraCanvas';
import FluidCanvas from './FluidCanvas';

interface AuroraEffectProps {
  isRunning: boolean;
  displayTime: number;
}

const AuroraEffect: React.FC<AuroraEffectProps> = ({ isRunning, displayTime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidCanvasRef = useRef<HTMLCanvasElement>(null);
  const auroraTimeRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || !fluidCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const fluidCanvas = fluidCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const fluidCtx = fluidCanvas.getContext('2d');
    
    if (!ctx || !fluidCtx) return;
    
    const size = 260;
    canvas.width = size;
    canvas.height = size;
    fluidCanvas.width = size;
    fluidCanvas.height = size;
    
    let animationFrameId: number;
    
    const drawAurora = (timestamp: number) => {
      if (!auroraTimeRef.current) auroraTimeRef.current = timestamp;
      const delta = timestamp - auroraTimeRef.current;
      auroraTimeRef.current = timestamp;
      
      // Clear canvases
      ctx.clearRect(0, 0, size, size);
      fluidCtx.clearRect(0, 0, size, size);
      
      // Draw aurora background
      AuroraCanvas.draw(ctx, size, timestamp, 0.3);
      
      // Draw fluid progress
      FluidCanvas.draw(fluidCtx, size, isRunning, displayTime);
      
      animationFrameId = requestAnimationFrame(drawAurora);
    };
    
    animationFrameId = requestAnimationFrame(drawAurora);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, displayTime]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <canvas ref={fluidCanvasRef} className="absolute inset-0 z-10" />
    </>
  );
};

export default AuroraEffect;