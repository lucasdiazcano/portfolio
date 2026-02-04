'use client';

import { Text, useTexture } from '@react-three/drei';
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
  useLayout,
  TypewriterText,
} from './UIComponents';

/**
 * Componente de foto de perfil con efecto Pip-Boy
 */
function ProfileImage({ position = [0, 0, 0] as [number, number, number] }) {
  const texture = useTexture('/profile.png');
  
  return (
    <group position={position}>
      {/* Marco exterior */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.3} />
      </mesh>
      
      {/* Borde interior */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshBasicMaterial color="#001a00" />
      </mesh>
      
      {/* Foto con tinte verde */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial 
          map={texture} 
          transparent
          color={PIPBOY_COLORS.screenText}
        />
      </mesh>
      
      {/* Esquinas decorativas */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, y], i) => (
        <group key={i} position={[x * 0.38, y * 0.38, 0.01]}>
          <mesh position={[-x * 0.03, 0, 0]}>
            <planeGeometry args={[0.06, 0.012]} />
            <meshBasicMaterial color={PIPBOY_COLORS.screenText} />
          </mesh>
          <mesh position={[0, -y * 0.03, 0]}>
            <planeGeometry args={[0.012, 0.06]} />
            <meshBasicMaterial color={PIPBOY_COLORS.screenText} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Vista de STATS - Información del perfil estilo Fallout
 * Diseño mejorado con componentes UI reutilizables
 */
export default function StatsView() {
  const profile = useProfileData();
  const selectedIndex = usePipBoyStore(selectSelectedIndex);
  const layout = useLayout();
  
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
      <SectionHeader position={[0, layout.contentTop, 0]}>
        Personal Stats
      </SectionHeader>
      
      {/* Foto de perfil - lado derecho */}
      <ProfileImage position={[1.6, 0.2, 0]} />
      
      {/* Lista de stats - lado izquierdo */}
      <group position={[-0.4, layout.contentTop - 0.35, 0]}>
        {stats.map((stat, index) => (
          <DataRow
            key={stat.label}
            label={stat.label}
            value={stat.value}
            isSelected={selectedIndex === index}
            isHighlighted={stat.highlight}
            position={[0, -index * layout.lineHeight, 0]}
            valueMaxWidth={1.5}
          />
        ))}
      </group>
      
      {/* Divider antes de la sección de empleo */}
      <Divider position={[0, -0.75, 0]} style="double" />
      
      {/* Sección de empleo actual */}
      <group position={[0, -0.95, 0]}>
        <Text
          position={[layout.contentLeft, 0, 0]}
          fontSize={layout.fontSize.small}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          letterSpacing={0.03}
        >
          {'◇ CURRENT EMPLOYMENT'}
        </Text>
        
        <TypewriterText
          position={[layout.contentLeft + 0.1, -0.18, 0]}
          fontSize={layout.fontSize.small}
          color={PIPBOY_COLORS.screenTextDim}
          delay={0.3}
          speed={0.025}
          showCursor
        >
          {profile.employment.period}
        </TypewriterText>
        
        <TypewriterText
          position={[layout.contentLeft + 0.1, -0.35, 0]}
          fontSize={layout.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          maxWidth={3.5}
          delay={0.8}
          speed={0.015}
          showCursor
        >
          {profile.employment.description.slice(0, 120) + '...'}
        </TypewriterText>
      </group>
      
    </group>
  );
}
