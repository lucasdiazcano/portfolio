import { canWalk, WORLD_BOUNDS } from './world';
import { RUN_SPEED, WALK_SPEED, type Motion } from './locomotion';

export interface Waypoint { x: number; z: number }
const CELL = 0.5;
const ROWS = Math.round((WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ) / CELL) + 1;
const COLUMNS = Math.round((WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX) / CELL) + 1;

/** Tests the complete character footprint along a segment, including narrow doorways. */
export function walkableSegment(from: Waypoint, to: Waypoint): boolean {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.z - from.z) / 0.1));
  for (let i = 0; i <= steps; i++) {
    if (!canWalk(from.x + (to.x - from.x) * i / steps, from.z + (to.z - from.z) * i / steps)) return false;
  }
  return true;
}

/** Finds a connected grid node for a valid exact point without moving the requested destination. */
function gridAnchor(point: Waypoint): number | null {
  const column = Math.round((point.x - WORLD_BOUNDS.minX) / CELL);
  const row = Math.round((point.z - WORLD_BOUNDS.minZ) / CELL);
  let nearest: number | null = null;
  let distance = Infinity;
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
    const x = column + dx;
    const z = row + dz;
    if (x < 0 || x >= COLUMNS || z < 0 || z >= ROWS) continue;
    const candidate = gridPoint(x * ROWS + z);
    const separation = Math.hypot(candidate.x - point.x, candidate.z - point.z);
    if (separation < distance && walkableSegment(point, candidate)) {
      nearest = x * ROWS + z;
      distance = separation;
    }
  }
  return nearest;
}

/** Converts the fixed navigation grid's node ID into horizontal world coordinates. */
function gridPoint(id: number): Waypoint {
  return { x: WORLD_BOUNDS.minX + Math.floor(id / ROWS) * CELL, z: WORLD_BOUNDS.minZ + (id % ROWS) * CELL };
}

/** Plans a bounded A* route against the existing collision contract.
 * Blocked or disconnected destinations return an empty route. The final point is exact;
 * smoothing removes grid zigzags only when the whole replacement segment is walkable.
 */
export function findPath(from: Waypoint, to: Waypoint): Waypoint[] {
  if (!canWalk(from.x, from.z) || !canWalk(to.x, to.z)) return [];
  if (walkableSegment(from, to)) return [{ x: to.x, z: to.z }];
  const start = gridAnchor(from);
  const goal = gridAnchor(to);
  if (start === null || goal === null) return [];
  const open = new Set([start]);
  const closed = new Set<number>();
  const costs = new Map([[start, 0]]);
  const parents = new Map<number, number>();
  while (open.size) {
    let current = start;
    let best = Infinity;
    for (const id of open) {
      const point = gridPoint(id);
      const score = costs.get(id)! + Math.hypot(point.x - to.x, point.z - to.z);
      if (score < best) { best = score; current = id; }
    }
    if (current === goal) {
      const points = [{ x: to.x, z: to.z }, gridPoint(goal)];
      while (current !== start) { current = parents.get(current)!; points.push(gridPoint(current)); }
      points.push(from);
      points.reverse();
      const route: Waypoint[] = [];
      let index = 0;
      while (index < points.length - 1) {
        let next = points.length - 1;
        while (next > index + 1 && !walkableSegment(points[index], points[next])) next--;
        route.push(points[next]);
        index = next;
      }
      return route;
    }
    open.delete(current);
    closed.add(current);
    const column = Math.floor(current / ROWS);
    const row = current % ROWS;
    const origin = gridPoint(current);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      if (dx === 0 && dz === 0) continue;
      const x = column + dx;
      const z = row + dz;
      if (x < 0 || x >= COLUMNS || z < 0 || z >= ROWS) continue;
      const id = x * ROWS + z;
      if (closed.has(id)) continue;
      const candidate = gridPoint(id);
      const cost = costs.get(current)! + Math.hypot(dx, dz) * CELL;
      if (cost >= (costs.get(id) ?? Infinity) || !walkableSegment(origin, candidate)) continue;
      costs.set(id, cost);
      parents.set(id, current);
      open.add(id);
    }
  }
  return [];
}

/** Follows planned segments with bounded steps, preserving collision, travel-driven gait and heading.
 * Mutates the route as waypoints are reached; never overshoots or cuts an unplanned corner.
 * @returns False only when a previously planned segment is no longer walkable.
 */
export function followPath(motion: Motion, route: Waypoint[], elapsed: number, running: boolean): boolean {
  const delta = Math.min(elapsed, 0.05);
  if (!route.length || delta <= 0) return true;
  const target = route[0];
  const dx = target.x - motion.x;
  const dz = target.z - motion.z;
  const distance = Math.hypot(dx, dz);
  const travel = Math.min(distance, Math.min(running ? RUN_SPEED : WALK_SPEED, motion.speed + 18 * delta) * delta);
  const next = distance > 0 ? { x: motion.x + dx / distance * travel, z: motion.z + dz / distance * travel } : target;
  if (!walkableSegment(motion, next)) { route.length = 0; motion.vx = motion.vz = motion.speed = 0; return false; }
  motion.vx = (next.x - motion.x) / delta;
  motion.vz = (next.z - motion.z) / delta;
  motion.x = next.x;
  motion.z = next.z;
  motion.distance += travel;
  motion.speed = travel / delta;
  if (travel > 0.0001) {
    const angle = Math.atan2(dx, dz);
    motion.heading += Math.atan2(Math.sin(angle - motion.heading), Math.cos(angle - motion.heading)) * (1 - Math.exp(-12 * delta));
  }
  if (distance - travel < 0.00001) route.shift();
  return true;
}
