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
} from './3d';

/**
 * Página fullscreen del PipBoy con ciclo día/noche y lluvia
 */
export default function Scene3DFullscreen() {
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
