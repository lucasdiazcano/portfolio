'use client';

import { OrbitControls, Environment } from '@react-three/drei';

import { DynamicLighting, Rain } from '../effects';
import PipBoyTerminal from './PipBoyTerminal';
import { TIME_PRESETS } from '../config';

interface Scene3DContentProps {
  timeIndex: number;
  rainIntensity: number;
}

/**
 * Contenido de la escena 3D
 * Combina iluminación, ambiente, lluvia y el terminal PipBoy
 */
export default function Scene3DContent({ timeIndex, rainIntensity }: Scene3DContentProps) {
  const currentPreset = TIME_PRESETS[timeIndex];
  
  return (
    <>
      <DynamicLighting timeIndex={timeIndex} />
      
      {/* Environment de Drei para reflejos y iluminación basada en imagen */}
      <Environment 
        preset={currentPreset.preset} 
        background={false}
      />
      
      {/* Sistema de lluvia */}
      <Rain intensity={rainIntensity} />
      
      <PipBoyTerminal rainIntensity={rainIntensity} />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}
