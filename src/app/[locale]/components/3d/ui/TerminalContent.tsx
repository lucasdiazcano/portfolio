'use client';

import { Text } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { PIPBOY_COLORS } from '../types';
import { usePipBoyStore, PIPBOY_TABS, selectCurrentTab, selectIsViewingDetail, type PipBoyStore, type PipBoyTab } from '../store';
import { StatsView, ProjectListView, ProjectDetailView, SkillsView, DataView } from './views';

/**
 * Overlay de encendido con efecto flicker
 */
function PowerOnOverlay({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<THREE.Mesh>(null);
  const [bootText, setBootText] = useState('');
  
  useEffect(() => {
    if (!overlayRef.current) return;
    
    const bootSequence = [
      'INITIALIZING...',
      'LOADING KUKINO OS...',
      'CALIBRATING DISPLAY...',
      'SYSTEMS ONLINE',
    ];
    
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out final
        gsap.to(overlayRef.current!, {
          visible: false,
          duration: 0,
          delay: 0.3,
          onComplete,
        });
      }
    });
    
    // Flicker inicial - pantalla que se enciende
    const material = overlayRef.current.material as THREE.MeshBasicMaterial;
    
    tl.set(material, { opacity: 1 })
      .to(material, { opacity: 0.3, duration: 0.05 })
      .to(material, { opacity: 0.9, duration: 0.03 })
      .to(material, { opacity: 0.1, duration: 0.08 })
      .to(material, { opacity: 0.8, duration: 0.04 })
      .to(material, { opacity: 0.2, duration: 0.06 })
      .to(material, { opacity: 0.95, duration: 0.05 })
      .to(material, { opacity: 0.4, duration: 0.03 })
      .to(material, { opacity: 1, duration: 0.1 });
    
    // Boot text sequence
    bootSequence.forEach((text, i) => {
      tl.call(() => setBootText(text), [], i * 0.3 + 0.5);
    });
    
    // Fade out overlay
    tl.to(material, { 
      opacity: 0, 
      duration: 0.4, 
      ease: 'power2.inOut',
      delay: 0.2 
    });
    
    return () => {
      tl.kill();
    };
  }, [onComplete]);
  
  return (
    <group position={[0, 0, 0.1]}>
      <mesh ref={overlayRef}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#001a00" transparent opacity={1} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        color={PIPBOY_COLORS.screenText}
        anchorX="center"
      >
        {bootText}
      </Text>
    </group>
  );
}

interface TerminalContentProps {
  hovered: boolean;
}

/**
 * Header con tabs navegables estilo Fallout
 */
function TabHeader() {
  const currentTab = usePipBoyStore(selectCurrentTab);
  const currentTabIndex = usePipBoyStore((state: PipBoyStore) => state.currentTabIndex);
  const setTab = usePipBoyStore((state: PipBoyStore) => state.setTab);
  const isViewingDetail = usePipBoyStore(selectIsViewingDetail);
  
  // No mostrar tabs cuando estamos en vista de detalle
  if (isViewingDetail) return null;
  
  return (
    <group position={[0, 1.5, 0]}>
      {PIPBOY_TABS.map((tab: PipBoyTab, i: number) => {
        const isActive = currentTabIndex === i;
        const spacing = 0.95;
        const xPos = (i - (PIPBOY_TABS.length - 1) / 2) * spacing;
        
        return (
          <group key={tab} position={[xPos, 0, 0]}>
            {/* Fondo activo */}
            {isActive && (
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[0.85, 0.3]} />
                <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.4} />
              </mesh>
            )}
            
            <Text
              fontSize={0.18}
              color={isActive ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextMuted}
              anchorX="center"
              onClick={() => setTab(tab)}
            >
              {tab}
            </Text>
          </group>
        );
      })}
      
      {/* Indicadores de navegación Q/E */}
      <Text
        position={[-2, 0, 0]}
        fontSize={0.15}
        color={PIPBOY_COLORS.screenAccent}
        anchorX="center"
      >
        {'[Q]'}
      </Text>
      <Text
        position={[2, 0, 0]}
        fontSize={0.15}
        color={PIPBOY_COLORS.screenAccent}
        anchorX="center"
      >
        {'[E]'}
      </Text>
    </group>
  );
}

/**
 * Contenido dinámico según el tab seleccionado
 * Con efecto de transición animada
 */
function DynamicContent() {
  const currentTab = usePipBoyStore(selectCurrentTab);
  const isViewingDetail = usePipBoyStore(selectIsViewingDetail);
  const contentRef = useRef<THREE.Group>(null);
  const [displayTab, setDisplayTab] = useState(currentTab);
  const [displayDetail, setDisplayDetail] = useState(isViewingDetail);
  
  // Animación de transición entre tabs
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Si el tab o detalle cambió, hacer transición
    if (displayTab !== currentTab || displayDetail !== isViewingDetail) {
      const tl = gsap.timeline();
      
      // Fade out + glitch
      tl.to(contentRef.current.position, {
        x: -0.05,
        duration: 0.05,
        ease: 'power2.in',
      })
      .to(contentRef.current.position, {
        x: 0.08,
        duration: 0.03,
      })
      .to(contentRef.current.position, {
        x: 0,
        duration: 0.05,
      })
      .to(contentRef.current, {
        visible: false,
        duration: 0,
        onComplete: () => {
          setDisplayTab(currentTab);
          setDisplayDetail(isViewingDetail);
        }
      })
      // Fade in
      .to(contentRef.current, {
        visible: true,
        duration: 0,
      })
      .from(contentRef.current.scale, {
        x: 1.02,
        y: 0.98,
        duration: 0.1,
        ease: 'power2.out',
      });
    }
  }, [currentTab, isViewingDetail, displayTab, displayDetail]);
  
  // Si estamos viendo detalle de proyecto
  if (displayDetail && displayTab === 'PROJECTS') {
    return (
      <group ref={contentRef}>
        <ProjectDetailView />
      </group>
    );
  }
  
  // Renderizar vista según tab
  const renderView = () => {
    switch (displayTab) {
      case 'STATS':
        return <StatsView />;
      case 'PROJECTS':
        return <ProjectListView />;
      case 'SKILLS':
        return <SkillsView />;
      case 'DATA':
        return <DataView />;
      default:
        return <StatsView />;
    }
  };
  
  return (
    <group ref={contentRef}>
      {renderView()}
    </group>
  );
}

/**
 * Contenido de la terminal que se renderiza dentro del RenderTexture
 * Ahora conectado al store de Zustand para navegación real
 */
export default function TerminalContent({ hovered }: TerminalContentProps) {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  
  return (
    <>
      {/* Fondo de la pantalla - verde oscuro */}
      <color attach="background" args={['#001a00']} />
      
      {/* Luz para la escena interna */}
      <ambientLight intensity={2} />
      
      {/* Overlay de encendido con flicker */}
      {!isPoweredOn && (
        <PowerOnOverlay onComplete={() => setIsPoweredOn(true)} />
      )}
      
      {/* Contenido principal - solo visible después del boot */}
      {isPoweredOn && (
        <>
          {/* Header con tabs */}
          <TabHeader />

          {/* Línea divisoria */}
          <mesh position={[0, 1.15, 0]}>
            <planeGeometry args={[4.2, 0.015]} />
            <meshBasicMaterial color={PIPBOY_COLORS.screenText} />
          </mesh>

          {/* Contenido dinámico según tab */}
          <DynamicContent />

          {/* Footer */}
          <Text 
            position={[0, -1.85, 0]} 
            fontSize={0.12} 
            color={PIPBOY_COLORS.screenAccent} 
            anchorX="center"
          >
            {`// PIP-BOY 3000 MARK IV // STATUS: ${hovered ? 'ACTIVE' : 'STANDBY'}`}
          </Text>
        </>
      )}
    </>
  );
}
