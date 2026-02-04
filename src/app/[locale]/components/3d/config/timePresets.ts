import * as THREE from 'three';

/**
 * Configuración de presets de tiempo para el ciclo día/noche
 */

export interface TimePresetConfig {
  name: string;
  preset: 'dawn' | 'warehouse' | 'sunset' | 'night';
  skyColor: THREE.Color;
  ambientIntensity: number;
  sunColor: THREE.Color;
  sunIntensity: number;
}

export const TIME_PRESETS: readonly TimePresetConfig[] = [
  { 
    name: 'DAWN', 
    preset: 'dawn', 
    skyColor: new THREE.Color('#ff9966'), 
    ambientIntensity: 0.6, 
    sunColor: new THREE.Color('#ffcc99'), 
    sunIntensity: 1 
  },
  { 
    name: 'DAY', 
    preset: 'warehouse', 
    skyColor: new THREE.Color('#87ceeb'), 
    ambientIntensity: 1.2, 
    sunColor: new THREE.Color('#ffffff'), 
    sunIntensity: 2 
  },
  { 
    name: 'SUNSET', 
    preset: 'sunset', 
    skyColor: new THREE.Color('#ff6b35'), 
    ambientIntensity: 0.8, 
    sunColor: new THREE.Color('#ff8866'), 
    sunIntensity: 1 
  },
  { 
    name: 'NIGHT', 
    preset: 'night', 
    skyColor: new THREE.Color('#1a1a2e'), 
    ambientIntensity: 0.3, 
    sunColor: new THREE.Color('#aabbff'), 
    sunIntensity: 0.5 
  },
] as const;

// Gradientes de fondo para cada preset
export const BACKGROUND_GRADIENTS = {
  0: 'linear-gradient(to bottom, #ff9966, #ff5e62)', // Dawn
  1: 'linear-gradient(to bottom, #87ceeb, #e0f7fa)', // Day
  2: 'linear-gradient(to bottom, #ff6b35, #1a1a2e)', // Sunset  
  3: 'linear-gradient(to bottom, #0f0f23, #1a1a2e)', // Night
} as const;
