'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { useProfileData } from '../../hooks/usePortfolioData';
import { usePipBoyStore, selectSelectedIndex } from '../../store';
import { 
  SectionHeader, 
  DataRow, 
  Divider, 
  NavigationFooter,
  LAYOUT,
  TerminalBorder,
} from './UIComponents';

/**
 * Vista de STATS - Información del perfil estilo Fallout
 * Diseño mejorado con componentes UI reutilizables
 */
export default function StatsView() {
  const profile = useProfileData();
  const selectedIndex = usePipBoyStore(selectSelectedIndex);
  
  const stats = [
    { label: 'NAME', value: profile.name, highlight: false },
    { label: 'ROLE', value: profile.employment.position, highlight: false },
    { label: 'COMPANY', value: profile.employment.company, highlight: false },
    { label: 'STATUS', value: 'AVAILABLE', highlight: true },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Borde decorativo */}
      <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
      
      {/* Header de sección */}
      <SectionHeader position={[0, LAYOUT.contentTop, 0]}>
        Personal Stats
      </SectionHeader>
      
      {/* Lista de stats con spacing mejorado */}
      <group position={[0, LAYOUT.contentTop - 0.35, 0]}>
        {stats.map((stat, index) => (
          <DataRow
            key={stat.label}
            label={stat.label}
            value={stat.value}
            isSelected={selectedIndex === index}
            isHighlighted={stat.highlight}
            position={[0, -index * LAYOUT.lineHeight, 0]}
          />
        ))}
      </group>
      
      {/* Divider antes de la sección de empleo */}
      <Divider position={[0, -0.75, 0]} style="double" />
      
      {/* Sección de empleo actual */}
      <group position={[0, -0.95, 0]}>
        <Text
          position={[LAYOUT.contentLeft, 0, 0]}
          fontSize={LAYOUT.fontSize.small}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          letterSpacing={0.03}
        >
          {'◇ CURRENT EMPLOYMENT'}
        </Text>
        
        <Text
          position={[LAYOUT.contentLeft + 0.1, -0.18, 0]}
          fontSize={LAYOUT.fontSize.small}
          color={PIPBOY_COLORS.screenTextDim}
          anchorX="left"
        >
          {profile.employment.period}
        </Text>
        
        <Text
          position={[LAYOUT.contentLeft + 0.1, -0.35, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="left"
          maxWidth={3}
          lineHeight={1.3}
        >
          {profile.employment.description.slice(0, 120) + '...'}
        </Text>
      </group>
      
      {/* Footer con navegación */}
      <NavigationFooter instructions="[↑↓] Select  [Q/E] Switch Tab" />
    </group>
  );
}
