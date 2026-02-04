'use client';

import { ReactNode } from 'react';
import { useTexture, Text3D, Center } from '@react-three/drei';
import { PIPBOY_COLORS, PipBoyDeviceProps } from '../types';

/**
 * Modelo 3D del dispositivo Pip-Boy
 * Construido con primitivas de Three.js
 */
export default function PipBoyDevice({ 
  children, 
  hovered,
  timeIndex = 1,
  showKnobs = true,
  showVents = true,
  showStraps = true,
  showScrews = true,
  showLED = true,
}: PipBoyDeviceProps) {
  // Cargar textura del Pip-Boy
  const pipboyTexture = useTexture('/texture-pipboy.png');
  
  // Determinar si es de noche (timeIndex 3 = NIGHT)
  const isNight = timeIndex === 3;
  
  return (
    <group>
      {/* Logo en 3D sobre el margen de la pantalla */}
      <group position={[0, 1.25, 0.12]}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.1}
            height={0.025}
            bevelEnabled
            bevelSize={0.006}
            bevelThickness={0.004}
            bevelSegments={3}
          >
            Lucas Diaz Cano 
            <meshStandardMaterial 
              color={isNight ? "#33ff66" : "#a8a8a8"}
              emissive={isNight ? "#33ff66" : "#404040"}
              emissiveIntensity={isNight ? 0.5 : 0.05}
              metalness={isNight ? 0.3 : 0.6}
              roughness={isNight ? 0.2 : 0.4}
            />
          </Text3D>
        </Center>
      </group>
      
      {/* Cuerpo principal del dispositivo */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[4.2, 2.8, 0.4]} />
        <meshStandardMaterial 
          map={pipboyTexture}
          color={PIPBOY_COLORS.deviceBody}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* Bisel superior */}
      <mesh position={[0, 1.5, -0.05]}>
        <boxGeometry args={[4.0, 0.15, 0.5]} />
        <meshStandardMaterial 
          map={pipboyTexture}
          color={PIPBOY_COLORS.deviceAccent} 
          metalness={0.15} 
          roughness={0.8} 
        />
      </mesh>

      {/* Bisel inferior */}
      <mesh position={[0, -1.5, -0.05]}>
        <boxGeometry args={[4.0, 0.15, 0.5]} />
        <meshStandardMaterial 
          map={pipboyTexture}
          color={PIPBOY_COLORS.deviceAccent} 
          metalness={0.15} 
          roughness={0.8} 
        />
      </mesh>

      {/* Panel lateral izquierdo con perillas */}
      <group position={[-2.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 2.5, 0.5]} />
          <meshStandardMaterial 
            map={pipboyTexture}
            color={PIPBOY_COLORS.deviceFrame} 
            metalness={0.1} 
            roughness={0.85} 
          />
        </mesh>
        
        {/* Perillas */}
        {showKnobs && [-0.8, 0, 0.8].map((y, i) => (
          <group key={i} position={[-0.1, y, 0.15]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
              <meshStandardMaterial 
                color={hovered && i === 1 ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.deviceMetal} 
                metalness={0.2} 
                roughness={0.7} 
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Panel lateral derecho */}
      <group position={[2.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 2.5, 0.5]} />
          <meshStandardMaterial 
            map={pipboyTexture}
            color={PIPBOY_COLORS.deviceFrame} 
            metalness={0.1} 
            roughness={0.85} 
          />
        </mesh>
        
        {/* Ranuras de ventilación */}
        {showVents && [-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0.1, y, 0.1]}>
            <boxGeometry args={[0.1, 0.08, 0.3]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        ))}
      </group>

      {/* Correas */}
      {showStraps && (
        <>
          <mesh position={[0, 1.7, -0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[3.5, 0.4, 0.1]} />
            <meshStandardMaterial 
              map={pipboyTexture}
              color={PIPBOY_COLORS.strapLeather} 
              metalness={0}
              roughness={0.95} 
            />
          </mesh>
          <mesh position={[0, -1.7, -0.2]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[3.5, 0.4, 0.1]} />
            <meshStandardMaterial 
              map={pipboyTexture}
              color={PIPBOY_COLORS.strapLeather} 
              metalness={0}
              roughness={0.95} 
            />
          </mesh>
        </>
      )}

      {/* Tornillos decorativos */}
      {showScrews && [
        [-1.8, 1.2], [1.8, 1.2], [-1.8, -1.2], [1.8, -1.2]
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.06]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
          <meshStandardMaterial 
            color={PIPBOY_COLORS.deviceScrew} 
            metalness={0.3} 
            roughness={0.6} 
          />
        </mesh>
      ))}

      {/* LED indicador */}
      {showLED && (
        <mesh position={[1.9, 1.2, 0.1]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={hovered ? PIPBOY_COLORS.ledActive : PIPBOY_COLORS.ledInactive} 
          />
        </mesh>
      )}

      {/* Marco de la pantalla */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.7, 2.4, 0.08]} />
        <meshStandardMaterial 
          color="#050505" 
          metalness={0.1} 
          roughness={0.9} 
        />
      </mesh>

      {/* Pantalla (children = el mesh con la textura) */}
      {children}

      {/* Vidrio protector de la pantalla */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[3.5, 2.2]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.03}
        />
      </mesh>
    </group>
  );
}
