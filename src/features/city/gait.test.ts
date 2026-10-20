import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceFeet, bodyHeight, BODY_OFFSET, createFeet, HIP_HEIGHT, LOWER_LEG, SOLE_OFFSET, solveLeg, UPPER_LEG } from './gait';
import { advanceMotion, WALK_SPEED, type Motion } from './locomotion';
import { groundHeight, SPAWN } from './world';

/** Independent starting state with the same facing as the scene. */
function spawn(): Motion {
  return { ...SPAWN, vx: 0, vz: 0, heading: Math.PI, distance: 0, speed: 0 };
}

test('an idle foot remains at its exact world anchor', () => {
  const state = spawn();
  const feet = createFeet(state);
  const before = { ...feet[0] };
  for (let i = 0; i < 60; i++) advanceFeet(feet, state, 1 / 60);
  assert.deepEqual(feet[0], before);
});

test('a planted foot does not slide while the body advances', () => {
  const state = spawn();
  const feet = createFeet(state);
  const before = [feet[1].x, feet[1].y, feet[1].z, feet[1].yaw];
  state.z -= 0.1;
  state.speed = WALK_SPEED;
  state.vz = -WALK_SPEED;
  advanceFeet(feet, state, 1 / 60);
  assert.deepEqual([feet[1].x, feet[1].y, feet[1].z, feet[1].yaw], before);
});

test('a planted foot keeps its orientation while the body turns', () => {
  const state = spawn();
  const feet = createFeet(state);
  state.heading += 0.2;
  advanceFeet(feet, state, 1 / 60);
  assert.equal(feet[0].yaw, Math.PI);
});

test('a swing lifts the sole above the ground', () => {
  const state = spawn();
  const feet = createFeet(state);
  state.z -= 0.2;
  state.speed = WALK_SPEED;
  state.vz = -WALK_SPEED;
  advanceFeet(feet, state, 0.05);
  assert.ok(feet[0].y > groundHeight(feet[0].x, feet[0].z) + SOLE_OFFSET);
});

test('a completed swing lands exactly on its destination surface', () => {
  const state = spawn();
  const feet = createFeet(state);
  state.z -= 0.2;
  advanceFeet(feet, state, 0.05);
  for (let i = 0; i < 5; i++) advanceFeet(feet, state, 0.05);
  assert.ok(Math.abs(feet[0].y - groundHeight(feet[0].x, feet[0].z) - SOLE_OFFSET) < 1e-12);
});

test('the knee solution preserves the upper leg length', () => {
  assert.ok(Math.abs(Math.hypot(...solveLeg(0.08, -0.62, 0.22).knee) - UPPER_LEG) < 1e-12);
});

test('the knee solution preserves the lower leg length', () => {
  const { knee, ankle } = solveLeg(0.08, -0.62, 0.22);
  assert.ok(Math.abs(Math.hypot(...ankle.map((v, i) => v - knee[i])) - LOWER_LEG) < 1e-12);
});

test('reachable targets are met without shifting the ankle', () => {
  const { ankle } = solveLeg(0.08, -0.62, 0.22);
  assert.ok(Math.hypot(ankle[0] - 0.08, ankle[1] + 0.62, ankle[2] - 0.22) < 1e-12);
});

test('overextended targets stay within the physical leg length', () => {
  assert.ok(Math.hypot(...solveLeg(0, -2, 1).ankle) < UPPER_LEG + LOWER_LEG);
});

test('a degenerate target cannot generate invalid joint coordinates', () => {
  const result = solveLeg(0, 0, 0);
  assert.ok([...result.knee, ...result.ankle].every(Number.isFinite));
});

test('a fresh spawn discards the previous distant foot anchors', () => {
  const state = { ...spawn(), x: 12 };
  const old = createFeet(state);
  Object.assign(state, SPAWN);
  assert.ok(Math.abs(createFeet(state)[0].x - old[0].x) > 10);
});

test('walking over the entrance never sends a sole below its local surface', () => {
  const state = { ...spawn(), z: -3 };
  const feet = createFeet(state);
  let minimum = Infinity;
  for (let i = 0; i < 360; i++) {
    advanceMotion(state, 1, 0, 0, false, true, 1 / 60);
    advanceFeet(feet, state, 1 / 60);
    for (const foot of feet) minimum = Math.min(minimum, foot.y - SOLE_OFFSET - groundHeight(foot.x, foot.z));
  }
  assert.ok(minimum >= -1e-12);
});

test('idle inverse kinematics reaches both ground contacts at the rendered hip height', () => {
  const state = spawn();
  const foot = createFeet(state)[0];
  const y = foot.y - groundHeight(state.x, state.z) - BODY_OFFSET - HIP_HEIGHT;
  assert.ok(Math.abs(solveLeg(0, y, 0).ankle[1] - y) < 1e-12);
});

for (const running of [false, true]) {
  for (const fps of [20, 30, 60, 75, 120]) {
    test(`${running ? 'running' : 'walking'} keeps ground contacts reachable at ${fps} FPS`, () => {
      const state = spawn();
      const feet = createFeet(state);
      let maximum = 0;
      for (let i = 0; i < fps * 5; i++) {
        advanceMotion(state, 1, 0, 0, running, true, 1 / fps);
        advanceFeet(feet, state, 1 / fps);
        feet.forEach((foot, index) => {
          if (foot.progress !== 1) return;
          const dx = foot.x - state.x;
          const dz = foot.z - state.z;
          const x = Math.cos(state.heading) * dx - Math.sin(state.heading) * dz - (index === 0 ? -0.155 : 0.155);
          const z = Math.sin(state.heading) * dx + Math.cos(state.heading) * dz;
          const y = foot.y - bodyHeight(state, feet) - HIP_HEIGHT;
          maximum = Math.max(maximum, Math.hypot(x, y, z));
        });
      }
      assert.ok(maximum < UPPER_LEG + LOWER_LEG - 0.0001);
    });
  }
}

for (const fps of [20, 30, 60, 75, 120]) {
  test(`walking avoids rapid short steps at ${fps} FPS`, () => {
    const state = spawn();
    const feet = createFeet(state);
    let previous = 0;
    let steps = 0;
    for (let i = 0; i < fps * 4; i++) {
      advanceMotion(state, 1, 0, 0, false, true, 1 / fps);
      advanceFeet(feet, state, 1 / fps);
      const count = feet[0].steps + feet[1].steps;
      if (i >= fps) steps += count - previous;
      previous = count;
    }
    assert.ok(steps / 3 >= 2 && steps / 3 <= 3.5);
  });
}

test('walking has a low foot clearance instead of a high stamping arc', () => {
  const state = spawn();
  const feet = createFeet(state);
  let maximum = 0;
  for (let i = 0; i < 180; i++) {
    advanceMotion(state, 1, 0, 0, false, true, 1 / 60);
    advanceFeet(feet, state, 1 / 60);
    for (const foot of feet) maximum = Math.max(maximum, foot.y - SOLE_OFFSET - groundHeight(foot.x, foot.z));
  }
  assert.ok(maximum > 0.02 && maximum < 0.06);
});

test('feet settle into fixed anchors after braking', () => {
  const state = spawn();
  const feet = createFeet(state);
  for (let i = 0; i < 300; i++) {
    advanceMotion(state, i < 120 ? 1 : 0, 0, 0, false, true, 1 / 60);
    advanceFeet(feet, state, 1 / 60);
  }
  const before = feet.map((foot) => ({ ...foot }));
  for (let i = 0; i < 60; i++) {
    advanceMotion(state, 0, 0, 0, false, true, 1 / 60);
    advanceFeet(feet, state, 1 / 60);
  }
  assert.deepEqual(feet, before);
});
