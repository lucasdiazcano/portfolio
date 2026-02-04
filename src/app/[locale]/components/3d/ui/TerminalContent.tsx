'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../types';
import { usePipBoyStore, PIPBOY_TABS, selectCurrentTab, selectIsViewingDetail, type PipBoyStore, type PipBoyTab } from '../store';
import { StatsView, ProjectListView, ProjectDetailView, SkillsView, DataView } from './views';

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
 */
function DynamicContent() {
  const currentTab = usePipBoyStore(selectCurrentTab);
  const isViewingDetail = usePipBoyStore(selectIsViewingDetail);
  
  // Si estamos viendo detalle de proyecto
  if (isViewingDetail && currentTab === 'PROJECTS') {
    return <ProjectDetailView />;
  }
  
  // Renderizar vista según tab
  switch (currentTab) {
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
}

/**
 * Contenido de la terminal que se renderiza dentro del RenderTexture
 * Ahora conectado al store de Zustand para navegación real
 */
export default function TerminalContent({ hovered }: TerminalContentProps) {
  return (
    <>
      {/* Fondo de la pantalla - verde oscuro */}
      <color attach="background" args={['#001a00']} />
      
      {/* Luz para la escena interna */}
      <ambientLight intensity={2} />
      
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
  );
}
