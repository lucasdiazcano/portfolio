'use client';

import { useEffect, useCallback } from 'react';
import { usePipBoyStore, type PipBoyStore } from '../store';

/**
 * Hook para navegación con teclado estilo Fallout
 * 
 * Controles:
 * - Q / ← (izquierda) : Tab anterior
 * - E / → (derecha)   : Tab siguiente
 * - W / ↑ (arriba)    : Item anterior
 * - S / ↓ (abajo)     : Item siguiente
 * - Enter / Space     : Abrir detalle / Seleccionar
 * - Escape / Backspace: Cerrar detalle / Volver
 * 
 * @example
 * // En el componente raíz del PipBoy
 * usePipBoyKeyboard();
 */
export function usePipBoyKeyboard() {
  const nextTab = usePipBoyStore((state: PipBoyStore) => state.nextTab);
  const prevTab = usePipBoyStore((state: PipBoyStore) => state.prevTab);
  const nextItem = usePipBoyStore((state: PipBoyStore) => state.nextItem);
  const prevItem = usePipBoyStore((state: PipBoyStore) => state.prevItem);
  const openDetail = usePipBoyStore((state: PipBoyStore) => state.openDetail);
  const closeDetail = usePipBoyStore((state: PipBoyStore) => state.closeDetail);
  const isViewingDetail = usePipBoyStore((state: PipBoyStore) => state.isViewingDetail);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorar si está en un input o textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch (event.key) {
      // ============ NAVEGACIÓN DE TABS ============
      case 'q':
      case 'Q':
      case 'ArrowLeft':
        event.preventDefault();
        prevTab();
        break;
        
      case 'e':
      case 'E':
      case 'ArrowRight':
        event.preventDefault();
        nextTab();
        break;
      
      // ============ NAVEGACIÓN DE ITEMS ============
      case 'w':
      case 'W':
      case 'ArrowUp':
        event.preventDefault();
        prevItem();
        break;
        
      case 's':
      case 'S':
      case 'ArrowDown':
        event.preventDefault();
        nextItem();
        break;
      
      // ============ SELECCIÓN / DETALLE ============
      case 'Enter':
      case ' ': // Space
        event.preventDefault();
        if (isViewingDetail) {
          closeDetail();
        } else {
          openDetail();
        }
        break;
        
      case 'Escape':
      case 'Backspace':
        event.preventDefault();
        if (isViewingDetail) {
          closeDetail();
        }
        break;
      
      default:
        break;
    }
  }, [nextTab, prevTab, nextItem, prevItem, openDetail, closeDetail, isViewingDetail]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook para navegación con scroll del mouse
 * Scroll arriba/abajo cambia el item seleccionado
 */
export function usePipBoyScroll() {
  const nextItem = usePipBoyStore((state: PipBoyStore) => state.nextItem);
  const prevItem = usePipBoyStore((state: PipBoyStore) => state.prevItem);
  
  const handleWheel = useCallback((event: WheelEvent) => {
    // Threshold para evitar scroll accidental
    if (Math.abs(event.deltaY) < 10) return;
    
    if (event.deltaY > 0) {
      nextItem();
    } else {
      prevItem();
    }
  }, [nextItem, prevItem]);
  
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);
}

/**
 * Hook combinado que activa toda la navegación del Pip-Boy
 * Incluye teclado y scroll
 */
export function usePipBoyNavigation() {
  usePipBoyKeyboard();
  usePipBoyScroll();
}
