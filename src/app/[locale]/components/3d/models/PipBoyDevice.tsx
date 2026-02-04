'use client';

import { ReactNode } from 'react';
import { PIPBOY_COLORS, PipBoyDeviceProps } from '../types';

/**
 * Modelo 3D del dispositivo Pip-Boy
 * Construido con primitivas de Three.js
 */
export default function PipBoyDevice({ 
  children, 
  hovered,
  showKnobs = true,
  showVents = true,
  showStraps = true,
  showScrews = true,
  showLED = true,
}: PipBoyDeviceProps) {
  return (
    <group>
      {/* Cuerpo principal del dispositivo */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[4.2, 2.8, 0.4]} />
        <meshStandardMaterial 
          color={PIPBOY_COLORS.deviceBody}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Bisel superior */}
      <mesh position={[0, 1.5, -0.05]}>
        <boxGeometry args={[4.0, 0.15, 0.5]} />
        <meshStandardMaterial 
          color={PIPBOY_COLORS.deviceAccent} 
          metalness={0.3} 
          roughness={0.5} 
        />
      </mesh>

      {/* Bisel inferior */}
      <mesh position={[0, -1.5, -0.05]}>
        <boxGeometry args={[4.0, 0.15, 0.5]} />
        <meshStandardMaterial 
          color={PIPBOY_COLORS.deviceAccent} 
          metalness={0.3} 
          roughness={0.5} 
        />
      </mesh>

      {/* Panel lateral izquierdo con perillas */}
      <group position={[-2.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 2.5, 0.5]} />
          <meshStandardMaterial 
            color={PIPBOY_COLORS.deviceFrame} 
            metalness={0.2} 
            roughness={0.5} 
          />
        </mesh>
        
        {/* Perillas */}
        {showKnobs && [-0.8, 0, 0.8].map((y, i) => (
          <group key={i} position={[-0.1, y, 0.15]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
              <meshStandardMaterial 
                color={hovered && i === 1 ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.deviceMetal} 
                metalness={0.4} 
                roughness={0.4} 
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
            color={PIPBOY_COLORS.deviceFrame} 
            metalness={0.2} 
            roughness={0.5} 
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
            <meshStandardMaterial color={PIPBOY_COLORS.strapLeather} roughness={0.9} />
          </mesh>
          <mesh position={[0, -1.7, -0.2]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[3.5, 0.4, 0.1]} />
            <meshStandardMaterial color={PIPBOY_COLORS.strapLeather} roughness={0.9} />
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
            metalness={1} 
            roughness={0.2} 
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
          metalness={0.5} 
          roughness={0.5} 
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
