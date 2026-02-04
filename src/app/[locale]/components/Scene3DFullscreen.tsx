'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RenderTexture, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { MathUtils } from 'three';
import Link from 'next/link';

// Configuración del ciclo día/noche
const TIME_PRESETS = [
  { name: 'DAWN', preset: 'dawn', skyColor: new THREE.Color('#ff9966'), ambientIntensity: 0.6, sunColor: new THREE.Color('#ffcc99'), sunIntensity: 1 },
  { name: 'DAY', preset: 'warehouse', skyColor: new THREE.Color('#87ceeb'), ambientIntensity: 1.2, sunColor: new THREE.Color('#ffffff'), sunIntensity: 2 },
  { name: 'SUNSET', preset: 'sunset', skyColor: new THREE.Color('#ff6b35'), ambientIntensity: 0.8, sunColor: new THREE.Color('#ff8866'), sunIntensity: 1 },
  { name: 'NIGHT', preset: 'night', skyColor: new THREE.Color('#1a1a2e'), ambientIntensity: 0.3, sunColor: new THREE.Color('#aabbff'), sunIntensity: 0.5 },
] as const;

type TimePreset = typeof TIME_PRESETS[number];

// Hook para interpolar valores suavemente
function useSmoothValue(target: number, speed: number = 3) {
  const valueRef = useRef(target);
  
  useFrame((_, delta) => {
    valueRef.current = MathUtils.lerp(valueRef.current, target, delta * speed);
  });
  
  return valueRef;
}

// Componente de luces dinámicas con transiciones suaves
function DynamicLighting({ timeIndex }: { timeIndex: number }) {
  const currentPreset = TIME_PRESETS[timeIndex];
  
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.PointLight>(null);
  const pipboyLightRef = useRef<THREE.PointLight>(null);
  
  // Valores objetivo para interpolación
  const targetAmbient = currentPreset.ambientIntensity;
  const targetSunIntensity = currentPreset.sunIntensity;
  const targetPipboyIntensity = timeIndex === 3 ? 2 : 0.8;
  const targetStarsOpacity = timeIndex === 3 ? 1 : 0;
  
  // Referencias para valores interpolados
  const starsOpacityRef = useRef(0);
  
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

// Sistema de lluvia con partículas
const RAIN_COUNT = 1500;
const RAIN_AREA = { x: 15, y: 12, z: 10 };

function Rain({ intensity = 1 }: { intensity: number }) {
  const rainRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  
  // Crear posiciones y velocidades iniciales de las gotas
  const [positions, velocities] = React.useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3);
    const vel = new Float32Array(RAIN_COUNT);
    
    for (let i = 0; i < RAIN_COUNT; i++) {
      // Posición inicial aleatoria
      pos[i * 3] = (Math.random() - 0.5) * RAIN_AREA.x;      // x
      pos[i * 3 + 1] = Math.random() * RAIN_AREA.y;          // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA.z;  // z
      
      // Velocidad de caída aleatoria (entre 8 y 15)
      vel[i] = 8 + Math.random() * 7;
    }
    
    return [pos, vel];
  }, []);
  
  // Configurar geometría
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
      );
    }
    velocitiesRef.current = velocities;
  }, [positions, velocities]);
  
  useFrame((_, delta) => {
    if (!geometryRef.current || intensity === 0) return;
    
    const posAttr = geometryRef.current.attributes.position;
    if (!posAttr) return;
    
    const posArray = posAttr.array as Float32Array;
    const vel = velocitiesRef.current!;
    
    for (let i = 0; i < RAIN_COUNT; i++) {
      // Mover gota hacia abajo
      posArray[i * 3 + 1] -= vel[i] * delta * intensity;
      
      // Si la gota sale por abajo, reiniciar arriba
      if (posArray[i * 3 + 1] < -RAIN_AREA.y / 2) {
        posArray[i * 3 + 1] = RAIN_AREA.y / 2;
        posArray[i * 3] = (Math.random() - 0.5) * RAIN_AREA.x;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * RAIN_AREA.z;
      }
    }
    
    posAttr.needsUpdate = true;
  });
  
  // Opacidad basada en intensidad
  const opacity = MathUtils.clamp(intensity, 0, 1);
  
  if (intensity === 0) return null;
  
  return (
    <points ref={rainRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.05}
        color="#aaccff"
        transparent
        opacity={opacity * 0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Efecto de gotas en la pantalla del PipBoy
function ScreenDroplets({ intensity = 0 }: { intensity: number }) {
  const dropletsRef = useRef<THREE.Group>(null);
  const [droplets, setDroplets] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);
  
  // Generar nuevas gotas cuando llueve
  useEffect(() => {
    if (intensity === 0) {
      setDroplets([]);
      return;
    }
    
    const interval = setInterval(() => {
      if (Math.random() < intensity * 0.3) {
        setDroplets(prev => {
          const newDroplets = [...prev, {
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 3.2,
            y: 1.0,
            size: 0.02 + Math.random() * 0.04,
            speed: 0.3 + Math.random() * 0.5
          }];
          // Limitar cantidad de gotas
          return newDroplets.slice(-20);
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [intensity]);
  
  useFrame((_, delta) => {
    setDroplets(prev => 
      prev
        .map(d => ({ ...d, y: d.y - d.speed * delta }))
        .filter(d => d.y > -1.2)
    );
  });
  
  if (intensity === 0) return null;
  
  return (
    <group ref={dropletsRef} position={[0, 0, 0.16]}>
      {droplets.map(droplet => (
        <mesh key={droplet.id} position={[droplet.x, droplet.y, 0]}>
          <sphereGeometry args={[droplet.size, 8, 8]} />
          <meshPhysicalMaterial
            color="#88bbff"
            transparent
            opacity={0.4}
            roughness={0}
            metalness={0}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

import React from 'react';

import { 
  PipBoyDevice, 
  TerminalContent, 
  PIPBOY_COLORS 
} from './3d';

const SCREEN_CONFIG = {
  width: 3.5,
  height: 2.2,
  resolution: [1024, 640] as [number, number],
};

function PipBoyTerminal({ rainIntensity = 0 }: { rainIntensity?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.5}
      rotation={[0.05, 0, 0]}
    >
      <PipBoyDevice hovered={hovered}>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[SCREEN_CONFIG.width, SCREEN_CONFIG.height]} />
          <meshBasicMaterial>
            <RenderTexture 
              attach="map" 
              anisotropy={16} 
              width={SCREEN_CONFIG.resolution[0]} 
              height={SCREEN_CONFIG.resolution[1]}
            >
              <PerspectiveCamera 
                makeDefault 
                manual 
                aspect={SCREEN_CONFIG.width / SCREEN_CONFIG.height} 
                position={[0, 0, 5]} 
              />
              <TerminalContent hovered={hovered} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
        
        {/* Gotas de lluvia en la pantalla */}
        <ScreenDroplets intensity={rainIntensity} />
      </PipBoyDevice>
    </group>
  );
}

// Componente Scene3D que recibe el timeIndex y rainIntensity
function Scene3DContent({ timeIndex, rainIntensity }: { timeIndex: number; rainIntensity: number }) {
  const currentPreset = TIME_PRESETS[timeIndex];
  
  return (
    <>
      <DynamicLighting timeIndex={timeIndex} />
      
      {/* Environment de Drei para reflejos y iluminación basada en imagen */}
      <Environment 
        preset={currentPreset.preset as "dawn" | "sunset" | "night" | "warehouse"} 
        background={false}
      />
      
      {/* Sistema de lluvia */}
      <Rain intensity={rainIntensity} />
      
      <PipBoyTerminal rainIntensity={rainIntensity} />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}

export default function Scene3DFullscreen() {
  const [timeIndex, setTimeIndex] = useState(1); // Empieza en DAY
  const [displayIndex, setDisplayIndex] = useState(1); // Para transiciones suaves
  const [isRaining, setIsRaining] = useState(false);
  const [rainIntensity, setRainIntensity] = useState(0);
  
  // Transición suave del índice visual
  useEffect(() => {
    const timeout = setTimeout(() => setDisplayIndex(timeIndex), 50);
    return () => clearTimeout(timeout);
  }, [timeIndex]);
  
  // Transición suave de la intensidad de lluvia
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
  
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Capas de fondo para transición suave */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ 
          background: 'linear-gradient(to bottom, #ff9966, #ff5e62)',
          opacity: displayIndex === 0 ? 1 : 0 
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ 
          background: 'linear-gradient(to bottom, #87ceeb, #e0f7fa)',
          opacity: displayIndex === 1 ? 1 : 0 
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ 
          background: 'linear-gradient(to bottom, #ff6b35, #1a1a2e)',
          opacity: displayIndex === 2 ? 1 : 0 
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ 
          background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e)',
          opacity: displayIndex === 3 ? 1 : 0 
        }}
      />
      
      {/* Botón para volver */}
      <Link 
        href="/"
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-green-900/50 border border-green-500/50 text-green-400 font-mono text-sm rounded hover:bg-green-800/50 transition-colors backdrop-blur-sm"
      >
        ← BACK TO PORTFOLIO
      </Link>

      {/* Control de ciclo día/noche */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 font-mono">
        <div className="px-4 py-2 bg-black/50 border border-green-500/30 rounded backdrop-blur-sm">
          <div className="text-green-400 text-xs mb-2">TIME OF DAY</div>
          <div className="flex gap-1">
            {TIME_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => setTimeIndex(idx)}
                className={`px-3 py-1 text-xs rounded transition-all duration-300 ${
                  timeIndex === idx 
                    ? 'bg-green-500 text-black font-bold scale-105' 
                    : 'bg-green-900/30 text-green-400 hover:bg-green-800/50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Slider alternativo */}
        <div className="px-4 py-2 bg-black/50 border border-green-500/30 rounded backdrop-blur-sm w-full">
          <input
            type="range"
            min={0}
            max={TIME_PRESETS.length - 1}
            value={timeIndex}
            onChange={(e) => setTimeIndex(parseInt(e.target.value))}
            className="w-full accent-green-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-green-500/50 mt-1">
            <span>🌅</span>
            <span>☀️</span>
            <span>🌇</span>
            <span>🌙</span>
          </div>
        </div>
      </div>

      {/* Control de lluvia */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 font-mono">
        <button
          onClick={() => setIsRaining(!isRaining)}
          className={`px-4 py-2 rounded backdrop-blur-sm transition-all duration-300 border ${
            isRaining 
              ? 'bg-blue-600/50 border-blue-400 text-blue-200' 
              : 'bg-black/50 border-green-500/30 text-green-400 hover:bg-green-900/30'
          }`}
        >
          {isRaining ? '🌧️ RAIN ON' : '☀️ RAIN OFF'}
        </button>
      </div>
      
      {/* Overlay de lluvia CSS para el fondo */}
      {rainIntensity > 0 && (
        <div 
          className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-500"
          style={{ 
            opacity: rainIntensity * 0.3,
            background: 'linear-gradient(to bottom, rgba(50,70,100,0.5), rgba(20,30,50,0.7))'
          }}
        />
      )}

      {/* Instrucciones */}
      <div className="absolute bottom-4 left-4 z-50 text-green-500/50 font-mono text-xs">
        DRAG TO ROTATE • CLICK TABS TO NAVIGATE • TOGGLE RAIN ↑
      </div>

      {/* Canvas 3D a pantalla completa */}
      <Canvas
        className="absolute inset-0 z-10"
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene3DContent timeIndex={timeIndex} rainIntensity={rainIntensity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
