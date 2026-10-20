'use client';

import { Center, Text3D } from '@react-three/drei';
import { Suspense } from 'react';

/** Renders a solid architectural block with the district's standard surface response. */
export function Block({ at, size, color, emissive = false }: { at: [number, number, number]; size: [number, number, number]; color: string; emissive?: boolean }) {
  return <mesh position={at} castShadow={!emissive} receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.7} metalness={0.15} emissive={emissive ? color : '#000'} emissiveIntensity={emissive ? 2 : 0} />
  </mesh>;
}

/** Uses the bundled font offline, removing accent marks unsupported by its glyph set. DOM text retains accents. */
export function Sign({ text, at, size = 0.55, color = '#fff3d6' }: { text: string; at: [number, number, number]; size?: number; color?: string }) {
  return <group position={at}><Suspense fallback={null}><Center>
    <Text3D font="/fonts/helvetiker_regular.typeface.json" size={size} height={0.015} curveSegments={3}>
      {text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}<meshBasicMaterial color={color} />
    </Text3D>
  </Center></Suspense></group>;
}
