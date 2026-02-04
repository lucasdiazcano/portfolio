'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { usePipBoyStore, type PipBoyStore } from '../../store';
import { 
  Divider, 
  LAYOUT,
  Badge,
  TerminalBorder,
} from './UIComponents';

/**
 * Vista de detalle de proyecto - Inspección de item estilo Fallout
 * Diseño mejorado con layout estructurado
 */
export default function ProjectDetailView() {
  const project = usePipBoyStore((state: PipBoyStore) => state.getCurrentProject());
  const closeDetail = usePipBoyStore((state: PipBoyStore) => state.closeDetail);
  
  if (!project) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Borde decorativo */}
      <TerminalBorder width={4.6} height={2.8} position={[0, -0.35, 0]} />
      
      {/* Header con título del proyecto */}
      <group position={[0, LAYOUT.contentTop + 0.05, 0]}>
        {/* Fondo del título */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[3.5, 0.28]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.35} />
        </mesh>
        
        {/* Icono */}
        <Text
          position={[LAYOUT.contentLeft + 0.05, 0, 0]}
          fontSize={LAYOUT.fontSize.heading}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
        >
          {'▣'}
        </Text>
        
        {/* Título */}
        <Text
          position={[LAYOUT.contentLeft + 0.2, 0, 0]}
          fontSize={LAYOUT.fontSize.heading}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          maxWidth={3}
        >
          {project.title.toUpperCase()}
        </Text>
      </group>
      
      {/* Metadata en dos columnas */}
      <group position={[0, LAYOUT.contentTop - 0.28, 0]}>
        {/* Columna izquierda */}
        <group position={[LAYOUT.contentLeft, 0, 0]}>
          <Text fontSize={LAYOUT.fontSize.micro} color={PIPBOY_COLORS.screenTextMuted} anchorX="left">
            CLIENT
          </Text>
          <Text position={[0, -0.12, 0]} fontSize={LAYOUT.fontSize.small} color={PIPBOY_COLORS.screenTextDim} anchorX="left">
            {project.client}
          </Text>
        </group>
        
        {/* Columna derecha */}
        <group position={[0.6, 0, 0]}>
          <Text fontSize={LAYOUT.fontSize.micro} color={PIPBOY_COLORS.screenTextMuted} anchorX="left">
            LOCATION
          </Text>
          <Text position={[0, -0.12, 0]} fontSize={LAYOUT.fontSize.small} color={PIPBOY_COLORS.screenTextDim} anchorX="left">
            {project.location}
          </Text>
        </group>
        
        {/* Sector badge */}
        <Badge variant="default" position={[1.45, -0.06, 0]}>
          {project.sector}
        </Badge>
      </group>
      
      {/* English Communication badge si aplica */}
      {project.englishCommunication && (
        <Badge variant="highlight" position={[-0.8, LAYOUT.contentTop - 0.55, 0]}>
          🇺🇸 ENGLISH TEAM
        </Badge>
      )}
      
      {/* Separador */}
      <Divider position={[0, LAYOUT.contentTop - 0.7, 0]} style="double" />
      
      {/* Descripción */}
      <group position={[0, LAYOUT.contentTop - 0.9, 0]}>
        <Text
          position={[LAYOUT.contentLeft, 0, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          letterSpacing={0.03}
        >
          {'◇ DESCRIPTION'}
        </Text>
        
        <Text
          position={[LAYOUT.contentLeft, -0.15, 0]}
          fontSize={LAYOUT.fontSize.small}
          color={PIPBOY_COLORS.screenTextDim}
          anchorX="left"
          maxWidth={3.2}
          lineHeight={1.4}
        >
          {project.description}
        </Text>
      </group>
      
      {/* Tech Stack */}
      <group position={[0, -0.75, 0]}>
        <Text
          position={[LAYOUT.contentLeft, 0, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenText}
          anchorX="left"
          letterSpacing={0.03}
        >
          {'◇ TECH STACK'}
        </Text>
        
        <Text
          position={[LAYOUT.contentLeft, -0.14, 0]}
          fontSize={LAYOUT.fontSize.small}
          color={PIPBOY_COLORS.screenTextDim}
          anchorX="left"
          maxWidth={3.2}
        >
          {project.technologies.join('  •  ')}
        </Text>
      </group>
      
      {/* Context si existe */}
      {project.context && (
        <Text
          position={[LAYOUT.contentLeft, -1.1, 0]}
          fontSize={LAYOUT.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="left"
        >
          {`▸ ${project.context}`}
        </Text>
      )}
      
      {/* Botón de volver */}
      <group position={[0, -1.45, 0]} onClick={closeDetail}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.6, 0.22]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.3} />
        </mesh>
        <Text
          fontSize={LAYOUT.fontSize.small}
          color={PIPBOY_COLORS.screenText}
          anchorX="center"
        >
          {'[ESC] BACK TO LIST'}
        </Text>
      </group>
    </group>
  );
}
