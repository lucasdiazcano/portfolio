import { canWalk } from './world';

// World-space pace matched to the avatar's 0.75m legs.
export const WALK_SPEED = 4;
export const RUN_SPEED = 8;

export interface Motion {
  x: number;
  z: number;
  vx: number;
  vz: number;
  heading: number;
  distance: number;
  speed: number;
}

/** Advances camera-relative motion; blocked axes lose velocity and only actual travel drives gait.
 * Disabled controls stop immediately so a project dialog cannot move the player underneath it.
 */
export function advanceMotion(motion: Motion, forward: number, side: number, yaw: number, running: boolean, enabled: boolean, delta: number): void {
  const dt = Math.min(delta, 0.05);
  const length = Math.hypot(forward, side);
  const speed = running ? RUN_SPEED : WALK_SPEED;
  const blend = 1 - Math.exp(-(length ? 9 : 14) * dt);
  const dx = length ? (side * Math.cos(yaw) - forward * Math.sin(yaw)) / length : 0;
  const dz = length ? (-forward * Math.cos(yaw) - side * Math.sin(yaw)) / length : 0;
  motion.vx = enabled ? motion.vx + (dx * speed - motion.vx) * blend : 0;
  motion.vz = enabled ? motion.vz + (dz * speed - motion.vz) * blend : 0;
  if (!length && Math.hypot(motion.vx, motion.vz) < 0.025) motion.vx = motion.vz = 0;
  const oldX = motion.x;
  const oldZ = motion.z;
  const nextX = oldX + motion.vx * dt;
  const nextZ = oldZ + motion.vz * dt;
  if (canWalk(nextX, oldZ)) motion.x = nextX;
  else motion.vx = 0;
  if (canWalk(motion.x, nextZ)) motion.z = nextZ;
  else motion.vz = 0;
  const travel = Math.hypot(motion.x - oldX, motion.z - oldZ);
  motion.distance += travel;
  motion.speed = dt > 0 ? travel / dt : 0;
  if (travel > 0.0001) {
    const angle = Math.atan2(motion.x - oldX, motion.z - oldZ);
    motion.heading += Math.atan2(Math.sin(angle - motion.heading), Math.cos(angle - motion.heading)) * (1 - Math.exp(-12 * dt));
  }
}

/** Clips the entire player-to-camera segment, including a smoothed candidate, before any wall.
 * Uses the existing conservative horizontal footprint to leave clearance around architecture.
 */
export function cameraFraction(x: number, z: number, cameraX: number, cameraZ: number): number {
  const steps = Math.ceil(Math.hypot(cameraX - x, cameraZ - z) / 0.08);
  for (let step = 1; step <= steps; step++) {
    const fraction = step / steps;
    if (!canWalk(x + (cameraX - x) * fraction, z + (cameraZ - z) * fraction)) return (step - 1) / steps;
  }
  return 1;
}
