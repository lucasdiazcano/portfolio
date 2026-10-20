import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceMotion, cameraFraction, type Motion } from './locomotion';
import { canWalk, SPAWN } from './world';

/** Fresh plaza state isolates movement tests from one another. */
function spawn(): Motion {
  return { ...SPAWN, vx: 0, vz: 0, heading: Math.PI, distance: 0, speed: 0 };
}

test('walking accelerates instead of reaching full speed in one frame', () => {
  const state = spawn();
  advanceMotion(state, 1, 0, 0, false, true, 1 / 60);
  assert.ok(state.speed > 0 && state.speed < 3.5);
});

test('diagonal travel has the same speed as forward travel', () => {
  const forward = spawn();
  const diagonal = spawn();
  advanceMotion(forward, 1, 0, 0, false, true, 0.05);
  advanceMotion(diagonal, 1, 1, 0, false, true, 0.05);
  assert.ok(Math.abs(forward.speed - diagonal.speed) < 1e-10);
});

test('releasing controls brakes to a complete stop', () => {
  const state = spawn();
  for (let i = 0; i < 20; i++) advanceMotion(state, 1, 0, 0, false, true, 0.05);
  for (let i = 0; i < 20; i++) advanceMotion(state, 0, 0, 0, false, true, 0.05);
  assert.equal(state.speed, 0);
});

test('opening a dialog stops motion immediately', () => {
  const state = spawn();
  advanceMotion(state, 1, 0, 0, true, true, 0.05);
  const z = state.z;
  advanceMotion(state, 0, 0, 0, false, false, 0.05);
  assert.equal(state.z, z);
});

test('pushing into a wall does not advance the walking animation', () => {
  const state = { ...spawn(), x: 5, z: -7.36 };
  for (let i = 0; i < 30; i++) advanceMotion(state, 1, 0, 0, false, true, 0.05);
  assert.equal(state.distance, 0);
});

test('running cannot cross a gallery wall even after a delayed frame', () => {
  const state = { ...spawn(), x: 5, z: -7 };
  for (let i = 0; i < 20; i++) advanceMotion(state, 1, 0, 0, true, true, 1);
  assert.ok(state.z > -7.37 && canWalk(state.x, state.z));
});

test('the camera segment stops before the gallery facade', () => {
  assert.ok(cameraFraction(0, -10, 5, -6) < 1);
});

test('the camera can pass through the central doorway', () => {
  assert.equal(cameraFraction(0, -10, 0, -5.2), 1);
});

test('corner correction leaves the entire camera segment outside obstacles', () => {
  const fraction = cameraFraction(0, -10, 5, -6);
  assert.ok(Array.from({ length: 101 }, (_, i) => canWalk(5 * fraction * i / 100, -10 + 4 * fraction * i / 100)).every(Boolean));
});

test('the lobby route still reaches Globant and returns', () => {
  const state = spawn();
  for (let i = 0; i < 600; i++) advanceMotion(state, state.z > -13.4 ? 1 : 0, 0, 0, false, true, 0.05);
  for (let i = 0; i < 600; i++) advanceMotion(state, state.z < 14.9 ? -1 : 0, 0, 0, false, true, 0.05);
  assert.ok(state.z >= 14.9 && state.z < 15.3);
});
