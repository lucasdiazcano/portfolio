'use client';

import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';

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
  
  // Ajustar intensidad del environment según hora
  const envIntensity = timeIndex === 3 ? 0.3 : timeIndex === 0 ? 0.6 : timeIndex === 2 ? 0.5 : 0.8;
  
  return (
    <>
      <DynamicLighting timeIndex={timeIndex} />
      
      {/* Environment de Drei para reflejos y iluminación basada en imagen HDR */}
      <Environment 
        preset={currentPreset.preset} 
        background={false}
        environmentIntensity={envIntensity}
      />
      
      {/* Contact shadows - sombra suave debajo del Pip-Boy */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={timeIndex === 3 ? 0.3 : 0.6}
        scale={8}
        blur={2.5}
        far={4}
        color={timeIndex === 3 ? '#001a00' : '#000000'}
      />
      
      {/* Sistema de lluvia */}
      <Rain intensity={rainIntensity} />
      
      {/* Float animation - el Pip-Boy flota suavemente */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.4}
        floatingRange={[-0.1, 0.1]}
      >
        <PipBoyTerminal rainIntensity={rainIntensity} timeIndex={timeIndex} />
      </Float>
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}
