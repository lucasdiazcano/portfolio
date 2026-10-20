import type { GLProps } from '@react-three/fiber';
import * as THREE from 'three';

export type CityRendererFactory = Extract<GLProps, (defaults: never) => unknown>;

export interface RendererIdentity {
  requested: 'webgl' | 'webgpu';
  actual: 'webgl2' | 'webgpu' | 'webgl2-fallback';
  initializationMs: number;
  fallbackReason: string | null;
}

/** Creates the experimental renderer only on explicit request and records its real backend. */
export async function createCityRenderer(defaults: Parameters<CityRendererFactory>[0], requested: RendererIdentity['requested'], collectFrames: boolean, onIdentity: (identity: RendererIdentity) => void) {
  const started = performance.now();
  // This route mounts a DOM Canvas; do not pass a WebGL context into WebGPU.
  const parameters = { canvas: defaults.canvas as HTMLCanvasElement, alpha: true, antialias: true, powerPreference: 'high-performance' as const };
  let fallbackReason: string | null = null;
  if (requested === 'webgpu') {
    try {
      const { WebGPURenderer } = await import('three/webgpu');
      const renderer = new WebGPURenderer(parameters);
      await renderer.init();
      renderer.info.autoReset = !collectFrames;
      const backend = renderer.backend as { isWebGPUBackend?: boolean };
      onIdentity({ requested, actual: backend.isWebGPUBackend ? 'webgpu' : 'webgl2-fallback', initializationMs: performance.now() - started, fallbackReason: backend.isWebGPUBackend ? null : 'WebGPURenderer selected its WebGL 2 fallback.' });
      return renderer;
    } catch (error) {
      fallbackReason = error instanceof Error ? error.message : 'WebGPU initialization failed.';
    }
  }
  const renderer = new THREE.WebGLRenderer(parameters);
  renderer.info.autoReset = !collectFrames;
  onIdentity({ requested, actual: requested === 'webgpu' ? 'webgl2-fallback' : 'webgl2', initializationMs: performance.now() - started, fallbackReason });
  return renderer;
}
