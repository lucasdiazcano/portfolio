'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { GlitchEffectRef } from '../effects/GlitchEffect';

/**
 * Hook para controlar el efecto glitch
 * Se dispara automáticamente al montar (boot sequence) y puede dispararse manualmente
 */
export function useBootGlitch() {
  const glitchRef = useRef<GlitchEffectRef>(null);
  const hasBootedRef = useRef(false);

  // Disparar glitch una vez al inicio (boot sequence)
  useEffect(() => {
    if (hasBootedRef.current) return;
    
    // Pequeño delay para que el efecto sea visible después del render inicial
    const timer = setTimeout(() => {
      glitchRef.current?.trigger();
      hasBootedRef.current = true;
    }, 500);

    // Segundo glitch más sutil después
    const timer2 = setTimeout(() => {
      glitchRef.current?.trigger();
    }, 1200);

    // Tercer glitch intermitente
    const timer3 = setTimeout(() => {
      glitchRef.current?.trigger();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Función manual para disparar el glitch
  const triggerGlitch = useCallback(() => {
    glitchRef.current?.trigger();
  }, []);

  return { glitchRef, triggerGlitch };
}

// Mantener alias para compatibilidad
export const useTabGlitch = useBootGlitch;
