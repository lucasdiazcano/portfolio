'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Droplet {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface ScreenDropletsProps {
  intensity?: number;
}

/**
 * Efecto de gotas de lluvia en la pantalla del PipBoy
 * Crea pequeñas esferas de agua que caen por la pantalla
 */
export default function ScreenDroplets({ intensity = 0 }: ScreenDropletsProps) {
  const dropletsRef = useRef<THREE.Group>(null);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  
  // Generar nuevas gotas cuando llueve
  useEffect(() => {
    if (intensity === 0) {
      setDroplets([]);
      return;
    }
    
    const interval = setInterval(() => {
      if (Math.random() < intensity * 0.3) {
        setDroplets(prev => {
          const newDroplets = [...prev, {
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 3.2,
            y: 1.0,
            size: 0.02 + Math.random() * 0.04,
            speed: 0.3 + Math.random() * 0.5
          }];
          // Limitar cantidad de gotas
          return newDroplets.slice(-20);
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [intensity]);
  
  useFrame((_, delta) => {
    setDroplets(prev => 
      prev
        .map(d => ({ ...d, y: d.y - d.speed * delta }))
        .filter(d => d.y > -1.2)
    );
  });
  
  if (intensity === 0) return null;
  
  return (
    <group ref={dropletsRef} position={[0, 0, 0.16]}>
      {droplets.map(droplet => (
        <mesh key={droplet.id} position={[droplet.x, droplet.y, 0]}>
          <sphereGeometry args={[droplet.size, 8, 8]} />
          <meshPhysicalMaterial
            color="#88bbff"
            transparent
            opacity={0.4}
            roughness={0}
            metalness={0}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
