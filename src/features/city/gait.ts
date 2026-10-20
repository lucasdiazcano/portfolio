import { RUN_SPEED, WALK_SPEED, type Motion } from './locomotion';
import { groundHeight } from './world';

export const UPPER_LEG = 0.38;
export const LOWER_LEG = 0.37;
export const SOLE_OFFSET = 0.0775;
export const HIP_HEIGHT = 0.86;
export const BODY_OFFSET = -0.15;

export interface Foot {
  x: number;
  y: number;
  z: number;
  yaw: number;
  duration: number;
  steps: number;
  progress: number;
  startX: number;
  startY: number;
  startZ: number;
  startYaw: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetYaw: number;
}

/** Creates two grounded ankle anchors under the hips; also used after a spawn reset. */
export function createFeet(motion: Motion): Foot[] {
  return [-1, 1].map((side) => {
    const x = motion.x + Math.cos(motion.heading) * side * 0.155;
    const z = motion.z - Math.sin(motion.heading) * side * 0.155;
    const y = groundHeight(x, z) + SOLE_OFFSET;
    return { x, y, z, yaw: motion.heading, duration: 0.3, steps: 0, progress: 1, startX: x, startY: y, startZ: z, startYaw: motion.heading, targetX: x, targetY: y, targetZ: z, targetYaw: motion.heading };
  });
}

/** Keeps stance anchors fixed in world space and moves swinging feet along a raised arc.
 * Longer swings and a forward landing replace the rapid short-step shuffle. Swing targets
 * adapt to braking; planted feet stay fixed. Each step retains its duration across speed changes.
 */
export function advanceFeet(feet: Foot[], motion: Motion, delta: number): void {
  const dt = Math.min(delta, 0.05);
  const running = Math.max(0, Math.min(1, (motion.speed - WALK_SPEED) / (RUN_SPEED - WALK_SPEED)));
  const velocity = Math.hypot(motion.vx, motion.vz);
  const reach = (0.28 - running * 0.03) * Math.min(1, velocity / WALK_SPEED);
  const directionX = velocity > 0 ? motion.vx / velocity : 0;
  const directionZ = velocity > 0 ? motion.vz / velocity : 0;
  let started = false;
  for (let index = 0; index < 2; index++) {
    const foot = feet[index];
    const side = index === 0 ? -1 : 1;
    const neutralX = motion.x + Math.cos(motion.heading) * side * 0.155;
    const neutralZ = motion.z - Math.sin(motion.heading) * side * 0.155;
    const starting = foot.steps === 0 && velocity > 0.05;
    const threshold = starting ? 0.035 : velocity > 0.05 ? 0.28 - running * 0.05 : 0.12;
    const separation = Math.hypot(neutralX - foot.x, neutralZ - foot.z);
    // Release a stretched support even when a surface change disrupted the alternating rhythm.
    const canLift = feet[1 - index].progress >= (running > 0.2 ? 0.45 : 0.96) || separation > 0.3;
    if (!started && foot.progress === 1 && canLift && separation > threshold) {
      foot.startX = foot.x;
      foot.startY = foot.y;
      foot.startZ = foot.z;
      foot.startYaw = foot.yaw;
      foot.duration = starting && feet[1 - index].steps === 0 ? 0.16 : 0.3 - running * 0.1;
      foot.steps += 1;
      // Land ahead of the body at the end of the swing, rather than just ahead at lift-off.
      foot.targetX = neutralX + motion.vx * foot.duration + directionX * reach;
      foot.targetZ = neutralZ + motion.vz * foot.duration + directionZ * reach;
      foot.targetY = groundHeight(foot.targetX, foot.targetZ) + SOLE_OFFSET;
      foot.targetYaw = motion.heading;
      foot.progress = 0;
      started = true;
    }
    if (foot.progress < 1) {
      const remaining = foot.duration * (1 - foot.progress);
      const retarget = 1 - Math.exp(-18 * dt);
      foot.targetX += (neutralX + motion.vx * remaining + directionX * reach - foot.targetX) * retarget;
      foot.targetZ += (neutralZ + motion.vz * remaining + directionZ * reach - foot.targetZ) * retarget;
      foot.targetY = groundHeight(foot.targetX, foot.targetZ) + SOLE_OFFSET;
      foot.progress = Math.min(1, foot.progress + dt / foot.duration);
      const t = foot.progress;
      const ease = t * t * t * (10 - 15 * t + 6 * t * t);
      foot.x = foot.startX + (foot.targetX - foot.startX) * ease;
      foot.z = foot.startZ + (foot.targetZ - foot.startZ) * ease;
      const arc = Math.sin(Math.PI * t) ** 2 * (0.045 + running * 0.05);
      const surface = groundHeight(foot.x, foot.z) + SOLE_OFFSET;
      foot.y = Math.max(surface, foot.startY + (foot.targetY - foot.startY) * ease + arc);
      const turn = Math.atan2(Math.sin(foot.targetYaw - foot.startYaw), Math.cos(foot.targetYaw - foot.startYaw));
      foot.yaw = foot.startYaw + turn * ease;
    }
  }
}

/** Solves a two-bone leg in hip-local coordinates, bending the knee toward local +Z.
 * Targets beyond the physical leg length are clamped rather than producing invalid rotations.
 * @returns Knee and reachable ankle positions relative to the hip, in meters.
 */
export function solveLeg(x: number, y: number, z: number) {
  const requested = Math.hypot(x, y, z);
  const distance = Math.max(0.02, Math.min(UPPER_LEG + LOWER_LEG - 0.0001, requested));
  const dx = requested > 0 ? x / requested : 0;
  const dy = requested > 0 ? y / requested : -1;
  const dz = requested > 0 ? z / requested : 0;
  // Project forward onto the plane perpendicular to the leg direction.
  let bx = -dz * dx;
  let by = -dz * dy;
  let bz = 1 - dz * dz;
  const bendLength = Math.hypot(bx, by, bz);
  if (bendLength < 0.0001) { bx = 0; by = 1; bz = 0; }
  else { bx /= bendLength; by /= bendLength; bz /= bendLength; }
  const along = (UPPER_LEG ** 2 - LOWER_LEG ** 2 + distance ** 2) / (2 * distance);
  const bend = Math.sqrt(Math.max(0, UPPER_LEG ** 2 - along ** 2));
  return {
    knee: [dx * along + bx * bend, dy * along + by * bend, dz * along + bz * bend] as [number, number, number],
    ankle: [dx * distance, dy * distance, dz * distance] as [number, number, number],
  };
}

/** Keeps the body within reach of its lowest supporting foot while stepping onto a curb.
 * @returns Root height in world space; swinging feet never lower the support plane.
 */
export function bodyHeight(motion: Motion, feet: Foot[]): number {
  let surface = groundHeight(motion.x, motion.z);
  for (const foot of feet) {
    if (foot.progress === 1) surface = Math.min(surface, foot.y - SOLE_OFFSET);
  }
  return surface + BODY_OFFSET;
}
