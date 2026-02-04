'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { usePipBoyStore, selectSelectedIndex } from '../../store';
import { useDataTabContent } from '../../hooks/usePortfolioData';
import { 
  SectionHeader, 
  Divider, 
  NavigationFooter,
  LAYOUT,
  TerminalBorder,
} from './UIComponents';

/**
 * Vista de DATA - Educación, Idiomas, Contacto
 * Diseño mejorado con componentes UI reutilizables
 */
export default function DataView() {
  const data = useDataTabContent();
  const selectedIndex = usePipBoyStore(selectSelectedIndex);
  
  const items = [
    {
      id: 'education',
      icon: '📚',
      title: 'EDUCATION',
      line1: data.education.institution,
      line2: data.education.period,
    },
    {
      id: 'languages',
      icon: '🌐',
      title: 'LANGUAGES',
      line1: `${data.languages.spanish.name}: ${data.languages.spanish.level}`,
      line2: `${data.languages.english.name}: ${data.languages.english.level}`,
    },
    {
      id: 'contact',
      icon: '📡',
      title: 'CONTACT',
      line1: 'Available for opportunities',
      line2: 'github.com/lucasdiaz',
      isLink: true,
    },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Borde decorativo */}
      <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
      
      {/* Header */}
      <SectionHeader position={[0, LAYOUT.contentTop, 0]}>
        Data Archives
      </SectionHeader>
      
      {/* Separador */}
      <Divider position={[0, LAYOUT.contentTop - 0.12, 0]} />
      
      {/* Lista de items */}
      <group position={[0, LAYOUT.contentTop - 0.35, 0]}>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const yPos = -index * 0.52;
          
          return (
            <group key={item.id} position={[0, yPos, 0]}>
              {/* Fondo de selección */}
              {isSelected && (
                <mesh position={[0.1, -0.08, -0.02]}>
                  <planeGeometry args={[LAYOUT.contentWidth, 0.45]} />
                  <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.2} />
                </mesh>
              )}
              
              {/* Indicador */}
              <Text
                position={[LAYOUT.contentLeft - 0.1, 0, 0]}
                fontSize={LAYOUT.fontSize.body}
                color={isSelected ? PIPBOY_COLORS.screenText : 'transparent'}
                anchorX="left"
              >
                {'▶'}
              </Text>
              
              {/* Título con icono */}
              <Text
                position={[LAYOUT.contentLeft, 0, 0]}
                fontSize={LAYOUT.fontSize.heading}
                color={isSelected ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextDim}
                anchorX="left"
              >
                {`${item.icon} ${item.title}`}
              </Text>
              
              {/* Línea 1 */}
              <Text
                position={[LAYOUT.contentLeft + 0.2, -0.16, 0]}
                fontSize={LAYOUT.fontSize.small}
                color={PIPBOY_COLORS.screenTextMuted}
                anchorX="left"
              >
                {item.line1}
              </Text>
              
              {/* Línea 2 */}
              {item.line2 && (
                <Text
                  position={[LAYOUT.contentLeft + 0.2, -0.28, 0]}
                  fontSize={LAYOUT.fontSize.micro}
                  color={item.isLink ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenAccent}
                  anchorX="left"
                >
                  {item.line2}
                </Text>
              )}
            </group>
          );
        })}
      </group>
      
      {/* Decoración de transmisión */}
      <group position={[0, -1.25, 0]}>
        <Divider style="double" />
        <Text
          position={[0, -0.12, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="center"
        >
          {'<< VAULT-TEC CERTIFIED ENGINEER >>'}
        </Text>
      </group>
      
      {/* Footer */}
      <NavigationFooter instructions="[↑↓] Navigate  [ENTER] Select  [Q/E] Tab" />
    </group>
  );
}
