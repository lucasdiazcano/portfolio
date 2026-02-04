'use client';

import { useState, useEffect } from 'react';

interface UseSmoothTransitionOptions {
  speed?: number;
  delay?: number;
}

/**
 * Hook para transiciones suaves de valores numéricos
 */
export function useSmoothTransition(
  targetValue: number, 
  options: UseSmoothTransitionOptions = {}
) {
  const { speed = 0.1, delay = 0 } = options;
  const [currentValue, setCurrentValue] = useState(targetValue);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentValue(prev => {
          const diff = targetValue - prev;
          if (Math.abs(diff) < 0.01) return targetValue;
          return prev + diff * speed;
        });
      }, 16);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [targetValue, speed, delay]);
  
  return currentValue;
}

/**
 * Hook para transición suave de índices visuales
 */
export function useDelayedIndex(index: number, delay: number = 50) {
  const [displayIndex, setDisplayIndex] = useState(index);
  
  useEffect(() => {
    const timeout = setTimeout(() => setDisplayIndex(index), delay);
    return () => clearTimeout(timeout);
  }, [index, delay]);
  
  return displayIndex;
}

/**
 * Hook para controlar la intensidad de lluvia con transición
 */
export function useRainIntensity(isRaining: boolean) {
  const [rainIntensity, setRainIntensity] = useState(0);
  
  useEffect(() => {
    const targetIntensity = isRaining ? 1 : 0;
    const interval = setInterval(() => {
      setRainIntensity(prev => {
        const diff = targetIntensity - prev;
        if (Math.abs(diff) < 0.01) return targetIntensity;
        return prev + diff * 0.1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [isRaining]);
  
  return rainIntensity;
}
