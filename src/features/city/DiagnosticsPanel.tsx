'use client';

import { useEffect, useState, type MutableRefObject } from 'react';
import type { GameInput } from './CityScene';
import type { RendererIdentity } from './renderer';

/** Shows opt-in local diagnostics; never sends results to an external service. */
export default function DiagnosticsPanel({ input, identity, assetsReadyAt, running, report, onBegin }: {
  input: MutableRefObject<GameInput>;
  identity: RendererIdentity | null;
  assetsReadyAt: number | null;
  running: boolean;
  report: object | null;
  onBegin: () => void;
}) {
  const [phase, setPhase] = useState('idle');
  useEffect(() => {
    const timer = window.setInterval(() => setPhase(input.current.tour?.phase ?? 'idle'), 500);
    return () => window.clearInterval(timer);
  }, [input]);
  return <aside aria-label="Diagnóstico del distrito" style={{ position: 'absolute', right: 20, bottom: 20, width: 'min(390px, calc(100vw - 40px))', maxHeight: '65dvh', overflow: 'auto', background: '#102126f5', border: '1px solid #d7ff9e80', padding: 18, borderRadius: 6, zIndex: 6, font: '11px/1.6 monospace', color: '#e4e8dc' }}>
    <strong>DIAGNÓSTICO LOCAL / {identity?.actual ?? 'initializing'}</strong>
    <p>Solicitado: {identity?.requested ?? '—'} · Calidad fijada por URL.</p>
    <p>Ruta: plaza → salón Globant → plaza. Warmup: 5 s.<br />Estado: <output data-testid="benchmark-phase">{phase}</output></p>
    {identity?.fallbackReason && <p style={{ color: '#ffd28a' }}>{identity.fallbackReason}</p>}
    <button disabled={running || assetsReadyAt === null} onClick={onBegin} style={{ padding: '10px 16px', background: '#d7ff9e', color: '#183027', border: 0, borderRadius: 3 }}>Iniciar recorrido medido</button>
    <p>Mantené esta pestaña activa. Perder foco invalida la corrida.<br />Frame time incluye el navegador; no es tiempo GPU.</p>
    {report && <><strong>Resultado JSON</strong><pre data-testid="benchmark-result" style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto', fontSize: 9, background: '#08171b', padding: 10 }}>{JSON.stringify(report, null, 2)}</pre></>}
  </aside>;
}
