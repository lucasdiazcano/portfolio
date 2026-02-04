'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { RAIN_CONFIG } from '../config';

interface RainProps {
  intensity?: number;
}

/**
 * Sistema de partículas de lluvia
 * Crea gotas que caen y se reciclan cuando salen del área visible
 */
export default function Rain({ intensity = 1 }: RainProps) {
  const rainRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  
  const { count, area, velocityMin, velocityMax } = RAIN_CONFIG;
  
  // Crear posiciones y velocidades iniciales de las gotas
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Posición inicial aleatoria
      pos[i * 3] = (Math.random() - 0.5) * area.x;      // x
      pos[i * 3 + 1] = Math.random() * area.y;          // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * area.z;  // z
      
      // Velocidad de caída aleatoria
      vel[i] = velocityMin + Math.random() * (velocityMax - velocityMin);
    }
    
    return [pos, vel];
  }, [count, area, velocityMin, velocityMax]);
  
  // Configurar geometría
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
      );
    }
    velocitiesRef.current = velocities;
  }, [positions, velocities]);
  
  useFrame((_, delta) => {
    if (!geometryRef.current || intensity === 0) return;
    
    const posAttr = geometryRef.current.attributes.position;
    if (!posAttr) return;
    
    const posArray = posAttr.array as Float32Array;
    const vel = velocitiesRef.current!;
    
    for (let i = 0; i < count; i++) {
      // Mover gota hacia abajo
      posArray[i * 3 + 1] -= vel[i] * delta * intensity;
      
      // Si la gota sale por abajo, reiniciar arriba
      if (posArray[i * 3 + 1] < -area.y / 2) {
        posArray[i * 3 + 1] = area.y / 2;
        posArray[i * 3] = (Math.random() - 0.5) * area.x;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * area.z;
      }
    }
    
    posAttr.needsUpdate = true;
  });
  
  // Opacidad basada en intensidad
  const opacity = MathUtils.clamp(intensity, 0, 1);
  
  if (intensity === 0) return null;
  
  return (
    <points ref={rainRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={RAIN_CONFIG.size}
        color={RAIN_CONFIG.color}
        transparent
        opacity={opacity * RAIN_CONFIG.maxOpacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
