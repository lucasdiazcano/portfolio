/**
 * Configuración de la pantalla del PipBoy
 */

export const SCREEN_CONFIG = {
  width: 3.5,
  height: 2.2,
  resolution: [1024, 640] as [number, number],
} as const;

export const RAIN_CONFIG = {
  count: 1500,
  area: { x: 15, y: 12, z: 10 },
  velocityMin: 8,
  velocityMax: 15,
  size: 0.05,
  color: '#aaccff',
  maxOpacity: 0.6,
} as const;
