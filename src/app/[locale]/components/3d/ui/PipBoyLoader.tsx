'use client';

import { useProgress, Html, Center, Text3D } from '@react-three/drei';
import { useEffect, useState, useRef, useMemo } from 'react';
import gsap from 'gsap';

/**
 * Loader HTML (fuera del canvas) - para usar con useProgress
 * Este componente debe renderizarse FUERA del Canvas
 */
export function PipBoyLoaderOverlay() {
  const { progress, loaded, total, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (progress === 100 && !active) {
      const timeout = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, active]);
  
  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [progress]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-[#001a00] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-[#33ff66] font-mono relative p-8">
        {/* Logo/Title */}
        <div className="text-2xl tracking-widest animate-pulse">
          KUKINO ENTERPRISES
        </div>
        
        {/* Progress bar container */}
        <div className="w-64 h-3 bg-[#000a00] border border-[#33ff66]/50 relative overflow-hidden">
          {/* Scanlines overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          
          {/* Progress fill */}
          <div 
            ref={barRef}
            className="h-full bg-[#33ff66] transition-none"
            style={{ width: '0%', boxShadow: '0 0 10px #33ff66' }}
          />
        </div>
        
        {/* Progress text */}
        <div className="text-sm tracking-wider">
          LOADING... {Math.round(progress)}%
        </div>
        
        {/* Assets loaded */}
        <div className="text-xs text-[#33ff66]/60">
          {loaded}/{total} ASSETS
        </div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ff66]/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#33ff66]/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#33ff66]/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ff66]/50" />
      </div>
    </div>
  );
}

/**
 * Loader simple para Suspense fallback (sin useProgress para evitar conflictos)
 */
export function PipBoyLoader() {
  return (
    <Html center>
      <div className="text-[#33ff66] font-mono text-center animate-pulse">
        <div className="text-xl tracking-widest mb-2">INITIALIZING...</div>
      </div>
    </Html>
  );
}

/**
 * Título 3D extruido estilo Fallout
 * Requiere una fuente JSON (typeface)
 */
interface Title3DProps {
  children: string;
  position?: [number, number, number];
  size?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export function Title3D({ 
  children, 
  position = [0, 0, 0],
  size = 0.5,
  color = '#33ff66',
  emissive = '#33ff66',
  emissiveIntensity = 0.3,
}: Title3DProps) {
  // Usar fuente de Google Fonts convertida a JSON
  // Puedes generar tu propia fuente en: https://gero3.github.io/facetype.js/
  const fontUrl = '/fonts/helvetiker_regular.typeface.json';
  
  return (
    <Center position={position}>
      <Text3D
        font={fontUrl}
        size={size}
        height={0.1}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.01}
        bevelSegments={5}
      >
        {children}
        <meshStandardMaterial 
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </Text3D>
    </Center>
  );
}

/**
 * Hook personalizado para saber si la carga terminó
 */
export function useLoadingComplete() {
  const { progress } = useProgress();
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setIsComplete(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [progress]);
  
  return isComplete;
}

export default PipBoyLoader;
