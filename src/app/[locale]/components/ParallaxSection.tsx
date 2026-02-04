'use client';

import { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // -1 a 1, negativo = más lento, positivo = más rápido
  className?: string;
  fadeIn?: boolean;
  scaleIn?: boolean;
  rotateIn?: boolean;
}

/**
 * Componente de sección con efecto parallax
 * Usa GSAP ScrollTrigger para animaciones basadas en scroll
 */
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = '',
  fadeIn = true,
  scaleIn = false,
  rotateIn = false,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    
    const section = sectionRef.current;
    const content = contentRef.current;
    
    // Parallax effect
    gsap.to(content, {
      yPercent: speed * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    
    // Fade in animation
    if (fadeIn) {
      gsap.from(content, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    
    // Scale in animation
    if (scaleIn) {
      gsap.from(content, {
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    
    // Rotate in animation
    if (rotateIn) {
      gsap.from(content, {
        rotateX: 10,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [speed, fadeIn, scaleIn, rotateIn]);
  
  return (
    <div ref={sectionRef} className={`overflow-hidden ${className}`}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

/**
 * Componente para elementos que aparecen con stagger
 */
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerReveal({ 
  children, 
  className = '',
  staggerDelay = 0.1,
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const items = containerRef.current.children;
    
    gsap.from(items, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [staggerDelay]);
  
  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Texto que se revela palabra por palabra
 */
interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({ 
  children, 
  className = '',
  as: Component = 'p',
}: TextRevealProps) {
  const textRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!textRef.current) return;
    
    const words = children.split(' ');
    textRef.current.innerHTML = words
      .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
      .join(' ');
    
    const spans = textRef.current.querySelectorAll('span > span');
    
    gsap.from(spans, {
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [children]);
  
  return (
    <Component ref={textRef as React.RefObject<HTMLParagraphElement>} className={className}>
      {children}
    </Component>
  );
}

export default ParallaxSection;
