import assert from 'node:assert/strict';
import test from 'node:test';
import { findPath, followPath, walkableSegment } from './navigation';
import { canWalk, MUSEUM_ROOMS, SPAWN } from './world';
import type { Motion } from './locomotion';

/** Independent actor at the actual scene spawn. */
function actor(): Motion {
  return { ...SPAWN, vx: 0, vz: 0, heading: Math.PI, speed: 0, distance: 0 };
}

for (const room of MUSEUM_ROOMS) {
  test(`${room.brandId}: click route ends at the exact room destination`, () => {
    const route = findPath(SPAWN, room);
    assert.deepEqual(route.at(-1), { x: room.x, z: room.z });
  });

  test(`${room.brandId}: the whole route respects walls and door clearances`, () => {
    const route = findPath(SPAWN, room);
    const points = [SPAWN, ...route];
    assert.ok(route.length > 0 && route.every((point, i) => walkableSegment(points[i], point)));
  });

  test(`${room.brandId}: following the route arrives without crossing a wall`, () => {
    const motion = actor();
    const route = findPath(motion, room);
    let safe = true;
    for (let i = 0; i < 3000 && route.length; i++) {
      safe = followPath(motion, route, 1 / 60, false) && canWalk(motion.x, motion.z) && safe;
    }
    assert.ok(safe && route.length === 0 && Math.hypot(motion.x - room.x, motion.z - room.z) < 0.0001);
  });
}

test('clicking a building never invents a nearby destination', () => {
  assert.deepEqual(findPath(SPAWN, { x: 17, z: 10 }), []);
});

test('clicking outside the district produces no route', () => {
  assert.deepEqual(findPath(SPAWN, { x: 80, z: 80 }), []);
});

test('the BBVA to Johnson and Johnson route goes through their doors', () => {
  const route = findPath(MUSEUM_ROOMS[1], MUSEUM_ROOMS[2]);
  const points = [MUSEUM_ROOMS[1], ...route];
  assert.ok(route.length > 1 && route.every((point, i) => walkableSegment(points[i], point)));
});

test('a short final step cannot overshoot its target', () => {
  const motion = { ...actor(), speed: 6.5 };
  const target = { x: 0, z: 14.99 };
  followPath(motion, [target], 0.05, true);
  assert.deepEqual({ x: motion.x, z: motion.z }, target);
});

test('a segment through a wall is rejected even when both endpoints are valid', () => {
  assert.equal(walkableSegment({ x: -6, z: -33 }, { x: -6, z: -35 }), false);
});

test('a route invalidated by an obstacle stops the actor', () => {
  const motion = { ...actor(), x: -6, z: -33.45, speed: 6.5 };
  assert.equal(followPath(motion, [{ x: -6, z: -35 }], 0.05, true), false);
});
