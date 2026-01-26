// Configuración global del efecto Dither
// Cambia aquí para afectar todas las páginas

export const ditherConfig = {
  waveColor: [0.5, 0.5, 0.5] as [number, number, number], // RGB (0-1) - gris medio
  disableAnimation: false,
  enableMouseInteraction: true,
  mouseRadius: 0.25,
  colorNum: 16,
  waveAmplitude: 0.2,
  waveFrequency: 1.5,
  waveSpeed: 0.05,
  pixelSize: 1,
};

// Variantes opcionales para probar rápidamente
export const ditherVariants = {
  blackAndGrey: {
    ...ditherConfig,
    waveColor: [0.5, 0.5, 0.5] as [number, number, number],
  },
  darkGrey: {
    ...ditherConfig,
    waveColor: [0.3, 0.3, 0.3] as [number, number, number],
  },
  lightGrey: {
    ...ditherConfig,
    waveColor: [0.7, 0.7, 0.7] as [number, number, number],
  },
  orange: {
    ...ditherConfig,
    waveColor: [1, 0.5, 0] as [number, number, number],
  },
  purple: {
    ...ditherConfig,
    waveColor: [0.7, 0.2, 0.9] as [number, number, number],
  },
  blue: {
    ...ditherConfig,
    waveColor: [0.2, 0.5, 1] as [number, number, number],
  },
};
