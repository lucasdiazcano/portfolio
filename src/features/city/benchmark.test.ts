import assert from 'node:assert/strict';
import test from 'node:test';
import { BenchmarkTour, percentile, summarizeFrames, type FrameSample } from './benchmark';

const sample: FrameSample = { ms: 20, drawCalls: 100, triangles: 1000, geometries: 30, textures: 2, heapBytes: null };

test('an unmeasured percentile is null, not an invented zero', () => {
  assert.equal(percentile([], 0.95), null);
});

test('p95 uses nearest rank on a sorted copy', () => {
  assert.equal(percentile([40, 10, 20, 30], 0.95), 40);
});

test('FPS derives from total frame duration rather than averaging instantaneous FPS', () => {
  assert.equal(summarizeFrames([sample, { ...sample, ms: 30 }]).fps, 40);
});

test('unsupported heap measurements remain null', () => {
  assert.equal(summarizeFrames([sample]).heapBytesLast, null);
});

test('warmup frames are excluded from results', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  run.record(sample);
  assert.equal(run.result().overall.frames, 0);
});

test('the route starts moving only after warmup', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  assert.equal(run.direction(0, 15, 5000), 1);
});

test('arriving at the museum opens the Globant description', () => {
  let opened = false;
  const run = new BenchmarkTour(0, () => { opened = true; }, () => {}, () => {});
  run.direction(0, 15, 5000);
  run.direction(0, -13.5, 14000);
  assert.equal(opened, true);
});

test('the return path begins after the exhibit hold', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  run.direction(0, 15, 5000);
  run.direction(0, -13.5, 14000);
  assert.equal(run.direction(0, -13.5, 16000), -1);
});

test('a route completes only after returning and cooling down', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  run.direction(0, 15, 5000);
  run.direction(0, -13.5, 14000);
  run.direction(0, -13.5, 16000);
  run.direction(0, 15, 25000);
  run.direction(0, 15, 27000);
  assert.equal(run.result().status, 'complete');
});

test('a focus change preserves an explicit invalidation reason', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  run.abort('focus-or-visibility-lost', 1000);
  assert.equal(run.result().reason, 'focus-or-visibility-lost');
});

test('unexpected lateral movement invalidates the comparison', () => {
  const run = new BenchmarkTour(0, () => {}, () => {}, () => {});
  run.direction(1, 0, 6000);
  assert.equal(run.result().status, 'aborted');
});
