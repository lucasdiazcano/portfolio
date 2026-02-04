'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { usePipBoyStore, selectProjects, selectSelectedIndex, type PipBoyStore, type PortfolioProject } from '../../store';
import { 
  SectionHeader, 
  ListItem,
  Divider, 
  NavigationFooter,
  ItemCounter,
  LAYOUT,
  TerminalBorder,
  TypewriterText,
} from './UIComponents';

/**
 * Vista de PROJECTS - Lista de proyectos navegable
 * Diseño mejorado con componentes UI reutilizables
 */
export default function ProjectListView() {
  const projects = usePipBoyStore(selectProjects);
  const selectedIndex = usePipBoyStore(selectSelectedIndex);
  const openDetail = usePipBoyStore((state: PipBoyStore) => state.openDetail);
  const selectItem = usePipBoyStore((state: PipBoyStore) => state.selectItem);
  
  // Si no hay proyectos, mostrar mensaje de carga
  if (!projects || projects.length === 0) {
    return (
      <group position={[0, 0, 0]}>
        <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
        <SectionHeader position={[0, LAYOUT.contentTop, 0]}>
          Project Inventory
        </SectionHeader>
        <TypewriterText
          position={[0, 0, 0]}
          fontSize={0.12}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="center"
          speed={0.04}
          showCursor
        >
          {'Accessing project database...'}
        </TypewriterText>
        <NavigationFooter instructions="[Q/E] Change Tab" />
      </group>
    );
  }
  
  // Mostrar máximo 8 proyectos con scroll virtual
  const maxVisible = 8;
  const visibleStart = Math.max(0, Math.min(selectedIndex - 1, projects.length - maxVisible));
  const visibleProjects = projects.slice(visibleStart, visibleStart + maxVisible);

  return (
    <group position={[0, 0, 0]}>
      {/* Borde decorativo */}
      <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
      
      {/* Header con contador */}
      <group position={[0, LAYOUT.contentTop, 0]}>
        <SectionHeader showLine={false}>
          Project Inventory
        </SectionHeader>
        <ItemCounter 
          current={selectedIndex + 1} 
          total={projects.length} 
          position={[1.7, 0, 0]} 
        />
      </group>
      
      {/* Línea separadora del header */}
      <Divider position={[0, LAYOUT.contentTop - 0.15, 0]} />
      
      {/* Lista de proyectos */}
      <group position={[0, LAYOUT.contentTop - 0.4, 0]}>
        {visibleProjects.map((project: PortfolioProject, index: number) => {
          const actualIndex = visibleStart + index;
          const isSelected = actualIndex === selectedIndex;
          
          return (
            <ListItem
              key={project.id}
              index={actualIndex + 1}
              title={project.title}
              subtitle={project.sector}
              isSelected={isSelected}
              position={[0, -index * LAYOUT.lineHeight, 0]}
              onClick={() => {
                if (isSelected) {
                  openDetail();
                } else {
                  selectItem(actualIndex);
                }
              }}
            />
          );
        })}
      </group>
      
      {/* Indicadores de scroll */}
      {visibleStart > 0 && (
        <group position={[1.7, LAYOUT.contentTop - 0.25, 0]}>
          <mesh>
            <planeGeometry args={[0.12, 0.06]} />
            <meshBasicMaterial color="#006633" />
          </mesh>
        </group>
      )}
      {visibleStart + maxVisible < projects.length && (
        <group position={[1.7, LAYOUT.contentTop - 0.4 - (maxVisible - 1) * LAYOUT.lineHeight - 0.15, 0]}>
          <mesh>
            <planeGeometry args={[0.12, 0.06]} />
            <meshBasicMaterial color="#006633" />
          </mesh>
        </group>
      )}
      
      {/* Footer */}
      <NavigationFooter instructions="[↑↓] Navigate  [ENTER] Inspect  [Q/E] Tab" />
    </group>
  );
}
