'use client';

import { useState } from 'react';
import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../types';

interface TerminalContentProps {
  hovered: boolean;
}

interface TabContent {
  lines: Array<{
    text: string;
    color?: string;
  }>;
}

const TABS = ['STATS', 'PROJECTS', 'SKILLS'] as const;

const TAB_CONTENT: Record<typeof TABS[number], TabContent> = {
  STATS: {
    lines: [
      { text: '> NAME: Lucas Díaz' },
      { text: '> ROLE: Software Dev' },
      { text: '> LEVEL: Senior' },
      { text: '> STATUS: CHECKING...', color: PIPBOY_COLORS.screenText },
    ],
  },
  PROJECTS: {
    lines: [
      { text: '[01] Fintech Platform' },
      { text: '[02] E-Commerce App' },
      { text: '[03] Real-time Dashboard' },
      { text: '> SELECT PROJECT...', color: PIPBOY_COLORS.screenText },
    ],
  },
  SKILLS: {
    lines: [
      { text: 'React ████████░░ 85%', color: PIPBOY_COLORS.screenText },
      { text: 'TypeScript ███████░░░ 75%', color: PIPBOY_COLORS.screenText },
      { text: 'Next.js ████████░░ 80%', color: PIPBOY_COLORS.screenText },
      { text: 'Three.js ███░░░░░░░ 30%', color: PIPBOY_COLORS.screenText },
    ],
  },
};

/**
 * Contenido de la terminal que se renderiza dentro del RenderTexture
 */
export default function TerminalContent({ hovered }: TerminalContentProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const currentTab = TABS[selectedTab];
  const content = TAB_CONTENT[currentTab];

  // Actualizar el status dinámicamente
  const getLines = () => {
    if (currentTab === 'STATS') {
      return content.lines.map((line, i) => 
        i === 3 
          ? { ...line, text: `> STATUS: ${hovered ? 'ACTIVE' : 'IDLE'}` }
          : line
      );
    }
    return content.lines;
  };

  return (
    <>
      {/* Fondo de la pantalla - verde oscuro */}
      <color attach="background" args={['#001a00']} />
      
      {/* Luz para la escena interna */}
      <ambientLight intensity={2} />
      
      {/* Header con tabs */}
      <group position={[0, 1.5, 0]}>
        {TABS.map((tab, i) => (
          <Text
            key={tab}
            position={[(i - 1) * 1.2, 0, 0]}
            fontSize={0.25}
            color={selectedTab === i ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextMuted}
            anchorX="center"
            onClick={() => setSelectedTab(i)}
          >
            [{tab}]
          </Text>
        ))}
      </group>

      {/* Línea divisoria */}
      <mesh position={[0, 1.1, 0]}>
        <planeGeometry args={[4, 0.02]} />
        <meshBasicMaterial color={PIPBOY_COLORS.screenText} />
      </mesh>

      {/* Contenido dinámico */}
      <group position={[0, 0, 0]}>
        {getLines().map((line, i) => (
          <Text
            key={`${currentTab}-${i}`}
            position={[-1, 0.5 - (i * 0.5), 0]}
            fontSize={currentTab === 'STATS' ? 0.2 : 0.18}
            color={line.color || PIPBOY_COLORS.screenTextDim}
            anchorX="left"
          >
            {line.text}
          </Text>
        ))}
      </group>

      {/* Footer */}
      <Text 
        position={[0, -1.7, 0]} 
        fontSize={0.15} 
        color={PIPBOY_COLORS.screenAccent} 
        anchorX="center"
      >
        {`// PIP-BOY 3000 v2026.1`}
      </Text>
    </>
  );
}
