'use client';

import { useRef, useState, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  glareEnable?: boolean;
  glareMaxOpacity?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 15,
  glareEnable = true,
  glareMaxOpacity = 0.3,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Posición del mouse relativa al centro (-1 a 1)
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    // Calcular rotación (invertimos Y para que se incline hacia el cursor)
    const rotateX = -mouseY * tiltMaxAngle;
    const rotateY = mouseX * tiltMaxAngle;

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    // Posición del brillo (0-100%)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: isHovering 
          ? 'transform 0.1s ease-out' 
          : 'transform 0.5s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
      
      {/* Efecto de brillo/glare */}
      {glareEnable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden"
          style={{
            background: `radial-gradient(
              circle at ${glarePosition.x}% ${glarePosition.y}%,
              rgba(255, 255, 255, ${isHovering ? glareMaxOpacity : 0}) 0%,
              transparent 60%
            )`,
            transition: isHovering 
              ? 'opacity 0.1s ease-out' 
              : 'opacity 0.5s ease-out',
          }}
        />
      )}

      {/* Sombra dinámica */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-lg"
        style={{
          transform: 'translateZ(-50px)',
          boxShadow: isHovering
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 12px 24px -8px rgba(0, 0, 0, 0.3)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
          transition: 'box-shadow 0.3s ease-out',
        }}
      />
    </div>
  );
}
