'use client';

import Link from 'next/link';
import { TIME_PRESETS, BACKGROUND_GRADIENTS } from '../config';

interface TimeControlProps {
  timeIndex: number;
  onTimeChange: (index: number) => void;
}

/**
 * Control de ciclo día/noche con botones y slider
 */
export function TimeControl({ timeIndex, onTimeChange }: TimeControlProps) {
  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 font-mono">
      <div className="px-4 py-2 bg-black/50 border border-green-500/30 rounded backdrop-blur-sm">
        <div className="text-green-400 text-xs mb-2">TIME OF DAY</div>
        <div className="flex gap-1">
          {TIME_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => onTimeChange(idx)}
              className={`px-3 py-1 text-xs rounded transition-all duration-300 ${
                timeIndex === idx 
                  ? 'bg-green-500 text-black font-bold scale-105' 
                  : 'bg-green-900/30 text-green-400 hover:bg-green-800/50'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Slider alternativo */}
      <div className="px-4 py-2 bg-black/50 border border-green-500/30 rounded backdrop-blur-sm w-full">
        <input
          type="range"
          min={0}
          max={TIME_PRESETS.length - 1}
          value={timeIndex}
          onChange={(e) => onTimeChange(parseInt(e.target.value))}
          className="w-full accent-green-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-green-500/50 mt-1">
          <span>🌅</span>
          <span>☀️</span>
          <span>🌇</span>
          <span>🌙</span>
        </div>
      </div>
    </div>
  );
}

interface RainControlProps {
  isRaining: boolean;
  onToggle: () => void;
}

/**
 * Control de lluvia
 */
export function RainControl({ isRaining, onToggle }: RainControlProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 font-mono">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded backdrop-blur-sm transition-all duration-300 border ${
          isRaining 
            ? 'bg-blue-600/50 border-blue-400 text-blue-200' 
            : 'bg-black/50 border-green-500/30 text-green-400 hover:bg-green-900/30'
        }`}
      >
        {isRaining ? '🌧️ RAIN ON' : '☀️ RAIN OFF'}
      </button>
    </div>
  );
}

/**
 * Botón para volver al portfolio
 */
export function BackButton() {
  return (
    <Link 
      href="/"
      className="absolute top-4 left-4 z-50 px-4 py-2 bg-green-900/50 border border-green-500/50 text-green-400 font-mono text-sm rounded hover:bg-green-800/50 transition-colors backdrop-blur-sm"
    >
      ← BACK TO PORTFOLIO
    </Link>
  );
}

/**
 * Instrucciones de uso
 */
export function Instructions() {
  return (
    <div className="absolute bottom-4 left-4 z-50 text-green-500/50 font-mono text-xs">
      DRAG TO ROTATE • CLICK TABS TO NAVIGATE • TOGGLE RAIN ↑
    </div>
  );
}

interface BackgroundLayersProps {
  displayIndex: number;
}

/**
 * Capas de fondo con transición suave
 */
export function BackgroundLayers({ displayIndex }: BackgroundLayersProps) {
  return (
    <>
      {Object.entries(BACKGROUND_GRADIENTS).map(([idx, gradient]) => (
        <div 
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            background: gradient,
            opacity: displayIndex === parseInt(idx) ? 1 : 0 
          }}
        />
      ))}
    </>
  );
}

interface RainOverlayProps {
  rainIntensity: number;
}

/**
 * Overlay de lluvia CSS para el fondo
 */
export function RainOverlay({ rainIntensity }: RainOverlayProps) {
  if (rainIntensity === 0) return null;
  
  return (
    <div 
      className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-500"
      style={{ 
        opacity: rainIntensity * 0.3,
        background: 'linear-gradient(to bottom, rgba(50,70,100,0.5), rgba(20,30,50,0.7))'
      }}
    />
  );
}
