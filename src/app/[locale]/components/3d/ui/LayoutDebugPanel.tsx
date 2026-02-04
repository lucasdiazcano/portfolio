'use client';

import { useState } from 'react';
import { create } from 'zustand';

/**
 * Store para los valores de layout editables en tiempo real
 */
interface LayoutDebugStore {
  contentTop: number;
  contentLeft: number;
  contentWidth: number;
  lineHeight: number;
  fontSize: {
    title: number;
    heading: number;
    body: number;
    small: number;
    micro: number;
  };
  set: (key: string, value: number) => void;
  setFontSize: (key: string, value: number) => void;
}

export const useLayoutDebug = create<LayoutDebugStore>((set) => ({
  contentTop: 0.85,
  contentLeft: -2.25,
  contentWidth: 4.5,
  lineHeight: 0.24,
  fontSize: {
    title: 0.18,
    heading: 0.16,
    body: 0.14,
    small: 0.12,
    micro: 0.10,
  },
  set: (key, value) => set((state) => ({ ...state, [key]: value })),
  setFontSize: (key, value) => set((state) => ({
    ...state,
    fontSize: { ...state.fontSize, [key]: value }
  })),
}));

/**
 * Panel de debug para ajustar layout en tiempo real
 * Presiona D para mostrar/ocultar
 */
export default function LayoutDebugPanel() {
  const [visible, setVisible] = useState(false);
  const layout = useLayoutDebug();

  // Toggle con tecla D
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!e.repeat) setVisible(v => !v);
      }
    }, { once: false });
  }

  if (!visible) {
    return (
      <div className="fixed top-4 right-4 z-50 text-green-500 text-xs opacity-50">
        Press [D] for debug panel
      </div>
    );
  }

  const Slider = ({ 
    label, 
    value, 
    min, 
    max, 
    step = 0.01,
    onChange 
  }: { 
    label: string; 
    value: number; 
    min: number; 
    max: number; 
    step?: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center gap-2 mb-2">
      <label className="w-24 text-xs">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-32 accent-green-500"
      />
      <span className="w-12 text-xs text-right">{value.toFixed(3)}</span>
    </div>
  );

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/90 border border-green-500/50 p-4 rounded text-green-500 font-mono text-sm max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">🎮 Layout Debug</h3>
        <button onClick={() => setVisible(false)} className="text-red-500 hover:text-red-400">✕</button>
      </div>

      <div className="mb-4">
        <h4 className="text-xs text-green-400 mb-2 border-b border-green-500/30 pb-1">POSITION</h4>
        <Slider label="contentTop" value={layout.contentTop} min={0} max={2} onChange={(v) => layout.set('contentTop', v)} />
        <Slider label="contentLeft" value={layout.contentLeft} min={-3} max={0} onChange={(v) => layout.set('contentLeft', v)} />
        <Slider label="contentWidth" value={layout.contentWidth} min={2} max={6} onChange={(v) => layout.set('contentWidth', v)} />
        <Slider label="lineHeight" value={layout.lineHeight} min={0.1} max={0.5} onChange={(v) => layout.set('lineHeight', v)} />
      </div>

      <div className="mb-4">
        <h4 className="text-xs text-green-400 mb-2 border-b border-green-500/30 pb-1">FONT SIZES</h4>
        <Slider label="title" value={layout.fontSize.title} min={0.05} max={0.3} step={0.005} onChange={(v) => layout.setFontSize('title', v)} />
        <Slider label="heading" value={layout.fontSize.heading} min={0.05} max={0.25} step={0.005} onChange={(v) => layout.setFontSize('heading', v)} />
        <Slider label="body" value={layout.fontSize.body} min={0.05} max={0.2} step={0.005} onChange={(v) => layout.setFontSize('body', v)} />
        <Slider label="small" value={layout.fontSize.small} min={0.03} max={0.15} step={0.005} onChange={(v) => layout.setFontSize('small', v)} />
        <Slider label="micro" value={layout.fontSize.micro} min={0.03} max={0.12} step={0.005} onChange={(v) => layout.setFontSize('micro', v)} />
      </div>

      <div className="text-xs text-green-400/70 border-t border-green-500/30 pt-2">
        <p>Copy these values when done:</p>
        <pre className="bg-black/50 p-2 mt-2 text-[10px] overflow-x-auto">
{`LAYOUT = {
  contentTop: ${layout.contentTop.toFixed(2)},
  contentLeft: ${layout.contentLeft.toFixed(2)},
  contentWidth: ${layout.contentWidth.toFixed(2)},
  lineHeight: ${layout.lineHeight.toFixed(2)},
  fontSize: {
    title: ${layout.fontSize.title.toFixed(3)},
    heading: ${layout.fontSize.heading.toFixed(3)},
    body: ${layout.fontSize.body.toFixed(3)},
    small: ${layout.fontSize.small.toFixed(3)},
    micro: ${layout.fontSize.micro.toFixed(3)},
  }
}`}
        </pre>
      </div>
    </div>
  );
}
