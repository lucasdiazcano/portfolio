'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COMPANY_BRANDS } from './brands';
import { Sign } from './ScenePrimitives';
import { CORNER_BENCHES, STREET_LAMPS, type MuseumRoom } from './world';

type Detail = { at: [number, number, number]; size: [number, number, number] };

const STONE: Detail[] = [
  { at: [0, 5.9, -8], size: [19.5, 2.7, 0.65] },
  { at: [0, 7.35, -8], size: [20, 0.28, 0.95] },
  { at: [0, 7.57, -8], size: [20.5, 0.16, 1.2] },
  { at: [0, 5.1, -7.62], size: [19.5, 0.18, 0.25] },
  ...Array.from({ length: 23 }, (_, index): Detail => ({ at: [-9.35 + index * 0.85, 7.78, -7.8], size: [0.45, 0.15, 0.65] })),
  ...[-9.5, 9.5].map((x): Detail => ({ at: [x, 5.9, -10.5], size: [0.5, 2.7, 5.5] })),
  ...[-5.9, 5.9].map((x): Detail => ({ at: [x, -0.02, -3.62], size: [7.6, 0.14, 0.18] })),
  ...[-9.25, -2.3, 2.3, 9.25].flatMap((x): Detail[] => [
    { at: [x, 2.3, -7.68], size: [0.46, 4.6, 0.5] },
    { at: [x, 0.32, -7.53], size: [0.65, 0.64, 0.65] },
    { at: [x, 4.4, -7.6], size: [0.7, 0.3, 0.65] },
  ]),
  ...[-5.8, 5.8].flatMap((x): Detail[] => [
    { at: [x, 2.25, -8.02], size: [7.5, 4.5, 0.5] },
    { at: [x, 0.15, -7.6], size: [7.6, 0.3, 0.65] },
  ]),
];

const JOINERY: Detail[] = [
  { at: [0, 6.2, -7.6], size: [13.8, 1.25, 0.2] },
  ...[-5.8, 5.8].flatMap((x): Detail[] => [
    { at: [x, 4.72, -7.48], size: [5.8, 0.72, 0.12] },
    ...[-1.35, 1.35].flatMap((offset): Detail[] => [
      { at: [x + offset, 2.35, -7.49], size: [2.1, 2.8, 0.18] },
      { at: [x + offset, 3.75, -7.49], size: [2.1, 0.28, 0.18] },
    ]),
  ]),
  ...[-2.02, 2.02].map((x): Detail => ({ at: [x, 1.3, -7.55], size: [0.2, 2.6, 0.35] })),
  { at: [-8.7, 3.8, -7.28], size: [1.45, 0.62, 0.12] },
  { at: [8.7, 3.8, -7.28], size: [1.45, 0.62, 0.12] },
];

const GLASS: Detail[] = [-7.15, -4.45, 4.45, 7.15].flatMap((x): Detail[] => [
  { at: [x, 2.5, -7.37], size: [1.76, 2.35, 0.045] },
]);

const BRASS: Detail[] = [
  { at: [0, 6.85, -7.45], size: [14.1, 0.055, 0.08] },
  { at: [0, 5.55, -7.45], size: [14.1, 0.055, 0.08] },
  ...[-7.15, -4.45, 4.45, 7.15].flatMap((x): Detail[] => [
    { at: [x, 2.5, -7.3], size: [0.045, 2.4, 0.04] },
    { at: [x, 2.5, -7.3], size: [1.8, 0.045, 0.04] },
  ]),
];

const METAL: Detail[] = STREET_LAMPS.flatMap(([x, z]): Detail[] => [
  { at: [x, 0.2, z], size: [0.4, 0.4, 0.4] },
  { at: [x, 4.5, z], size: [0.65, 0.12, 0.65] },
  { at: [x, 3.85, z], size: [0.55, 0.12, 0.55] },
  ...[-1, 1].flatMap((side): Detail[] => [
    { at: [x + side * 0.22, 4.17, z], size: [0.045, 0.6, 0.48] },
  ]),
]);

const POLES: Detail[] = STREET_LAMPS.map(([x, z]) => ({ at: [x, 1.95, z], size: [0.14, 3.9, 0.14] }));
const LANTERNS: Detail[] = STREET_LAMPS.map(([x, z]) => ({ at: [x, 4.17, z], size: [0.43, 0.5, 0.43] }));
const WOOD: Detail[] = CORNER_BENCHES.flatMap(({ x, z }): Detail[] => [
  ...[-0.3, 0, 0.3].map((offset): Detail => ({ at: [x, 0.48, z + offset], size: [2.3, 0.1, 0.22] })),
  ...[0.78, 1.02].map((height): Detail => ({ at: [x, height, z - 0.4], size: [2.3, 0.16, 0.08] })),
]);
const BENCH_LEGS: Detail[] = CORNER_BENCHES.flatMap(({ x, z }): Detail[] => [-0.8, 0.8].map((offset): Detail => ({ at: [x + offset, 0.3, z], size: [0.12, 0.6, 0.85] })));

/** Batches repeated architectural details into one draw call per geometry/material. */
function DetailBatch({ parts, material, cylinder = false }: { parts: Detail[]; material: THREE.Material; cylinder?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    parts.forEach((part, index) => {
      dummy.position.set(...part.at);
      dummy.scale.set(...part.size);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(index, dummy.matrix);
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.computeBoundingSphere();
    }
  }, [parts]);
  return <instancedMesh ref={ref} args={[undefined, undefined, parts.length]} material={material} castShadow receiveShadow>
    {cylinder ? <cylinderGeometry args={[0.5, 0.65, 1, 8]} /> : <boxGeometry args={[1, 1, 1]} />}
  </instancedMesh>;
}

/** Builds a local geometric pavement texture without external images or font downloads. */
function createPavement(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Pavement texture requires a 2D canvas context.');
  context.fillStyle = '#c9bca5';
  context.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 2; column++) {
      const x = column * 128;
      const y = row * 128;
      context.fillStyle = '#e0d5bf';
      context.fillRect(x + 2, y + 2, 124, 124);
      context.fillStyle = '#50605a';
      context.beginPath();
      context.moveTo(x + 64, y + 20); context.lineTo(x + 108, y + 64);
      context.lineTo(x + 64, y + 108); context.lineTo(x + 20, y + 64);
      context.closePath(); context.fill();
      context.fillStyle = '#b5965c';
      context.fillRect(x + 59, y + 59, 10, 10);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 3.6);
  texture.anisotropy = 4;
  return texture;
}

/** Creates a small reusable brick albedo; surface response stays in a shared material. */
function createBrick(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Brick texture requires a 2D canvas context.');
  context.fillStyle = '#b1a28d';
  context.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    for (let column = -1; column < 5; column++) {
      context.fillStyle = ['#8b5843', '#945c45', '#804c3b'][(row + column + 3) % 3];
      context.fillRect(column * 64 + (row % 2) * 32 + 1, row * 16 + 1, 62, 14);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 3);
  texture.anisotropy = 4;
  return texture;
}

/** Produces the gallery's porteño frontage, pavement, benches and coherent street lanterns. */
export default function PortenoCorner({ rooms, spanish, cutaway }: { rooms: MuseumRoom[]; spanish: boolean; cutaway: boolean }) {
  const materials = useMemo(() => ({
    stone: new THREE.MeshStandardMaterial({ color: '#d8c7aa', roughness: 0.93 }),
    green: new THREE.MeshStandardMaterial({ color: '#24473e', roughness: 0.58, metalness: 0.15 }),
    glass: new THREE.MeshStandardMaterial({ color: '#476c68', roughness: 0.28, metalness: 0.5 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b69455', roughness: 0.4, metalness: 0.65 }),
    metal: new THREE.MeshStandardMaterial({ color: '#283632', roughness: 0.65, metalness: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ color: '#8d5437', roughness: 0.85 }),
    lantern: new THREE.MeshStandardMaterial({ color: '#ffe3a4', emissive: '#ffd58e', emissiveIntensity: 1.2, roughness: 0.4 }),
  }), []);
  const pavement = useMemo(() => createPavement(), []);
  const brick = useMemo(() => createBrick(), []);
  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
    pavement.dispose();
    brick.dispose();
  }, [materials, pavement, brick]);

  return <group>
    <group visible={!cutaway}>
    <DetailBatch parts={STONE} material={materials.stone} />
    <DetailBatch parts={JOINERY} material={materials.green} />
    <DetailBatch parts={GLASS} material={materials.glass} />
    <DetailBatch parts={BRASS} material={materials.brass} />
    </group>
    <DetailBatch parts={METAL} material={materials.metal} />
    <DetailBatch parts={POLES} material={materials.metal} cylinder />
    <DetailBatch parts={LANTERNS} material={materials.lantern} />
    <DetailBatch parts={WOOD} material={materials.wood} />
    <DetailBatch parts={BENCH_LEGS} material={materials.metal} />
    <group visible={!cutaway}>
    {[-5.8, 5.8].map((x) => <mesh key={x} position={[x, 2.3, -7.75]} receiveShadow>
      <planeGeometry args={[6.3, 4.1]} /><meshStandardMaterial map={brick} roughness={0.95} />
    </mesh>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, -5.8]} receiveShadow>
      <planeGeometry args={[19.6, 4.3]} /><meshStandardMaterial map={pavement} roughness={0.95} />
    </mesh>
    {/* Open arch follows the existing central doorway; no glass blocks the entrance. */}
    <mesh position={[0, 2.6, -7.55]} material={materials.green} castShadow>
      <torusGeometry args={[2.02, 0.14, 8, 40, Math.PI]} />
    </mesh>
    {[-7.15, -4.45, 4.45, 7.15].map((x) => <mesh key={x} position={[x, 3.55, -7.4]} material={materials.green}>
      <torusGeometry args={[0.88, 0.1, 6, 24, Math.PI]} />
    </mesh>)}
    {[-7.15, -4.45, 4.45, 7.15].map((x) => <mesh key={`glass-${x}`} position={[x, 3.55, -7.42]} material={materials.glass}>
      <circleGeometry args={[0.86, 24, 0, Math.PI]} />
    </mesh>)}
    <Sign text="DISTRITO" at={[0, 6.35, -7.43]} size={0.68} color="#f4e7cc" />
    <Sign text={spanish ? 'MUSEO DE MI TRAYECTORIA / BUENOS AIRES' : 'CAREER MUSEUM / BUENOS AIRES'} at={[0, 5.85, -7.43]} size={0.17} color="#d1b479" />
    <Sign text="DEFENSA" at={[-8.7, 3.9, -7.18]} size={0.17} />
    <Sign text="1200 - 1299" at={[-8.7, 3.68, -7.18]} size={0.09} />
    <Sign text="PASAJE" at={[8.7, 3.9, -7.18]} size={0.17} />
    <Sign text="DISTRITO" at={[8.7, 3.68, -7.18]} size={0.1} />
    <Sign text="1200" at={[-2.65, 1.9, -7.2]} size={0.2} color="#6d5735" />
    <group position={[0, 4.72, -7.38]}>
      <mesh><planeGeometry args={[5.45, 0.52]} /><meshBasicMaterial color={COMPANY_BRANDS.globant.surface} /></mesh>
      <Sign text={rooms[0].label} at={[0, 0, 0.02]} size={0.34} color={COMPANY_BRANDS.globant.accent} />
    </group>
    </group>
    {[-8.3, 8.3].map((x) => <pointLight key={x} position={[x, 4.1, -3]} intensity={6} distance={9} color="#ffd79e" />)}
  </group>;
}
