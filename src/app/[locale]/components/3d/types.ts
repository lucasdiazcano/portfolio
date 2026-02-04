import { ReactNode } from 'react';

/**
 * Tipos compartidos para componentes 3D
 */

export interface PipBoyTabConfig {
  id: string;
  label: string;
}

export interface PipBoyConfig {
  tabs: PipBoyTabConfig[];
  defaultTab?: number;
  screenWidth?: number;
  screenHeight?: number;
  screenResolution?: [number, number];
}

export interface ScreenContentProps {
  hovered: boolean;
  selectedTab?: number;
  onTabChange?: (index: number) => void;
}

export interface PipBoyDeviceProps {
  children: ReactNode;
  hovered: boolean;
  timeIndex?: number;
  showKnobs?: boolean;
  showVents?: boolean;
  showStraps?: boolean;
  showScrews?: boolean;
  showLED?: boolean;
}

export interface Scene3DProps {
  className?: string;
  height?: string;
  enableOrbitControls?: boolean;
  autoRotate?: boolean;
}

// Colores del tema Pip-Boy
export const PIPBOY_COLORS = {
  // Pantalla
  screenBackground: '#001a00',
  screenText: '#00ff88',
  screenTextDim: '#00cc66',
  screenTextMuted: '#006633',
  screenAccent: '#004422',
  
  // Dispositivo - Verde militar
  deviceBody: '#3d4a32',
  deviceFrame: '#2e3a24',
  deviceAccent: '#252d1e',
  deviceMetal: '#4a5a3d',
  deviceScrew: '#5c6b4a',
  
  // Correas
  strapLeather: '#3a2a1a',
  
  // LED
  ledActive: '#00ff00',
  ledInactive: '#004400',
} as const;
