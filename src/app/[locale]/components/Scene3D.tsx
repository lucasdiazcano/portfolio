'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RenderTexture, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// Importar módulos organizados
import { 
  PipBoyDevice, 
  TerminalContent, 
  PIPBOY_COLORS,
  Scene3DProps 
} from './3d';

// Configuración de la pantalla
const SCREEN_CONFIG = {
  width: 3.5,
  height: 2.2,
  resolution: [1024, 640] as [number, number],
};

/**
 * Componente interno que maneja el Pip-Boy con animaciones
 */
function PipBoyTerminal() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    // Animación de flotación
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.3}
      rotation={[0.1, 0, 0]}
    >
      <PipBoyDevice hovered={hovered}>
        {/* Pantalla con RenderTexture */}
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
      </PipBoyDevice>
    </group>
  );
}

/**
 * Componente Scene3D principal
 * Renderiza un Pip-Boy 3D interactivo con efecto CRT
 */
export default function Scene3D({ 
  className = '',
  height = '400px',
  enableOrbitControls = true,
}: Scene3DProps) {
  return (
    <div 
      className={`w-full rounded-xl overflow-hidden border border-border cursor-pointer ${className}`}
      style={{ height }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0f, #1a1a2e)' }}
      >
        <Suspense fallback={null}>
          {/* Iluminación */}
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight 
            position={[-5, -5, 5]} 
            intensity={0.5} 
            color={PIPBOY_COLORS.screenText} 
          />
          
          {/* El Pip-Boy */}
          <PipBoyTerminal />
          
          {/* Controles de cámara */}
          {enableOrbitControls && (
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
