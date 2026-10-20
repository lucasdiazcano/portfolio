'use client';

import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { FACE_TEXTURE } from './assets';

// Outline in the existing portrait's pixel coordinates, including hair and ears.
const OUTLINE = [
  [283, 109], [360, 122], [415, 161], [450, 218], [468, 304],
  [489, 311], [506, 346], [501, 393], [477, 429], [465, 494],
  [442, 566], [405, 629], [354, 675], [304, 696], [256, 675],
  [213, 632], [174, 578], [151, 510], [126, 441], [105, 421],
  [96, 377], [105, 349], [119, 353], [120, 282], [143, 220],
  [180, 164], [229, 125],
];

/** Mounts the optimized local portrait with the original outline's normalized UV coordinates. */
export default function FaceMask() {
  const portrait = useTexture(FACE_TEXTURE);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    OUTLINE.forEach(([x, y], index) => {
      const localX = (x - 300) * 0.0015;
      const localY = (420 - y) * 0.0015;
      if (index === 0) shape.moveTo(localX, localY);
      else shape.lineTo(localX, localY);
    });
    shape.closePath();
    const cutout = new THREE.ShapeGeometry(shape);
    const positions = cutout.getAttribute('position');
    const uv = cutout.getAttribute('uv');
    for (let index = 0; index < positions.count; index++) {
      const sourceX = positions.getX(index) / 0.0015 + 300;
      const sourceY = 420 - positions.getY(index) / 0.0015;
      uv.setXY(index, sourceX / 601, 1 - sourceY / 871);
    }
    return cutout;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <group position={[0, 1.82, 0.255]}>
    <mesh geometry={geometry} dispose={null}>
      <meshBasicMaterial map={portrait} toneMapped={false} side={THREE.FrontSide} />
    </mesh>
    <mesh geometry={geometry} position={[0, 0, -0.008]} dispose={null}>
      <meshStandardMaterial color="#e5dbc5" roughness={1} side={THREE.BackSide} />
    </mesh>
    <mesh position={[0, -0.03, -0.24]}>
      <boxGeometry args={[0.49, 0.045, 0.4]} />
      <meshStandardMaterial color="#263238" roughness={1} />
    </mesh>
  </group>;
}
