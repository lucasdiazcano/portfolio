'use client';

import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Component, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import CityScene, { type GameInput, type CameraView, type NavigationStatus } from './CityScene';
import { COMPANY_BRANDS, type CompanyBrand } from './brands';
import { MUSEUM_ROOMS, type MuseumRoom } from './world';
import styles from './city.module.css';
import { BenchmarkTour, type TourResult } from './benchmark';
import { createCityRenderer, type CityRendererFactory, type RendererIdentity } from './renderer';

const DiagnosticsProbe = dynamic(() => import('./DiagnosticsProbe'), { ssr: false });
const DiagnosticsPanel = dynamic(() => import('./DiagnosticsPanel'), { ssr: false });

/** Shares the room's palette with its DOM interaction and career description. */
function companyStyle(brand: CompanyBrand): CSSProperties {
  return {
    '--company-accent': brand.accent,
    '--company-ink': brand.ink,
    '--company-surface': brand.surface,
  } as CSSProperties;
}

/** Keeps the portfolio reachable if graphics initialization fails. */
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  /** Converts rendering errors into the accessible fallback. */
  static getDerivedStateFromError() { return { failed: true }; }
  /** Displays the game or the recovery link. */
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Hosts the district, localized career rooms and keyboard/touch controls. */
export default function CityGame() {
  const locale = useLocale();
  const t = useTranslations();
  const spanish = locale === 'es';
  const rooms = t.raw('museum.rooms') as MuseumRoom[];
  const [diagnostics] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const enabled = query.get('benchmark') === '1';
    return { enabled, renderer: enabled && query.get('renderer') === 'webgpu' ? 'webgpu' as const : 'webgl' as const, low: enabled && query.get('quality') === 'low' };
  });
  const [view, setView] = useState<CameraView>('isometric');
  const [navigationStatus, setNavigationStatus] = useState<NavigationStatus>('idle');
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [nearby, setNearby] = useState(-1);
  const [selected, setSelected] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<'low' | 'high'>(diagnostics.low ? 'low' : 'high');
  const [identity, setIdentity] = useState<RendererIdentity | null>(null);
  const [assetsReadyAt, setAssetsReadyAt] = useState<number | null>(null);
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);
  const [benchmarkReport, setBenchmarkReport] = useState<object | null>(null);
  const input = useRef<GameInput>({ keys: new Set(), enabled: false, yaw: 0, pitch: 0, reset: 0, view: 'isometric', zoom: 1, command: null });
  const marker = useRef<HTMLSpanElement | null>(null);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const interaction = useRef<HTMLButtonElement>(null);
  const state = useRef({ started, paused, nearby, selected });
  const rendererIdentity = useRef<RendererIdentity | null>(null);
  const recordIdentity = useCallback((value: RendererIdentity) => { rendererIdentity.current = value; }, []);
  const rendererFactory = useCallback<CityRendererFactory>((defaults) => createCityRenderer(defaults, diagnostics.renderer, diagnostics.enabled, recordIdentity), [diagnostics.renderer, diagnostics.enabled, recordIdentity]);
  /** Owns navigation commands so scene callbacks never mutate React props. */
  const navigate = useCallback((command: GameInput['command']) => { input.current.command = command; }, []);
  const recordAssetsReady = useCallback((ms: number) => setAssetsReadyAt(ms), []);

  /** Resets to the same starting point and records an explicit foreground production/dev run. */
  function beginBenchmark() {
    setSelected(null);
    setView('third-person');
    input.current.view = 'third-person';
    input.current.command = null;
    setPaused(false);
    setStarted(true);
    setBenchmarkReport(null);
    setBenchmarkRunning(true);
    input.current.keys.clear();
    input.current.yaw = 0;
    input.current.pitch = 0;
    input.current.reset += 1;
    const canvas = document.querySelector('canvas');
    const viewport = { width: window.innerWidth, height: window.innerHeight, bufferWidth: canvas?.width ?? null, bufferHeight: canvas?.height ?? null, devicePixelRatio: window.devicePixelRatio };
    /** Captures available browser counters with their scope and cache limitations. */
    const finish = (result: TourResult) => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const resources = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter((entry) => entry.name.startsWith(location.origin));
      setBenchmarkReport({
        schema: 1,
        environment: process.env.NODE_ENV,
        capturedAt: new Date().toISOString(),
        renderer: identity,
        quality,
        viewport,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        assetsReadyFromNavigationMs: assetsReadyAt,
        transfer: {
          scope: 'same-origin document and resources since navigation; localhost, cache not forced cold',
          bytesIncludingHeaders: (navigation?.transferSize ?? 0) + resources.reduce((sum, entry) => sum + entry.transferSize, 0),
          encodedResourceBytes: resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
          zeroTransferResources: resources.filter((entry) => entry.transferSize === 0).length,
          resources: resources.map((entry) => ({ path: new URL(entry.name).pathname, transferBytes: entry.transferSize, encodedBytes: entry.encodedBodySize })),
        },
        limitations: ['Frame intervals are not GPU execution times.', 'Geometry/texture counters are object counts, not GPU memory bytes.', 'JS heap is optional and not total browser memory.', 'This run does not establish cold WAN loading or physical mobile performance.'],
        ...result,
      });
      setBenchmarkRunning(false);
    };
    input.current.tour = new BenchmarkTour(performance.now(), () => setSelected(0), () => setSelected(null), finish);
  }

  useEffect(() => {
    input.current.view = view;
    input.current.command = null;
    input.current.keys.clear();
    drag.current = null;
  }, [view]);

  useEffect(() => {
    state.current = { started, paused, nearby, selected };
    input.current.enabled = started && !paused && selected === null;
    if (!input.current.enabled) input.current.keys.clear();
  }, [started, paused, nearby, selected]);

  useEffect(() => {
    if (selected !== null) {
      dialog.current?.showModal();
      if (dialog.current) dialog.current.scrollTop = 0;
    } else dialog.current?.close();
  }, [selected]);

  useEffect(() => {
    /** Maps keyboard controls without intercepting browser shortcuts or dialog navigation. */
    const down = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || !state.current.started) return;
      if (input.current.tour?.active) {
        if (event.code === 'Escape') input.current.tour.abort('user-cancelled', performance.now());
        return;
      }
      if (event.code === 'Escape' && state.current.selected === null) {
        setPaused((value) => !value);
        return;
      }
      if (!input.current.enabled) return;
      if (event.code === 'KeyV' && !event.repeat) { setView((value) => value === 'isometric' ? 'third-person' : 'isometric'); return; }
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'].includes(event.code)) {
        event.preventDefault();
        input.current.keys.add(event.code);
      }
      if (event.code === 'KeyE' && !event.repeat && state.current.nearby >= 0) setSelected(state.current.nearby);
    };
    /** Releases movement when a key is lifted. */
    const up = (event: KeyboardEvent) => { input.current.keys.delete(event.code); };
    /** Prevents stuck movement when the tab loses focus. */
    const blur = () => {
      input.current.tour?.abort('focus-or-visibility-lost', performance.now());
      input.current.keys.clear();
      drag.current = null;
      if (state.current.started) setPaused(true);
    };
    /** Pauses animation updates while the page is hidden. */
    const visibility = () => { if (document.hidden) blur(); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  const fallback = <div className={styles.failure}>
    <h1>{spanish ? 'No se pudo iniciar el mundo 3D.' : 'The 3D world could not start.'}</h1>
    <p>{spanish ? 'Proba con la aceleración gráfica habilitada en tu navegador.' : 'Try enabling graphics acceleration in your browser.'}</p>
    <Link href={`/${locale}/projects`}>{spanish ? 'Ver los proyectos' : 'View projects'} →</Link>
  </div>;
  const room = selected === null ? null : rooms[selected];
  const selectedBrand = room ? COMPANY_BRANDS[room.brandId] : null;

  return <main className={styles.game}>
    <div className={styles.viewport}
      onPointerDown={(event) => {
        if (!input.current.enabled || input.current.view === 'isometric' || input.current.tour?.active || event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current || drag.current.id !== event.pointerId) return;
        input.current.yaw -= (event.clientX - drag.current.x) * 0.006;
        input.current.pitch = Math.max(-1, Math.min(3, input.current.pitch + (event.clientY - drag.current.y) * 0.012));
        drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}
      onWheel={(event) => {
        if (input.current.view !== 'isometric' || !input.current.enabled || event.ctrlKey || event.metaKey) return;
        input.current.zoom = Math.max(0.65, Math.min(1.8, input.current.zoom * Math.exp(-event.deltaY * 0.001)));
      }}
    >
      <SceneBoundary fallback={fallback}>
        <Canvas shadows={quality === 'high'} dpr={quality === 'high' ? [1, 1.5] : 1}
          camera={{ position: [0, 3, 20], fov: 55, near: 0.1, far: 160 }}
          gl={rendererFactory}
          frameloop={paused ? 'never' : 'always'}
          fallback={<span>{spanish ? 'Ciudad 3D interactiva. Los proyectos también están disponibles desde el menú.' : 'Interactive 3D city. Projects are also available from the menu.'}</span>}
          onCreated={({ gl }) => { gl.toneMappingExposure = 1.1; setIdentity(rendererIdentity.current); setReady(true); }}>
          <Suspense fallback={null}><CityScene input={input} marker={marker} onExhibit={setNearby} rooms={rooms} spanish={spanish} view={view} interactive={started && !paused && selected === null} onReadRoom={setSelected} onNavigate={navigate} onNavigationStatus={setNavigationStatus} />
            {diagnostics.enabled && <DiagnosticsProbe input={input} onAssetsReady={recordAssetsReady} />}
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>

    <header className={styles.header}>
      <Link href={`/${locale}`} className={styles.brand}>LDC<span> / INTERACTIVE PORTFOLIO</span></Link>
      <div className={styles.viewSwitch} role="group" aria-label={spanish ? 'Vista de cámara' : 'Camera view'}>
        <button aria-pressed={view === 'isometric'} disabled={benchmarkRunning} onClick={() => setView('isometric')}>{spanish ? 'Isométrica' : 'Isometric'}</button>
        <button aria-pressed={view === 'third-person'} disabled={benchmarkRunning} onClick={() => setView('third-person')}>{spanish ? '3ª persona' : '3rd person'}</button>
      </div>
      <button className={styles.menuButton} onClick={() => setPaused((value) => !value)} disabled={!started || benchmarkRunning}>{paused ? '▶' : 'Ⅱ'}<span>{spanish ? ' Menú' : ' Menu'}</span></button>
    </header>

    {started && !paused && <>
      <section className={styles.location}><span>34°36′ S / 58°22′ W · FICTIONAL DISTRICT</span><h1>{nearby >= 0 ? rooms[nearby].label : (spanish ? 'Museo de trayectoria' : 'Career museum')}<span> / DISTRITO</span></h1><p>{nearby >= 0 ? rooms[nearby].role : (spanish ? 'Globant, tres experiencias y mi formación.' : 'Globant, three client experiences and my education.')}</p></section>
      <nav className={`${styles.destinations} ${view === 'isometric' ? styles.isoDestinations : ''}`} aria-label={spanish ? 'Acceso directo al portfolio' : 'Portfolio shortcuts'}>
        <Link href={`/${locale}/projects`}>01 / {spanish ? 'Proyectos' : 'Projects'} ↗</Link>
        <Link href={`/${locale}/profile`}>02 / {spanish ? 'Perfil' : 'Profile'} ↗</Link>
        <Link href={`/${locale}/pipboy`}>03 / Pip-Boy ↗</Link>
      </nav>
      <aside className={styles.map} aria-label={spanish ? 'Mapa del distrito' : 'District map'}>
        <span className={styles.north}>N ↑</span><div className={styles.mapWorld}>
          <div className={styles.mapRoad} /><div className={styles.mapGallery}>{rooms.map((item, index) => <span key={item.brandId} title={item.label}>{String(index + 1).padStart(2, '0')}</span>)}</div>
          <div className={styles.mapBlock} /><div className={styles.mapBlockRight} />
          <span ref={marker} className={styles.playerMarker} />
        </div><p>{spanish ? 'MUSEO → NORTE' : 'MUSEUM → NORTH'}</p>
      </aside>
      <div className={styles.controls}>{view === 'isometric' ? <><span>{spanish ? 'CLIC' : 'CLICK'}</span> {spanish ? 'mover / visitar sala' : 'move / visit room'}<b> / </b>{spanish ? 'Rueda: zoom' : 'Wheel: zoom'}<b> / </b><span>V</span> {spanish ? 'cambiar vista' : 'switch view'}</> : <><span>W A S D</span> {spanish ? 'mover' : 'move'}<b> / </b><span>SHIFT</span> {spanish ? 'correr' : 'run'}<b> / </b>{spanish ? 'Arrastrá para mirar' : 'Drag to look'}</>}</div>
      {view === 'isometric' && navigationStatus !== 'idle' && <output className={styles.navigationStatus} aria-live="polite">{navigationStatus === 'unreachable' ? (spanish ? 'Ese punto no tiene acceso. Elegí suelo libre.' : 'No route there. Choose open ground.') : navigationStatus === 'moving' ? (spanish ? 'En camino… · Otro clic cambia el destino' : 'On the way… · Click again to redirect') : (spanish ? 'Llegaste.' : 'Arrived.')}</output>}
      <aside className={`${styles.galleryGuide} ${view === 'isometric' ? styles.isoGuide : ''}`} aria-label={spanish ? 'Salas del museo' : 'Museum rooms'}>
        <p>{spanish ? 'MI TRAYECTORIA / SALAS' : 'MY JOURNEY / ROOMS'}</p>
        {rooms.map((item, index) => <button key={item.brandId} data-active={nearby === index} aria-label={`${spanish ? 'Visitar' : 'Visit'} ${item.label}`} style={companyStyle(COMPANY_BRANDS[item.brandId])} onClick={() => {
          if (view === 'isometric') input.current.command = { x: MUSEUM_ROOMS[index].x, z: MUSEUM_ROOMS[index].z, room: index };
          else setSelected(index);
        }}><span>0{index + 1}</span><b>{item.label}</b></button>)}
      </aside>
      {nearby >= 0 && <button ref={interaction} className={styles.interact} style={companyStyle(COMPANY_BRANDS[rooms[nearby].brandId])} onClick={() => setSelected(nearby)}><kbd>E</kbd><span>{spanish ? 'Leer mi trayectoria' : 'Read my story'}<small>{rooms[nearby].client}</small></span>↗</button>}
      <div className={view === 'third-person' ? styles.touchControls : styles.hideControls} aria-label={spanish ? 'Controles táctiles' : 'Touch controls'}>
        {(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft'] as const).map((key, index) => <button key={key} aria-label={(spanish ? ['Avanzar', 'Izquierda', 'Retroceder', 'Derecha', 'Correr (mantener)'] : ['Forward', 'Left', 'Back', 'Right', 'Run (hold)'])[index]}
          onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); input.current.keys.add(key); }}
          onPointerUp={() => input.current.keys.delete(key)} onPointerCancel={() => input.current.keys.delete(key)} onLostPointerCapture={() => input.current.keys.delete(key)}>{['↑', '←', '↓', '→', '⇧'][index]}</button>)}
      </div>
    </>}

    {(!started || paused) && <section className={styles.start}>
      <div className={styles.startContent}>
        <p className={styles.eyebrow}>LUCAS DIAZ CANO PRESENTS / PLAYABLE PROTOTYPE 001</p>
        <h1>DISTRITO<span>{spanish ? 'Un lugar para' : 'A place to'}<br />{spanish ? 'descubrir.' : 'discover.'}</span></h1>
        <p className={styles.intro}>{spanish ? 'Mi trayectoria, convertida en un museo. Entrá por Globant y recorré las salas de BBVA, Johnson & Johnson, Banco Hipotecario y mi formación.' : 'My career, turned into a museum. Enter through Globant and explore the BBVA, Johnson & Johnson, Banco Hipotecario and education rooms.'}</p>
        <button className={styles.primary} disabled={!ready} onClick={() => { setStarted(true); setPaused(false); }}>{!ready ? (spanish ? 'Preparando distrito…' : 'Preparing district…') : paused ? (spanish ? 'Continuar explorando' : 'Continue exploring') : (spanish ? 'Entrar al distrito' : 'Enter the district')} <span>↗</span></button>
        <div className={styles.settings}><label>{spanish ? 'Calidad' : 'Quality'} <select value={quality} disabled={diagnostics.enabled} onChange={(event) => setQuality(event.target.value as 'low' | 'high')}><option value="high">{spanish ? 'Alta · sombras' : 'High · shadows'}</option><option value="low">{spanish ? 'Ligera · sin sombras' : 'Light · no shadows'}</option></select></label>
          {started && <button onClick={() => { input.current.reset += 1; input.current.command = null; input.current.yaw = 0; setPaused(false); }}>{spanish ? 'Volver a la plaza' : 'Return to plaza'}</button>}</div>
        <Link className={styles.skip} href={`/${locale}/projects`}>{spanish ? 'Ir directo a los proyectos' : 'Go straight to projects'} →</Link>
        <p className={styles.prototype}>{spanish ? 'Primera zona jugable · personaje y arquitectura en desarrollo' : 'First playable district · character and architecture in development'}</p>
      </div>
      <div className={styles.startCoordinates}>BUENOS AIRES<br /><span>THE NEXT CHAPTER / EST. 2026</span></div>
    </section>}

    {diagnostics.enabled && <DiagnosticsPanel input={input} identity={identity} assetsReadyAt={assetsReadyAt} running={benchmarkRunning} report={benchmarkReport} onBegin={beginBenchmark} />}
    <dialog ref={dialog} className={`${styles.dialog} ${view === 'isometric' ? styles.storyWindow : ''}`} style={selectedBrand ? companyStyle(selectedBrand) : undefined} aria-labelledby="city-project-title" onCancel={() => setSelected(null)} onClose={() => { setSelected(null); interaction.current?.focus(); }}>
      {room && selectedBrand && <><button className={styles.close} onClick={() => setSelected(null)} aria-label={spanish ? 'Cerrar descripción' : 'Close description'}>×</button>
        <div className={styles.companyBanner}><span>{room.label}</span><small>{room.sector}</small></div>
        <p className={styles.eyebrow}>{spanish ? 'MI TRAYECTORIA / SALA' : 'MY JOURNEY / ROOM'} {String((selected ?? 0) + 1).padStart(2, '0')}</p>
        <span className={styles.sector}>{room.role}</span><h2 id="city-project-title">{room.title}</h2><p>{room.description}</p>
        <div className={styles.roomSections}>{room.sections.map((section) => <section key={section.title}><h3>{section.title}</h3><p>{section.body}</p></section>)}</div>
        <ul>{room.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <Link href={`/${locale}/profile`}>{spanish ? 'Ver mi perfil' : 'View my profile'} ↗</Link>
      </>}

    </dialog>
  </main>;
}
