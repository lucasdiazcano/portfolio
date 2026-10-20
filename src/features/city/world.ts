import type { CompanyId } from './brands';

export interface Project {
  brandId: CompanyId;
  title: string;
  description: string;
  technologies: string[];
  client: string;
  sector: string;
}

export interface MuseumRoom extends Project {
  label: string;
  role: string;
  sections: { body: string; title: string }[];
}

export interface Obstacle {
  x: number;
  z: number;
  width: number;
  depth: number;
}

export const SPAWN = { x: 0, z: 15 };
export const GALLERY = { x: 0, z: -27.5, width: 19, depth: 39 };
export const WORLD_BOUNDS = { minX: -25, maxX: 25, minZ: -54, maxZ: 24 };

// The room order matches museum.rooms in both locales; Globant is the entrance hall.
export const MUSEUM_ROOMS: (Obstacle & { brandId: CompanyId; doorZ: number })[] = [
  { brandId: 'globant', x: 0, z: -12, width: 18, depth: 8, doorZ: -8 },
  { brandId: 'bbva', x: -5.65, z: -25, width: 7.3, depth: 18, doorZ: -22 },
  { brandId: 'johnson-and-johnson', x: 5.65, z: -22, width: 7.3, depth: 12, doorZ: -22 },
  { brandId: 'hipotecario', x: -5.65, z: -40.5, width: 7.3, depth: 13, doorZ: -38 },
  { brandId: 'education', x: 5.65, z: -37.5, width: 7.3, depth: 19, doorZ: -37 },
];

// Geometry and collision share every wall, including gaps for the four side-room doors.
export const MUSEUM_WALLS: Obstacle[] = [
  { x: -9.5, z: -27.5, width: 0.5, depth: 39 },
  { x: 9.5, z: -27.5, width: 0.5, depth: 39 },
  { x: 0, z: -47, width: 19, depth: 0.5 },
  { x: -5.8, z: -8, width: 7.5, depth: 0.5 },
  { x: 5.8, z: -8, width: 7.5, depth: 0.5 },
  ...[-5.65, 5.65].map((x) => ({ x, z: -16, width: 7.3, depth: 0.3 })),
  { x: -5.65, z: -34, width: 7.3, depth: 0.3 },
  { x: 5.65, z: -28, width: 7.3, depth: 0.3 },
  ...[-1, 1].flatMap((side) => {
    const doors = side < 0 ? [-22, -38] : [-22, -37];
    return [[-16, doors[0] + 1.6], [doors[0] - 1.6, doors[1] + 1.6], [doors[1] - 1.6, -47]]
      .map(([front, back]) => ({ x: side * 1.8, z: (front + back) / 2, width: 0.3, depth: front - back }));
  }),
];
export const STREET_LAMPS = [[-7, 12], [7, 12], [-8.3, -3], [8.3, -3], [-7, 20], [7, 20]] as const;
export const CORNER_BENCHES: Obstacle[] = [-7.3, 7.3].map((x) => ({ x, z: -5.8, width: 2.3, depth: 0.9 }));
export const BUILDINGS = [
  { x: -17, z: 9, width: 10, depth: 10, height: 12, color: '#686c75' },
  { x: 17, z: 10, width: 10, depth: 12, height: 15, color: '#6b7773' },
  { x: -18, z: -6, width: 12, depth: 14, height: 18, color: '#78736d' },
  { x: 18, z: -9, width: 12, depth: 15, height: 11, color: '#7c706b' },
  { x: -17, z: -25, width: 12, depth: 12, height: 23, color: '#656b75' },
  { x: 17, z: -29, width: 12, depth: 13, height: 21, color: '#73777c' },
];

export const OBSTACLES: Obstacle[] = [
  ...BUILDINGS,
  ...MUSEUM_WALLS,
  { x: -7, z: 7, width: 1.8, depth: 4 },
  { x: 7, z: -2, width: 1.8, depth: 4 },
  ...CORNER_BENCHES,
  ...STREET_LAMPS.map(([x, z]) => ({ x, z, width: 0.5, depth: 0.5 })),
];

/** Tests the character's horizontal footprint against walls and world bounds. */
export function canWalk(x: number, z: number): boolean {
  const radius = 0.38;
  if (x < WORLD_BOUNDS.minX || x > WORLD_BOUNDS.maxX || z < WORLD_BOUNDS.minZ || z > WORLD_BOUNDS.maxZ) return false;
  return !OBSTACLES.some((item) =>
    Math.abs(x - item.x) < item.width / 2 + radius &&
    Math.abs(z - item.z) < item.depth / 2 + radius,
  );
}

/** Returns the occupied museum room, or -1 in the street, corridor or missing content slot. */
export function nearbyExhibit(x: number, z: number, count: number): number {
  return MUSEUM_ROOMS.findIndex((room, index) => index < count &&
    Math.abs(x - room.x) < room.width / 2 - 0.2 && Math.abs(z - room.z) < room.depth / 2 - 0.2);
}

/** Height of the existing street, sidewalks, tiled frontage and gallery floor (highest surface wins). */
export function groundHeight(x: number, z: number): number {
  if (Math.abs(x) >= 9 && Math.abs(x) <= 23 && z >= -40 && z <= 30) return 0.13;
  if (Math.abs(x) <= 9.5 && z >= GALLERY.z - GALLERY.depth / 2 && z <= -8) return 0.09;
  if (Math.abs(x) <= 9.8 && z >= -7.95 && z <= -3.65) return 0.035;
  return -0.02;
}
