'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { PipBoyDevice } from '../models/PipBoyDevice';
import TerminalContent from '../ui/TerminalContent';
import { ScreenDroplets } from '../effects';
import { SCREEN_CONFIG } from '../config';

interface PipBoyTerminalProps {
  rainIntensity?: number;
}

/**
 * Componente principal del terminal PipBoy
 * Incluye el dispositivo, pantalla con RenderTexture y efectos de lluvia
 */
export default function PipBoyTerminal({ rainIntensity = 0 }: PipBoyTerminalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Movimiento flotante suave
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.5}
      rotation={[0.05, 0, 0]}
    >
      <PipBoyDevice hovered={hovered}>
        {/* Pantalla con contenido renderizado */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[SCREEN_CONFIG.width, SCREEN_CONFIG.height]} />
          <meshBasicMaterial>
            <RenderTexture 
              attach="map" 
              anisotropy={16} 
              width={SCREEN_CONFIG.resolution[0]} 
              height={SCREEN_CONFIG.resolution[1]}
            >
              <PerspectiveCamera 
                makeDefault 
                manual 
                aspect={SCREEN_CONFIG.width / SCREEN_CONFIG.height} 
                position={[0, 0, 5]} 
              />
              <TerminalContent hovered={hovered} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
        
        {/* Gotas de lluvia en la pantalla */}
        <ScreenDroplets intensity={rainIntensity} />
      </PipBoyDevice>
    </group>
  );
}
