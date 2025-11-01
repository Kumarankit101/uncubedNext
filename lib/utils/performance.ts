import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry);
  }
};

// FPS Monitoring
let frameCount = 0;
let lastTime = performance.now();
const fpsHistory: number[] = [];
let isMonitoring = false;

export const startFPSMonitoring = () => {
  if (isMonitoring) return;
  isMonitoring = true;
  const measureFPS = () => {
    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;
    if (delta >= 1000) { // Measure every second
      const fps = Math.round((frameCount * 1000) / delta);
      fpsHistory.push(fps);
      if (fpsHistory.length > 10) fpsHistory.shift(); // Keep last 10 measurements
      console.log(`Current FPS: ${fps}`);
      if (fps < 60) {
        console.warn(`⚠️ Frame rate dropped below 60fps: ${fps}`);
      }
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(measureFPS);
  };
  requestAnimationFrame(measureFPS);
};

export const stopFPSMonitoring = () => {
  isMonitoring = false;
};

export const getAverageFPS = () => {
  if (fpsHistory.length === 0) return 0;
  return Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length);
};