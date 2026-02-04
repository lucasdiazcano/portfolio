'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { 
  EffectComposer, 
  Bloom, 
  Vignette, 
  ChromaticAberration,
  Noise,
  Scanline,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

import {
  Scene3DContent,
  TimeControl,
  RainControl,
  BackButton,
  Instructions,
  BackgroundLayers,
  RainOverlay,
  useDelayedIndex,
  useRainIntensity,
  usePortfolioData,
  usePipBoyNavigation,
  useTabGlitch,
  GlitchEffect,
} from './3d';
import LayoutDebugPanel from './3d/ui/LayoutDebugPanel';
import { PipBoyLoader, PipBoyLoaderOverlay } from './3d/ui/PipBoyLoader';

/**
 * Página fullscreen del PipBoy con ciclo día/noche y lluvia
 */
export default function Scene3DFullscreen() {
  // Cargar datos del portfolio en el store
  usePortfolioData();
  
  // Activar navegación con teclado y mouse
  usePipBoyNavigation();
  
  // Hook para efecto glitch durante el boot/carga inicial
  const { glitchRef } = useTabGlitch();
  
  // Estado del tiempo
  const [timeIndex, setTimeIndex] = useState(1); // Empieza en DAY
  const displayIndex = useDelayedIndex(timeIndex);
  
  // Estado de lluvia
  const [isRaining, setIsRaining] = useState(false);
  const rainIntensity = useRainIntensity(isRaining);
  
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Loader con progreso - fuera del Canvas para evitar conflictos */}
      <PipBoyLoaderOverlay />
      
      {/* Capas de fondo con transición suave */}
      <BackgroundLayers displayIndex={displayIndex} />
      
      {/* Overlay de lluvia */}
      <RainOverlay rainIntensity={rainIntensity} />
      
      {/* Controles UI */}
      <BackButton />
      <TimeControl timeIndex={timeIndex} onTimeChange={setTimeIndex} />
      <Instructions />
      
      {/* Panel de debug para ajustar layout - Presiona D para mostrar */}
      <LayoutDebugPanel />

      {/* Canvas 3D a pantalla completa */}
      <Canvas
        className="absolute inset-0 z-10"
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Suspense fallback={<PipBoyLoader />}>
          <Scene3DContent timeIndex={timeIndex} rainIntensity={rainIntensity} />
          
          {/* Post-processing effects - Sutiles para no afectar mucho el dispositivo */}
          <EffectComposer>
            {/* Glitch - Efecto de interferencia durante el boot */}
            <GlitchEffect ref={glitchRef} duration={80} intensity={0.5} />
            
            {/* Bloom - Glow verde estilo Pip-Boy */}
            <Bloom 
              intensity={0.6}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            
            {/* Vignette - Oscurecimiento en esquinas (sutil) */}
            <Vignette 
              offset={0.4}
              darkness={0.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
