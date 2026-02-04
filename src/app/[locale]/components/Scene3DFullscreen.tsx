'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';

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
} from './3d';
import LayoutDebugPanel from './3d/ui/LayoutDebugPanel';

/**
 * Página fullscreen del PipBoy con ciclo día/noche y lluvia
 */
export default function Scene3DFullscreen() {
  // Cargar datos del portfolio en el store
  usePortfolioData();
  
  // Activar navegación con teclado y mouse
  usePipBoyNavigation();
  
  // Estado del tiempo
  const [timeIndex, setTimeIndex] = useState(1); // Empieza en DAY
  const displayIndex = useDelayedIndex(timeIndex);
  
  // Estado de lluvia
  const [isRaining, setIsRaining] = useState(false);
  const rainIntensity = useRainIntensity(isRaining);
  
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Capas de fondo con transición suave */}
      <BackgroundLayers displayIndex={displayIndex} />
      
      {/* Overlay de lluvia */}
      <RainOverlay rainIntensity={rainIntensity} />
      
      {/* Controles UI */}
      <BackButton />
      <TimeControl timeIndex={timeIndex} onTimeChange={setTimeIndex} />
      <RainControl isRaining={isRaining} onToggle={() => setIsRaining(!isRaining)} />
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
        <Suspense fallback={null}>
          <Scene3DContent timeIndex={timeIndex} rainIntensity={rainIntensity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
