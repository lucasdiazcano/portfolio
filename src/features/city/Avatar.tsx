'use client';

import { useFrame } from '@react-three/fiber';
import { Suspense, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import FaceMask from './FaceMask';
import { RUN_SPEED, WALK_SPEED, type Motion } from './locomotion';
import { Block } from './ScenePrimitives';
import { advanceFeet, bodyHeight, createFeet, HIP_HEIGHT, solveLeg } from './gait';

/** Rounded low-poly garment or limb, aligned vertically around its center. */
function Segment({ at, radius, length, color }: { at: [number, number, number]; radius: number; length: number; color: string }) {
  return <mesh position={at} castShadow><capsuleGeometry args={[radius, length, 3, 8]} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>;
}

/** Local articulated rig with world-anchored foot contacts, two-bone legs and a relaxed breathing idle. */
export default function Avatar({ motion }: { motion: MutableRefObject<Motion> }) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const thighs = useRef<(THREE.Group | null)[]>([]);
  const knees = useRef<(THREE.Group | null)[]>([]);
  const feet = useRef<(THREE.Group | null)[]>([]);
  const arms = useRef<(THREE.Group | null)[]>([]);
  const elbows = useRef<(THREE.Group | null)[]>([]);
  const anchors = useRef(createFeet(motion.current));
  const previous = useRef({ x: motion.current.x, z: motion.current.z, distance: motion.current.distance });
  const rig = useRef({ down: new THREE.Vector3(0, -1, 0), upper: new THREE.Vector3(), lower: new THREE.Vector3(), upperQ: new THREE.Quaternion(), lowerQ: new THREE.Quaternion(), footQ: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0) });
  const activity = useRef(0);
  const clock = useRef(0);
  useFrame((_, elapsed) => {
    const dt = Math.min(elapsed, 0.05);
    const state = motion.current;
    if (state.distance < previous.current.distance || Math.hypot(state.x - previous.current.x, state.z - previous.current.z) > 1) anchors.current = createFeet(state);
    Object.assign(previous.current, { x: state.x, z: state.z, distance: state.distance });
    advanceFeet(anchors.current, state, dt);
    const baseHeight = bodyHeight(state, anchors.current);
    clock.current += dt;
    activity.current = THREE.MathUtils.damp(activity.current, Math.min(state.speed / WALK_SPEED, 1), 14, dt);
    const weight = activity.current;
    const run = THREE.MathUtils.clamp((state.speed - WALK_SPEED) / (RUN_SPEED - WALK_SPEED), 0, 1);
    const stride = (anchors.current[0].x - anchors.current[1].x) * Math.sin(state.heading) + (anchors.current[0].z - anchors.current[1].z) * Math.cos(state.heading);
    if (root.current) {
      root.current.position.set(state.x, baseHeight, state.z);
      root.current.rotation.y = state.heading;
    }
    if (hips.current) hips.current.rotation.y = 0;
    if (torso.current) {
      torso.current.rotation.set(0.07 * weight + run * 0.1, -stride * 0.12 * weight, (anchors.current[0].y - anchors.current[1].y) * 0.15 * weight);
      torso.current.position.y = Math.sin(clock.current * 2) * 0.009 * (1 - weight);
    }
    for (let index = 0; index < 2; index++) {
      const anchor = anchors.current[index];
      const cos = Math.cos(state.heading);
      const sin = Math.sin(state.heading);
      const offsetX = anchor.x - state.x;
      const offsetZ = anchor.z - state.z;
      const localX = cos * offsetX - sin * offsetZ - (index === 0 ? -0.155 : 0.155);
      const localZ = sin * offsetX + cos * offsetZ;
      const localY = anchor.y - baseHeight - HIP_HEIGHT;
      const swing = Math.atan2(localZ, -localY) * weight;
      const solution = solveLeg(localX, localY, localZ);
      const vectors = rig.current;
      vectors.upper.fromArray(solution.knee).normalize();
      vectors.lower.set(solution.ankle[0] - solution.knee[0], solution.ankle[1] - solution.knee[1], solution.ankle[2] - solution.knee[2]).normalize();
      vectors.upperQ.setFromUnitVectors(vectors.down, vectors.upper);
      vectors.lowerQ.setFromUnitVectors(vectors.down, vectors.lower);
      const thigh = thighs.current[index];
      const knee = knees.current[index];
      const foot = feet.current[index];
      const arm = arms.current[index];
      const elbow = elbows.current[index];
      if (thigh) thigh.quaternion.copy(vectors.upperQ);
      if (knee) knee.quaternion.copy(vectors.upperQ).invert().multiply(vectors.lowerQ);
      if (foot) {
        vectors.footQ.setFromAxisAngle(vectors.up, anchor.yaw - state.heading);
        foot.quaternion.copy(vectors.lowerQ).invert().multiply(vectors.footQ);
      }
      if (arm) arm.rotation.x = swing * 0.75;
      if (elbow) elbow.rotation.x = -0.18 - run * 0.85 - Math.max(0, -swing) * 0.2 * weight;
    }
  });
  return <group ref={root}>
    <group ref={hips}>
      <Segment at={[0, 0.85, 0]} radius={0.18} length={0.08} color="#293f4c" />
      {[-1, 1].map((side, index) => <group key={side} ref={(value) => { thighs.current[index] = value; }} position={[side * 0.155, 0.86, 0]}>
        <Segment at={[0, -0.19, 0]} radius={0.115} length={0.22} color="#293f4c" />
        <group ref={(value) => { knees.current[index] = value; }} position={[0, -0.38, 0]}>
          <Segment at={[0, -0.19, 0]} radius={0.095} length={0.23} color="#243746" />
          <group ref={(value) => { feet.current[index] = value; }} position={[0, -0.37, 0]}>
            <Block at={[0, -0.025, 0.075]} size={[0.23, 0.105, 0.37]} color="#e6ddc9" />
            <Segment at={[0, 0.04, 0.06]} radius={0.105} length={0.015} color="#304944" />
            <Block at={[0, 0.025, 0.19]} size={[0.19, 0.065, 0.12]} color="#faf0db" />
          </group>
        </group>
      </group>)}
    </group>
    <group ref={torso}>
      <mesh position={[0, 1.17, 0]} scale={[1.35, 1, 0.8]} castShadow><capsuleGeometry args={[0.22, 0.29, 4, 10]} /><meshStandardMaterial color="#b96846" roughness={0.9} /></mesh>
      <Block at={[0, 1.16, 0.18]} size={[0.025, 0.5, 0.025]} color="#e3b787" />
      <Block at={[0.17, 1.29, 0.17]} size={[0.12, 0.12, 0.035]} color="#d29563" />
      <Segment at={[0, 1.53, 0]} radius={0.09} length={0.12} color="#c39a7d" />
      <Block at={[0, 1.22, -0.22]} size={[0.4, 0.48, 0.22]} color="#304944" />
      <Block at={[0, 1.14, -0.35]} size={[0.32, 0.19, 0.07]} color="#263c37" />
      <Block at={[0, 1.27, -0.343]} size={[0.23, 0.035, 0.025]} color="#d7ffb1" emissive />
      {[-1, 1].map((side, index) => <group key={side}>
        <Block at={[side * 0.21, 1.24, 0.15]} size={[0.065, 0.43, 0.055]} color="#304944" />
        <group ref={(value) => { arms.current[index] = value; }} position={[side * 0.34, 1.39, 0]} rotation={[0, 0, side * 0.08]}>
          <Segment at={[0, -0.14, 0]} radius={0.105} length={0.15} color="#b96846" />
          <group ref={(value) => { elbows.current[index] = value; }} position={[0, -0.29, 0]}>
            <Segment at={[0, -0.12, 0]} radius={0.085} length={0.15} color="#ad603f" />
            <Segment at={[0, -0.28, 0]} radius={0.073} length={0.04} color="#c39a7d" />
          </group>
        </group>
      </group>)}
      <mesh position={[0, 1.72, 0]} castShadow><sphereGeometry args={[0.22, 12, 10]} /><meshStandardMaterial color="#c39a7d" /></mesh>
      <mesh position={[0, 1.86, -0.01]} castShadow><sphereGeometry args={[0.23, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#243538" /></mesh>
      <Suspense fallback={null}><FaceMask /></Suspense>
    </group>
  </group>;
}
