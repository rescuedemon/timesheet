import React from 'react';

const AURORA_COLORS = [
  'rgba(101, 227, 242, 0.65)',
  'rgba(66, 220, 244, 0.65)',
  'rgba(117, 255, 209, 0.60)',
  'rgba(178, 150, 255, 0.65)',
  'rgba(255, 223, 107, 0.60)',
  'rgba(76, 255, 196, 0.65)',
  'rgba(100, 230, 255, 0.65)',
  'rgba(255, 150, 230, 0.60)',
];

class AuroraCanvas {
  static draw(ctx: CanvasRenderingContext2D, size: number, timestamp: number, tintOpacity: number) {
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
    ctx.clip();
    
    ctx.fillStyle = `rgba(235, 245, 255, ${tintOpacity})`;
    ctx.fillRect(0, 0, size, size);
    
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      
      const offset = i * 0.5;
      const waveHeight = 35 + i * 12; 
      const speed = 0.0003;
      
      ctx.moveTo(0, size/2);
      
      for (let x = 0; x <= size; x += 2) {
        const noise = Math.sin(x * 0.03 + timestamp * 0.0001) * 8;
        const y = size/2 + 
                  Math.sin(x * 0.015 + timestamp * speed + offset) * waveHeight + 
                  Math.cos(x * 0.025 + timestamp * (speed * 1.5) + offset) * (waveHeight * 0.7) +
                  noise;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(size, size);
      ctx.lineTo(0, size);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, size/2, size, size/2);
      gradient.addColorStop(0, AURORA_COLORS[i % AURORA_COLORS.length]);
      gradient.addColorStop(0.5, AURORA_COLORS[(i + 4) % AURORA_COLORS.length]);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3 + (i * 0.05);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }
}

export default AuroraCanvas;