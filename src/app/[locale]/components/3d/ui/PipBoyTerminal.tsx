'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import PipBoyDevice from '../models/PipBoyDevice';
import TerminalContent from '../ui/TerminalContent';
import { ScreenDroplets } from '../effects';
import { SCREEN_CONFIG } from '../config';
import { PIPBOY_COLORS } from '../types';

interface PipBoyTerminalProps {
  rainIntensity?: number;
  timeIndex?: number; // Para ajustar intensidad según hora del día
}

/**
 * Componente principal del terminal PipBoy
 * Incluye el dispositivo, pantalla con RenderTexture, luz emisiva y efectos de lluvia
 */
export default function PipBoyTerminal({ rainIntensity = 0, timeIndex = 1 }: PipBoyTerminalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.RectAreaLight>(null);
  const [hovered, setHovered] = useState(false);
  
  // Inicializar RectAreaLight helpers (necesario para que funcione correctamente)
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);
  
  // Intensidad de la luz de la pantalla según hora del día
  // Más brillante de noche, más tenue de día
  const screenLightIntensity = timeIndex === 3 ? 8 : timeIndex === 0 ? 4 : timeIndex === 2 ? 5 : 2;

  useFrame((state) => {
    if (groupRef.current) {
      // Movimiento flotante suave
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
    
    // Efecto de parpadeo sutil en la luz de la pantalla
    if (screenLightRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 30) * 0.02;
      screenLightRef.current.intensity = screenLightIntensity * flicker;
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
        {/* Luz emitida por la pantalla - ilumina el entorno */}
        <rectAreaLight
          ref={screenLightRef}
          position={[0, 0, 0.2]}
          width={SCREEN_CONFIG.width * 0.9}
          height={SCREEN_CONFIG.height * 0.9}
          color={PIPBOY_COLORS.screenText}
          intensity={screenLightIntensity}
        />
        
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
