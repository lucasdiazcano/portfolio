'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Html, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { findPath, followPath, type Waypoint } from './navigation';
import styles from './city.module.css';
import Avatar from './Avatar';
import MuseumRooms from './MuseumRooms';
import { advanceMotion, cameraFraction, RUN_SPEED, WALK_SPEED, type Motion } from './locomotion';
import type { BenchmarkTour } from './benchmark';
import PortenoCorner from './PortenoCorner';
import { Block, Sign } from './ScenePrimitives';
import { BUILDINGS, GALLERY, groundHeight, MUSEUM_ROOMS, nearbyExhibit, SPAWN, WORLD_BOUNDS, type MuseumRoom } from './world';

export type CameraView = 'isometric' | 'third-person';
export type NavigationStatus = 'idle' | 'moving' | 'arrived' | 'unreachable';

export interface GameInput {
  view: CameraView;
  zoom: number;
  command: (Waypoint & { room: number | null }) | null;
  keys: Set<string>;
  enabled: boolean;
  yaw: number;
  pitch: number;
  reset: number;
  tour?: BenchmarkTour;
}

interface SceneProps {
  input: MutableRefObject<GameInput>;
  onExhibit: (index: number) => void;
  marker: MutableRefObject<HTMLSpanElement | null>;
  rooms: MuseumRoom[];
  spanish: boolean;
  view: CameraView;
  interactive: boolean;
  onReadRoom: (index: number) => void;
  onNavigate: (command: GameInput['command']) => void;
  onNavigationStatus: (status: NavigationStatus) => void;
}

/** Instances facade windows with one geometry and one material per building. */
function Windows({ x, z, width, depth, height }: typeof BUILDINGS[number]) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const columns = Math.floor(width / 2);
  const floors = Math.floor((height - 2) / 2.5);
  useEffect(() => {
    const dummy = new THREE.Object3D();
    let index = 0;
    for (let floor = 0; floor < floors; floor++) {
      for (let column = 0; column < columns; column++) {
        dummy.position.set(x - width / 2 + 1 + column * 2, 2.5 + floor * 2.5, z + depth / 2 + 0.02);
        dummy.updateMatrix();
        ref.current?.setMatrixAt(index++, dummy.matrix);
      }
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.computeBoundingSphere();
    }
  }, [columns, depth, floors, width, x, z]);
  return <instancedMesh ref={ref} args={[undefined, undefined, columns * floors]}>
    <boxGeometry args={[0.8, 1.1, 0.06]} /><meshStandardMaterial color="#ffc98c" emissive="#efaa63" emissiveIntensity={0.65} />
  </instancedMesh>;
}

/** Provides a readable, walkable district and a walkable museum of the owner’s career. */
function District({ rooms, spanish, view, cutaway }: Pick<SceneProps, 'rooms' | 'spanish' | 'view'> & { cutaway: boolean }) {
  return <>
    <color attach="background" args={['#a3b1b4']} />
    <fog attach="fog" args={['#a3b1b4', 28, 105]} />
    <hemisphereLight args={['#d4e1e3', '#625446', 1.6]} />
    <directionalLight position={[-15, 25, 18]} intensity={2.8} color="#ffd8ae" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-32} shadow-camera-right={32} shadow-camera-top={32} shadow-camera-bottom={-32} shadow-normalBias={0.04} />
    <Block at={[0, -0.22, -5]} size={[100, 0.4, 120]} color="#464e53" />
    <Block at={[-16, -0.02, -5]} size={[14, 0.3, 70]} color="#8a8d89" />
    <Block at={[16, -0.02, -5]} size={[14, 0.3, 70]} color="#8a8d89" />
    <Block at={[0, -0.02, GALLERY.z]} size={[GALLERY.width, 0.22, GALLERY.depth]} color="#cec7b6" />
    {Array.from({ length: 8 }, (_, i) => <Block key={`road-${i}`} at={[0, 0.005, 23 - i * 4]} size={[0.13, 0.015, 1.8]} color="#cdc2a2" />)}
    {[-1, 1].map((side) => <Block key={side} at={[side * 8.8, 0.04, 7]} size={[0.08, 0.03, 30]} color="#d6bb88" />)}
    {Array.from({ length: 7 }, (_, i) => <Block key={`cross-${i}`} at={[-5.4 + i * 1.8, 0.015, 3]} size={[0.85, 0.02, 3.2]} color="#e1dccb" />)}
    {BUILDINGS.map((building, index) => {
      const b = { ...building, height: view === 'isometric' ? Math.min(building.height, 6) : building.height };
      return <group key={index}>
      <Block at={[b.x, b.height / 2, b.z]} size={[b.width, b.height, b.depth]} color={b.color} />
      <Block at={[b.x, b.height, b.z]} size={[b.width + 0.5, 0.35, b.depth + 0.5]} color="#b3b0a5" />
      <Block at={[b.x, 1.3, b.z + b.depth / 2 + 0.08]} size={[b.width, 2.6, 0.15]} color="#343e43" />
      <Windows {...b} />
    </group>; })}
    <PortenoCorner rooms={rooms} spanish={spanish} cutaway={cutaway} />
    <MuseumRooms rooms={rooms} spanish={spanish} cutaway={cutaway} />
    <Sign text="DISTRITO" at={[-17, view === 'isometric' ? 5.3 : 10.2, 14.1]} size={1.2} color="#d7ffb1" />
    <Sign text="BUENOS AIRES / 01" at={[-17, view === 'isometric' ? 4.7 : 8.9, 14.1]} size={0.22} />
    <Sign text="ESTUDIO" at={[17, 3.2, 16.1]} size={0.65} />
    <Sign text="LUCAS DIAZ CANO" at={[17, 2.2, 16.1]} size={0.25} color="#d7ffb1" />
    <Sign text="LABORATORIO" at={[18, 3.6, -1.4]} size={0.47} color="#d7ffb1" />
    {[[-7, 7], [7, -2]].map(([x, z]) => <group key={`planter-${x}`}>
      <Block at={[x, 0.4, z]} size={[1.8, 0.8, 4]} color="#747f78" />
      {[0, 1, 2].map((n) => <mesh key={n} position={[x, 1.2, z - 1.2 + n * 1.2]} castShadow><icosahedronGeometry args={[0.85, 0]} /><meshStandardMaterial color="#586d55" /></mesh>)}
    </group>)}
    {/* Distant silhouettes are scenery outside the accessible district. */}
    {Array.from({ length: 16 }, (_, i) => <Block key={`sky-${i}`} at={[-65 + i * 9, 8 + (i % 4) * 3, -75]} size={[7, 16 + (i % 4) * 6, 8]} color="#747e85" />)}
  </>;
}

/** Follows click routes or manual controls, opens rooms on arrival and preserves position across cameras. */
function Player({ input, onExhibit, marker, rooms, onReadRoom, onNavigate, onNavigationStatus, onInside }: Omit<SceneProps, 'spanish' | 'view' | 'interactive'> & { onInside: (inside: boolean) => void }) {
  const motion = useRef<Motion>({ ...SPAWN, vx: 0, vz: 0, heading: Math.PI, distance: 0, speed: 0 });
  const lastExhibit = useRef(-1);
  const lastView = useRef<CameraView | null>(null);
  const inside = useRef(false);
  const route = useRef<Waypoint[]>([]);
  const lastCommand = useRef<GameInput['command']>(null);
  const destination = useRef<THREE.Group>(null);
  const cameraReady = useRef(false);
  const lastReset = useRef(0);
  const target = useRef(new THREE.Vector3());
  const focus = useRef(new THREE.Vector3());
  useFrame(({ camera, size }, elapsed) => {
    const delta = Math.min(elapsed, 0.05);
    const control = input.current;
    if (control.reset !== lastReset.current) {
      Object.assign(motion.current, SPAWN, { vx: 0, vz: 0, heading: Math.PI, distance: 0, speed: 0 });
      lastReset.current = control.reset;
      cameraReady.current = false;
      route.current = [];
      onNavigate(null);
      onNavigationStatus('idle');
    }
    if (lastView.current !== control.view) {
      cameraReady.current = false;
      lastView.current = control.view;
      route.current = [];
      onNavigate(null);
      motion.current.vx = motion.current.vz = motion.current.speed = 0;
      onNavigationStatus('idle');
    }
    const keys = control.keys;
    let forward = 0;
    let side = 0;
    if (control.enabled) {
      forward = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
      side = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
    }
    const touring = control.tour?.active ?? false;
    if (touring && control.tour) {
      forward = control.tour.direction(motion.current.x, motion.current.z, performance.now());
      side = 0;
    }
    const manual = forward !== 0 || side !== 0;
    if (manual && control.command) {
      onNavigate(null);
      route.current = [];
      onNavigationStatus('idle');
    }
    if (control.command !== lastCommand.current) {
      lastCommand.current = control.command;
      route.current = control.command ? findPath(motion.current, control.command) : [];
      if (control.command) {
        onNavigationStatus(route.current.length ? 'moving' : 'unreachable');
        if (!route.current.length) onNavigate(null);
      }
    }
    if (control.enabled && control.view === 'isometric' && control.command && route.current.length) {
      const safe = followPath(motion.current, route.current, delta, keys.has('ShiftLeft') || keys.has('ShiftRight'));
      if (!safe) { onNavigate(null); onNavigationStatus('unreachable'); }
      else if (!route.current.length) {
        const room = control.command.room;
        onNavigate(null);
        motion.current.vx = motion.current.vz = motion.current.speed = 0;
        onNavigationStatus('arrived');
        if (room !== null) onReadRoom(room);
      }
    } else {
      advanceMotion(motion.current, forward, side, control.view === 'isometric' ? Math.PI / 4 : control.yaw, !touring && (keys.has('ShiftLeft') || keys.has('ShiftRight')), control.enabled || touring, delta);
    }
    const { x, z } = motion.current;
    const inMuseum = Math.abs(x) < 9.5 && z < -7.8 && z > -47;
    if (inMuseum !== inside.current) { inside.current = inMuseum; onInside(inMuseum); }
    if (destination.current) {
      destination.current.visible = control.view === 'isometric' && control.command !== null;
      if (control.command) destination.current.position.set(control.command.x, groundHeight(control.command.x, control.command.z) + 0.04, control.command.z);
    }
    if (control.view === 'isometric') {
      if (camera instanceof THREE.OrthographicCamera) {
        const zoom = Math.min(size.width / 30, size.height / 24) * control.zoom;
        if (Math.abs(camera.zoom - zoom) > 0.001) { camera.zoom = zoom; camera.updateProjectionMatrix(); }
      }
      target.current.set(x + 18, 18.8, z + 18);
      if (!cameraReady.current) { camera.position.copy(target.current); focus.current.set(x, 0.8, z); cameraReady.current = true; }
      camera.position.lerp(target.current, 1 - Math.exp(-8 * delta));
      focus.current.lerp(target.current.set(x, 0.8, z), 1 - Math.exp(-8 * delta));
      camera.lookAt(focus.current);
    }
    const exhibit = nearbyExhibit(x, z, rooms.length);
    if (exhibit !== lastExhibit.current) { lastExhibit.current = exhibit; onExhibit(exhibit); }
    if (marker.current) {
      marker.current.style.setProperty('left', `${(x - WORLD_BOUNDS.minX) / (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX) * 100}%`);
      marker.current.style.setProperty('top', `${(z - WORLD_BOUNDS.minZ) / (WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ) * 100}%`);
    }
    if (control.view === 'isometric') return;
    // Running opens the framing slightly; walls always take precedence over that distance.
    const distance = 4.8 + Math.max(0, (motion.current.speed - WALK_SPEED) / (RUN_SPEED - WALK_SPEED)) * 0.6;
    const camX = x + Math.sin(control.yaw) * distance;
    const camZ = z + Math.cos(control.yaw) * distance;
    const safe = cameraFraction(x, z, camX, camZ);
    target.current.set(x + (camX - x) * safe, 2.7 + control.pitch, z + (camZ - z) * safe);
    if (!cameraReady.current) {
      camera.position.copy(target.current);
      focus.current.set(x, 1.4, z);
      cameraReady.current = true;
    }
    camera.position.lerp(target.current, 1 - Math.exp(-10 * delta));
    const smoothedSafe = cameraFraction(x, z, camera.position.x, camera.position.z);
    camera.position.x = x + (camera.position.x - x) * smoothedSafe;
    camera.position.z = z + (camera.position.z - z) * smoothedSafe;
    focus.current.lerp(target.current.set(x, 1.4, z), 1 - Math.exp(-16 * delta));
    camera.lookAt(focus.current);
  });
  return <><Avatar motion={motion} /><group ref={destination} visible={false}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.27, 0.34, 32]} /><meshBasicMaterial color="#d7ff9e" depthWrite={false} /></mesh>
  </group></>;
}

/** Composes interchangeable cameras without remounting the player or resetting its position. */
export default function CityScene(props: SceneProps) {
  const [inside, setInside] = useState(false);
  const cutaway = props.view === 'isometric' && inside;
  return <>
    {props.view === 'isometric' ? <OrthographicCamera makeDefault position={[18, 18.8, 33]} zoom={30} near={0.1} far={200} /> : <PerspectiveCamera makeDefault fov={55} near={0.1} far={200} />}
    <District rooms={props.rooms} spanish={props.spanish} view={props.view} cutaway={cutaway} />
    <Player {...props} onInside={setInside} />
    {props.view === 'isometric' && <>
      <mesh position={[0, 0.15, -15]} rotation={[-Math.PI / 2, 0, 0]} onClick={(event) => {
        if (!props.input.current.enabled || props.input.current.tour?.active) return;
        event.stopPropagation();
        props.onNavigate({ x: event.point.x, z: event.point.z, room: null });
      }}>
        <planeGeometry args={[50, 78]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {props.interactive && props.rooms.map((room, index) => <Html key={room.brandId} center position={[MUSEUM_ROOMS[index].x, 1.1, MUSEUM_ROOMS[index].z]} zIndexRange={[2, 0]}>
        <button className={styles.roomPin} style={{ borderColor: index === 0 ? '#c1d72f' : undefined }} aria-label={`${props.spanish ? 'Visitar' : 'Visit'} ${room.label}`} onClick={(event) => {
          event.stopPropagation();
          if (!props.input.current.enabled) return;
          props.onNavigate({ x: MUSEUM_ROOMS[index].x, z: MUSEUM_ROOMS[index].z, room: index });
        }}><span>{String(index + 1).padStart(2, '0')}</span>{room.label}<small>{props.spanish ? 'Visitar y leer' : 'Visit and read'} ↗</small></button>
      </Html>)}
    </>}
  </>;
}
