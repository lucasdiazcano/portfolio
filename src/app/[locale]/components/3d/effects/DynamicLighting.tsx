'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { TIME_PRESETS } from '../config';
import { PIPBOY_COLORS } from '../types';

interface DynamicLightingProps {
  timeIndex: number;
}

/**
 * Componente de iluminación dinámica con transiciones suaves
 * Maneja el sol, luna, estrellas y luz del PipBoy
 */
export default function DynamicLighting({ timeIndex }: DynamicLightingProps) {
  const currentPreset = TIME_PRESETS[timeIndex];
  
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.PointLight>(null);
  const pipboyLightRef = useRef<THREE.PointLight>(null);
  
  // Valores objetivo para interpolación
  const targetAmbient = currentPreset.ambientIntensity;
  const targetSunIntensity = currentPreset.sunIntensity;
  const targetPipboyIntensity = timeIndex === 3 ? 2 : 0.8;
  
  // Referencias para valores interpolados
  const starsOpacityRef = useRef(0);
  const targetStarsOpacity = timeIndex === 3 ? 1 : 0;
  
  useFrame((state, delta) => {
    const lerpSpeed = 2; // Velocidad de transición
    const time = state.clock.elapsedTime * 0.1;
    
    // Interpolar intensidad de luz ambiental
    if (ambientRef.current) {
      ambientRef.current.intensity = MathUtils.lerp(
        ambientRef.current.intensity, 
        targetAmbient, 
        delta * lerpSpeed
      );
    }
    
    // Interpolar luz del sol
    if (sunRef.current) {
      sunRef.current.intensity = MathUtils.lerp(
        sunRef.current.intensity, 
        timeIndex === 3 ? 0 : targetSunIntensity, 
        delta * lerpSpeed
      );
      sunRef.current.color.lerp(currentPreset.sunColor, delta * lerpSpeed);
      sunRef.current.position.x = Math.cos(time) * 10;
      sunRef.current.position.y = Math.sin(time) * 5 + 3;
    }
    
    // Interpolar luz de luna
    if (moonRef.current) {
      moonRef.current.intensity = MathUtils.lerp(
        moonRef.current.intensity, 
        timeIndex === 3 ? 0.5 : 0, 
        delta * lerpSpeed
      );
      moonRef.current.position.x = Math.sin(time * 0.5) * 8;
      moonRef.current.position.y = Math.cos(time * 0.5) * 3 + 5;
    }
    
    // Interpolar luz del PipBoy
    if (pipboyLightRef.current) {
      pipboyLightRef.current.intensity = MathUtils.lerp(
        pipboyLightRef.current.intensity, 
        targetPipboyIntensity, 
        delta * lerpSpeed
      );
    }
    
    // Interpolar opacidad de estrellas
    starsOpacityRef.current = MathUtils.lerp(
      starsOpacityRef.current, 
      targetStarsOpacity, 
      delta * lerpSpeed
    );
  });
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={targetAmbient} />
      
      {/* Luz del sol (siempre presente, intensidad interpolada) */}
      <directionalLight
        ref={sunRef}
        position={[5, 5, 5]}
        intensity={targetSunIntensity}
        color={currentPreset.sunColor}
        castShadow
      />
      
      {/* Luz de luna (siempre presente, intensidad interpolada) */}
      <pointLight
        ref={moonRef}
        position={[5, 5, 5]}
        intensity={0}
        color="#aabbff"
      />
      
      {/* Estrellas con fade */}
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Luz del PipBoy (siempre presente, más fuerte de noche) */}
      <pointLight 
        ref={pipboyLightRef}
        position={[0, -2, 4]} 
        intensity={0.8} 
        color={PIPBOY_COLORS.screenText} 
      />
      
      {/* Fill light */}
      <pointLight position={[-5, 3, 5]} intensity={0.5} color="#ffffff" />
    </>
  );
}
