export type TourPhase = 'warmup' | 'outbound' | 'exhibit' | 'return' | 'cooldown' | 'complete' | 'aborted';

export interface FrameSample {
  ms: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  heapBytes: number | null;
}

/** Uses the nearest-rank percentile; absent measurements remain null. */
export function percentile(values: number[], rank: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * rank) - 1)];
}

/** Summarizes frame intervals, not GPU execution time or physical GPU memory. */
export function summarizeFrames(samples: FrameSample[]) {
  const intervals = samples.map((sample) => sample.ms);
  const total = intervals.reduce((sum, value) => sum + value, 0);
  return {
    frames: samples.length,
    fps: total > 0 ? samples.length * 1000 / total : null,
    frameMsP50: percentile(intervals, 0.5),
    frameMsP95: percentile(intervals, 0.95),
    frameMsMax: percentile(intervals, 1),
    drawCallsP95: percentile(samples.map((sample) => sample.drawCalls), 0.95),
    trianglesP95: percentile(samples.map((sample) => sample.triangles), 0.95),
    geometriesMax: percentile(samples.map((sample) => sample.geometries), 1),
    texturesMax: percentile(samples.map((sample) => sample.textures), 1),
    heapBytesFirst: samples.find((sample) => sample.heapBytes !== null)?.heapBytes ?? null,
    heapBytesLast: samples.slice().reverse().find((sample) => sample.heapBytes !== null)?.heapBytes ?? null,
  };
}

export type TourResult = ReturnType<BenchmarkTour['result']>;

/** Runs the same physical path through the existing movement and collision code. */
export class BenchmarkTour {
  phase: TourPhase = 'warmup';
  private phaseAt: number;
  private readonly startedAt: number;
  private readonly samples: { phase: TourPhase; sample: FrameSample }[] = [];
  private reason: string | null = null;
  private finishedAt: number | null = null;

  constructor(now: number, private readonly openExhibit: () => void, private readonly closeExhibit: () => void, private readonly finish: (result: TourResult) => void) {
    this.phaseAt = now;
    this.startedAt = now;
  }

  /** True only while a foreground run can still accept frames. */
  get active(): boolean { return this.phase !== 'complete' && this.phase !== 'aborted'; }

  /** Advances by position rather than assuming fixed FPS or movement duration. */
  direction(x: number, z: number, now: number): number {
    if (!this.active) return 0;
    if (now - this.startedAt > 120000 || Math.abs(x) > 0.5) {
      this.abort('timeout-or-path-deviation', now);
      return 0;
    }
    if (this.phase === 'warmup' && now - this.phaseAt >= 5000) this.transition('outbound', now);
    if (this.phase === 'outbound' && z <= -13.4) {
      this.transition('exhibit', now);
      this.openExhibit();
    }
    if (this.phase === 'exhibit' && now - this.phaseAt >= 2000) {
      this.closeExhibit();
      this.transition('return', now);
    }
    if (this.phase === 'return' && z >= 14.9) this.transition('cooldown', now);
    if (this.phase === 'cooldown' && now - this.phaseAt >= 2000) {
      this.finishedAt = now;
      this.phase = 'complete';
      this.finish(this.result());
    }
    return this.phase === 'outbound' ? 1 : this.phase === 'return' ? -1 : 0;
  }

  /** Stores bounded samples after a fixed warmup; first-encounter shaders may still compile. */
  record(sample: FrameSample): void {
    if (!this.active || this.phase === 'warmup' || sample.ms <= 0 || sample.drawCalls === 0) return;
    if (this.samples.length >= 30000) { this.abort('sample-limit', performance.now()); return; }
    this.samples.push({ phase: this.phase, sample });
  }

  /** Invalidates a run after a tab/focus change instead of treating it as a slow frame. */
  abort(reason: string, now: number): void {
    if (!this.active) return;
    this.reason = reason;
    this.finishedAt = now;
    this.phase = 'aborted';
    this.closeExhibit();
    this.finish(this.result());
  }

  /** Returns compact reproducible results without storing raw per-frame traces. */
  result() {
    return {
      route: 'museum-globant-v1',
      status: this.phase,
      reason: this.reason,
      durationMs: this.finishedAt === null ? null : this.finishedAt - this.startedAt,
      warmupMs: 5000,
      overall: summarizeFrames(this.samples.map((entry) => entry.sample)),
      phases: Object.fromEntries(['outbound', 'exhibit', 'return', 'cooldown'].map((phase) => [phase, summarizeFrames(this.samples.filter((entry) => entry.phase === phase).map((entry) => entry.sample))])),
    };
  }

  /** Resets the hold clock at each path transition. */
  private transition(phase: TourPhase, now: number): void { this.phase = phase; this.phaseAt = now; }
}
