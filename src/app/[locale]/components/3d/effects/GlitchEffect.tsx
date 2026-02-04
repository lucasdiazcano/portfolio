'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Glitch } from '@react-three/postprocessing';
import { GlitchMode, GlitchEffect as PostGlitchEffect } from 'postprocessing';
import { Vector2 } from 'three';

export interface GlitchEffectRef {
  trigger: () => void;
}

interface GlitchEffectProps {
  /** Duración del efecto en ms */
  duration?: number;
  /** Intensidad del glitch (0-1) */
  intensity?: number;
}

/**
 * Efecto de Glitch controlado programáticamente
 * Se activa con trigger() y se desactiva automáticamente
 */
const GlitchEffect = forwardRef<GlitchEffectRef, GlitchEffectProps>(
  ({ duration = 200, intensity = 0.8 }, ref) => {
    const glitchRef = useRef<PostGlitchEffect>(null);
    const isActiveRef = useRef(false);
    const startTimeRef = useRef(0);

    // Exponer método trigger al padre
    useImperativeHandle(ref, () => ({
      trigger: () => {
        isActiveRef.current = true;
        startTimeRef.current = performance.now();
        
        if (glitchRef.current) {
          // Activar glitch con parámetros intensos
          glitchRef.current.mode = GlitchMode.CONSTANT_WILD;
        }
      },
    }));

    // Desactivar después de la duración
    useFrame(() => {
      if (!isActiveRef.current || !glitchRef.current) return;

      const elapsed = performance.now() - startTimeRef.current;
      
      if (elapsed >= duration) {
        isActiveRef.current = false;
        glitchRef.current.mode = GlitchMode.DISABLED;
      }
    });

    return (
      <Glitch
        ref={glitchRef}
        delay={new Vector2(0, 0)} // Sin delay, se controla manualmente
        duration={new Vector2(duration / 1000, duration / 1000)}
        strength={new Vector2(intensity * 0.05, intensity * 0.08)} // Mucho más sutil
        mode={GlitchMode.DISABLED} // Empieza desactivado
        active={false}
        ratio={0.3} // Menos área afectada
        columns={0.02} // Columnas más finas
      />
    );
  }
);

GlitchEffect.displayName = 'GlitchEffect';

export default GlitchEffect;
