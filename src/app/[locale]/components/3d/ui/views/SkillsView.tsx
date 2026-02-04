'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { usePipBoyStore, selectSkills, selectSelectedIndex, type PortfolioSkill } from '../../store';
import { 
  SectionHeader, 
  ProgressBar,
  Divider, 
  NavigationFooter,
  LAYOUT,
  TerminalBorder,
} from './UIComponents';

/**
 * Vista de SKILLS - Barras de progreso estilo S.P.E.C.I.A.L.
 * Diseño mejorado con componentes UI reutilizables
 */
export default function SkillsView() {
  const skills = usePipBoyStore(selectSkills);
  const selectedIndex = usePipBoyStore(selectSelectedIndex);
  
  // Agrupar por categoría
  const coreSkills = skills.filter((s: PortfolioSkill) => s.category === 'core').slice(0, 4);
  const toolSkills = skills.filter((s: PortfolioSkill) => s.category === 'tools').slice(0, 3);

  // Índice global para selección
  let globalIndex = 0;
  
  const renderSkillGroup = (
    groupSkills: PortfolioSkill[], 
    title: string, 
    yOffset: number
  ) => {
    const startIndex = globalIndex;
    const result = (
      <group key={title} position={[0, yOffset, 0]}>
        {/* Título de categoría */}
        <Text
          position={[LAYOUT.contentLeft, 0, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          letterSpacing={0.03}
        >
          {`◇ ${title}`}
        </Text>
        
        {/* Skills */}
        {groupSkills.map((skill: PortfolioSkill, index: number) => {
          const actualIndex = startIndex + index;
          const isSelected = actualIndex === selectedIndex;
          
          return (
            <group key={skill.name} position={[0, -0.18 - index * 0.22, 0]}>
              {/* Fondo de selección */}
              {isSelected && (
                <mesh position={[0.1, 0, -0.02]}>
                  <planeGeometry args={[LAYOUT.contentWidth, 0.18]} />
                  <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.2} />
                </mesh>
              )}
              
              {/* Indicador */}
              <Text
                position={[LAYOUT.contentLeft - 0.1, 0, 0]}
                fontSize={LAYOUT.fontSize.small}
                color={isSelected ? PIPBOY_COLORS.screenText : 'transparent'}
                anchorX="left"
              >
                {'▶'}
              </Text>
              
              {/* Nombre */}
              <Text
                position={[LAYOUT.contentLeft, 0, 0]}
                fontSize={LAYOUT.fontSize.small}
                color={isSelected ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextDim}
                anchorX="left"
              >
                {skill.name}
              </Text>
              
              {/* Barra de progreso */}
              <ProgressBar 
                value={skill.level} 
                width={1.0}
                isSelected={isSelected}
                position={[0.4, 0, 0]}
              />
            </group>
          );
        })}
      </group>
    );
    
    globalIndex += groupSkills.length;
    return result;
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Borde decorativo */}
      <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
      
      {/* Header */}
      <SectionHeader position={[0, LAYOUT.contentTop, 0]}>
        Skill Attributes
      </SectionHeader>
      
      {/* Separador */}
      <Divider position={[0, LAYOUT.contentTop - 0.12, 0]} />
      
      {/* Grupos de skills con spacing mejorado */}
      {renderSkillGroup(coreSkills, 'TECHNICAL', LAYOUT.contentTop - 0.3)}
      {renderSkillGroup(toolSkills, 'TOOLS', LAYOUT.contentTop - 1.25)}
      
      {/* Footer */}
      <NavigationFooter 
        position={[0, -1.55, 0]}
        instructions="[↑↓] Navigate  [Q/E] Switch Tab" 
      />
    </group>
  );
}
