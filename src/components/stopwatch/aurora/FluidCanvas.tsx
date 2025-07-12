import React from 'react';

class FluidCanvas {
  static draw(ctx: CanvasRenderingContext2D, size: number, isRunning: boolean, displayTime: number) {
    if (isRunning) {
      const center = size / 2;
      const radius = size / 2 - 10;
      const progress = (displayTime % 60) / 60;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (2 * Math.PI * progress);
      
      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle, false);
      ctx.lineWidth = 6;
      
      const gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, 'rgba(66, 133, 244, 0.9)');
      gradient.addColorStop(1, 'rgba(100, 181, 246, 1)');
      
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
}

export default FluidCanvas;