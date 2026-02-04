'use client';

import { Text } from '@react-three/drei';
import { PIPBOY_COLORS } from '../../types';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { useLayoutDebug } from '../LayoutDebugPanel';
import gsap from 'gsap';

/**
 * Hook para obtener el layout actual (desde debug panel)
 * Los componentes deben usar este hook para valores reactivos
 */
export function useLayout() {
  const debug = useLayoutDebug();
  return {
    contentTop: debug.contentTop,
    contentLeft: debug.contentLeft,
    contentRight: -debug.contentLeft,
    contentWidth: debug.contentWidth,
    contentBottom: -1.6,
    lineHeight: debug.lineHeight,
    sectionGap: 0.08,
    fontSize: debug.fontSize,
  };
}

/**
 * Valores estáticos por defecto (usados cuando no hay hook disponible)
 * NOTA: Los componentes principales usan useLayout() para ser reactivos
 */
export const LAYOUT = {
  contentTop: 0.85,
  contentLeft: -2.25,
  contentRight: 2.25,
  contentWidth: 4.5,
  contentBottom: -1.6,
  lineHeight: 0.24,
  sectionGap: 0.08,
  fontSize: {
    title: 0.14,
    heading: 0.12,
    body: 0.10,
    small: 0.08,
    micro: 0.065,
  },
} as const;

/**
 * Texto con efecto typewriter usando GSAP
 * El texto aparece letra por letra
 */
export function TypewriterText({
  children,
  position = [0, 0, 0] as [number, number, number],
  fontSize = 0.1,
  color = PIPBOY_COLORS.screenText,
  anchorX = 'left' as const,
  anchorY = 'middle' as const,
  speed = 0.03, // segundos por caracter
  delay = 0, // delay inicial
  maxWidth,
  showCursor = false,
  onComplete,
}: {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  speed?: number;
  delay?: number;
  maxWidth?: number;
  showCursor?: boolean;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState('');
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(showCursor);
  const fullText = children;
  const progressRef = useRef({ value: 0 });
  
  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    progressRef.current.value = 0;
    setShowBlinkingCursor(showCursor);
    
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        setShowBlinkingCursor(false);
        onComplete?.();
      }
    });
    
    tl.to(progressRef.current, {
      value: fullText.length,
      duration: fullText.length * speed,
      ease: 'none',
      onUpdate: () => {
        const chars = Math.floor(progressRef.current.value);
        setDisplayText(fullText.slice(0, chars));
      }
    });
    
    return () => {
      tl.kill();
    };
  }, [fullText, speed, delay, onComplete, showCursor]);
  
  // Cursor blinking effect
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!showBlinkingCursor) return;
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 400);
    return () => clearInterval(interval);
  }, [showBlinkingCursor]);
  
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
    >
      {displayText}{showBlinkingCursor && cursorVisible ? '█' : showBlinkingCursor ? ' ' : ''}
    </Text>
  );
}

/**
 * Borde decorativo estilo terminal
 */
export function TerminalBorder({ 
  width = 4.6, 
  height = 2.8,
  position = [0, 0, 0] as [number, number, number]
}) {
  const halfW = width / 2;
  const halfH = height / 2;
  const cornerSize = 0.08;
  const lineThickness = 0.015;
  
  return (
    <group position={position}>
      {/* Esquinas */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, y], i) => (
        <group key={i} position={[x * halfW, y * halfH, 0]}>
          {/* Línea horizontal de esquina */}
          <mesh position={[-x * cornerSize / 2, 0, 0]}>
            <planeGeometry args={[cornerSize, lineThickness]} />
            <meshBasicMaterial color={PIPBOY_COLORS.screenTextMuted} />
          </mesh>
          {/* Línea vertical de esquina */}
          <mesh position={[0, -y * cornerSize / 2, 0]}>
            <planeGeometry args={[lineThickness, cornerSize]} />
            <meshBasicMaterial color={PIPBOY_COLORS.screenTextMuted} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Encabezado de sección con línea decorativa
 */
export function SectionHeader({ 
  children, 
  position = [0, 0, 0] as [number, number, number],
  showLine = true,
}: { 
  children: string; 
  position?: [number, number, number];
  showLine?: boolean;
}) {
  const layout = useLayout();
  
  return (
    <group position={position}>
      {/* Icono de sección */}
      <Text
        position={[layout.contentLeft, 0, 0]}
        fontSize={layout.fontSize.small}
        color={PIPBOY_COLORS.screenText}
        anchorX="left"
      >
        {'◆'}
      </Text>
      
      {/* Título */}
      <Text
        position={[layout.contentLeft + 0.15, 0, 0]}
        fontSize={layout.fontSize.title}
        color={PIPBOY_COLORS.screenText}
        anchorX="left"
        letterSpacing={0.05}
      >
        {children.toUpperCase()}
      </Text>
      
      {/* Línea decorativa */}
      {showLine && (
        <mesh position={[0.4, 0, -0.01]}>
          <planeGeometry args={[1.8, 0.008]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Fila de datos con label y valor alineados
 */
export function DataRow({ 
  label, 
  value, 
  isSelected = false,
  isHighlighted = false,
  position = [0, 0, 0] as [number, number, number],
  valueMaxWidth = 2.2,
}: { 
  label: string;
  value: string;
  isSelected?: boolean;
  isHighlighted?: boolean;
  position?: [number, number, number];
  valueMaxWidth?: number;
}) {
  const layout = useLayout();
  
  return (
    <group position={position}>
      {/* Fondo de selección */}
      {isSelected && (
        <mesh position={[0.1, 0, -0.02]}>
          <planeGeometry args={[layout.contentWidth, layout.lineHeight - 0.05]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.25} />
        </mesh>
      )}
      
      {/* Indicador de selección */}
      <Text
        position={[layout.contentLeft - 0.12, 0, 0]}
        fontSize={layout.fontSize.body}
        color={isSelected ? PIPBOY_COLORS.screenText : 'transparent'}
        anchorX="left"
      >
        {'▶'}
      </Text>
      
      {/* Label */}
      <Text
        position={[layout.contentLeft, 0, 0]}
        fontSize={layout.fontSize.body}
        color={PIPBOY_COLORS.screenTextMuted}
        anchorX="left"
      >
        {label}
      </Text>
      
      {/* Separador punteado */}
      <Text
        position={[-0.3, 0, 0]}
        fontSize={layout.fontSize.micro}
        color={PIPBOY_COLORS.screenAccent}
        anchorX="left"
      >
        {'·····'}
      </Text>
      
      {/* Value */}
      <Text
        position={[0.1, 0, 0]}
        fontSize={layout.fontSize.body}
        color={isHighlighted ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextDim}
        anchorX="left"
        maxWidth={valueMaxWidth}
      >
        {value}
      </Text>
    </group>
  );
}

/**
 * Item de lista con número y título
 */
export function ListItem({
  index,
  title,
  subtitle,
  isSelected = false,
  position = [0, 0, 0] as [number, number, number],
  onClick,
}: {
  index: number;
  title: string;
  subtitle?: string;
  isSelected?: boolean;
  position?: [number, number, number];
  onClick?: () => void;
}) {
  const layout = useLayout();
  return (
    <group position={position} onClick={onClick}>
      {/* Fondo de selección */}
      {isSelected && (
        <mesh position={[0.1, 0, -0.02]}>
          <planeGeometry args={[layout.contentWidth, layout.lineHeight]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Indicador */}
      <Text
        position={[layout.contentLeft - 0.12, 0, 0]}
        fontSize={layout.fontSize.body}
        color={isSelected ? PIPBOY_COLORS.screenText : 'transparent'}
        anchorX="left"
      >
        {'▶'}
      </Text>
      
      {/* Número */}
      <Text
        position={[layout.contentLeft, 0, 0]}
        fontSize={layout.fontSize.small}
        color={PIPBOY_COLORS.screenTextMuted}
        anchorX="left"
      >
        {String(index).padStart(2, '0')}
      </Text>
      
      {/* Título */}
      <Text
        position={[layout.contentLeft + 0.35, 0, 0]}
        fontSize={layout.fontSize.body}
        color={isSelected ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextDim}
        anchorX="left"
        maxWidth={2.8}
      >
        {title.length > 35 ? title.slice(0, 35) + '...' : title}
      </Text>
      
      {/* Subtítulo/Badge */}
      {subtitle && (
        <Text
          position={[layout.contentRight, 0, 0]}
          fontSize={layout.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="right"
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
}

/**
 * Barra de progreso estilizada
 */
export function ProgressBar({
  value,
  maxValue = 100,
  width = 1.2,
  height = 0.08,
  showValue = true,
  isSelected = false,
  position = [0, 0, 0] as [number, number, number],
}: {
  value: number;
  maxValue?: number;
  width?: number;
  height?: number;
  showValue?: boolean;
  isSelected?: boolean;
  position?: [number, number, number];
}) {
  const layout = useLayout();
  const percentage = Math.min(value / maxValue, 1);
  const segments = 10;
  const segmentWidth = width / segments;
  
  return (
    <group position={position}>
      {/* Fondo */}
      <mesh position={[width / 2, 0, -0.01]}>
        <planeGeometry args={[width + 0.02, height + 0.02]} />
        <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.2} />
      </mesh>
      
      {/* Segmentos llenos */}
      {[...Array(segments)].map((_, i) => {
        const isFilled = (i + 1) / segments <= percentage;
        return (
          <mesh key={i} position={[i * segmentWidth + segmentWidth / 2 + 0.01, 0, 0]}>
            <planeGeometry args={[segmentWidth - 0.02, height - 0.02]} />
            <meshBasicMaterial 
              color={isFilled 
                ? (isSelected ? PIPBOY_COLORS.screenText : PIPBOY_COLORS.screenTextDim)
                : PIPBOY_COLORS.screenAccent
              } 
              transparent 
              opacity={isFilled ? 1 : 0.15}
            />
          </mesh>
        );
      })}
      
      {/* Valor numérico */}
      {showValue && (
        <Text
          position={[width + 0.1, 0, 0]}
          fontSize={layout.fontSize.micro}
          color={PIPBOY_COLORS.screenTextMuted}
          anchorX="left"
        >
          {`${value}%`}
        </Text>
      )}
    </group>
  );
}

/**
 * Separador horizontal con estilo
 */
export function Divider({
  position = [0, 0, 0] as [number, number, number],
  width = 3.2,
  style = 'solid' as 'solid' | 'dashed' | 'double',
}) {
  if (style === 'double') {
    return (
      <group position={position}>
        <mesh position={[0, 0.015, 0]}>
          <planeGeometry args={[width, 0.008]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.015, 0]}>
          <planeGeometry args={[width, 0.008]} />
          <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }
  
  return (
    <mesh position={position}>
      <planeGeometry args={[width, 0.01]} />
      <meshBasicMaterial color={PIPBOY_COLORS.screenAccent} transparent opacity={0.4} />
    </mesh>
  );
}

/**
 * Footer con instrucciones de navegación
 */
export function NavigationFooter({
  position = [0, -1.45, 0] as [number, number, number],
  instructions = '[↑↓] Navigate  [ENTER] Select  [Q/E] Tab',
}) {
  const layout = useLayout();
  return (
    <group position={position}>
      <Divider position={[0, 0.12, 0]} style="double" />
      <Text
        fontSize={layout.fontSize.micro}
        color={PIPBOY_COLORS.screenTextMuted}
        anchorX="center"
        letterSpacing={0.02}
      >
        {instructions}
      </Text>
    </group>
  );
}

/**
 * Contador de items (ej: [2/5])
 */
export function ItemCounter({
  current,
  total,
  position = [0, 0, 0] as [number, number, number],
}: {
  current: number;
  total: number;
  position?: [number, number, number];
}) {
  const layout = useLayout();
  return (
    <Text
      position={position}
      fontSize={layout.fontSize.small}
      color={PIPBOY_COLORS.screenTextMuted}
      anchorX="right"
    >
      {`${String(current).padStart(2, '0')}/${String(total).padStart(2, '0')}`}
    </Text>
  );
}

/**
 * Badge/etiqueta destacada
 */
export function Badge({
  children,
  variant = 'default' as 'default' | 'highlight' | 'warning',
  position = [0, 0, 0] as [number, number, number],
}: {
  children: string;
  variant?: 'default' | 'highlight' | 'warning';
  position?: [number, number, number];
}) {
  const colors = {
    default: PIPBOY_COLORS.screenTextMuted,
    highlight: PIPBOY_COLORS.screenText,
    warning: '#ffaa00',
  };
  
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[children.length * 0.055 + 0.1, 0.14]} />
        <meshBasicMaterial color={colors[variant]} transparent opacity={0.15} />
      </mesh>
      <Text
        fontSize={LAYOUT.fontSize.micro}
        color={colors[variant]}
        anchorX="center"
        letterSpacing={0.03}
      >
        {children.toUpperCase()}
      </Text>
    </group>
  );
}
