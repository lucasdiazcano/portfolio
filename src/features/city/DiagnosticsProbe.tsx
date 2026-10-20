'use client';

import { useFont, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, type MutableRefObject } from 'react';
import type { GameInput } from './CityScene';
import { FACE_TEXTURE } from './assets';

/** Samples the prior complete frame, including shadow passes, without taking over rendering. */
export default function DiagnosticsProbe({ input, onAssetsReady }: { input: MutableRefObject<GameInput>; onAssetsReady: (ms: number) => void }) {
  const gl = useThree((state) => state.gl);
  const portrait = useTexture(FACE_TEXTURE);
  const font = useFont('/fonts/helvetiker_regular.typeface.json');
  useEffect(() => {
    onAssetsReady(performance.now());
  }, [portrait, font, onAssetsReady]);
  useFrame((_, delta) => {
    const render = gl.info.render as typeof gl.info.render & { drawCalls?: number };
    const memory = performance as Performance & { memory?: { usedJSHeapSize: number } };
    input.current.tour?.record({
      ms: delta * 1000,
      drawCalls: render.drawCalls ?? render.calls,
      triangles: render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      heapBytes: memory.memory?.usedJSHeapSize ?? null,
    });
    gl.info.reset();
  });
  return null;
}
