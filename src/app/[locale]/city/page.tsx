'use client';

import dynamic from 'next/dynamic';

const CityGame = dynamic(() => import('@/features/city/CityGame'), {
  ssr: false,
  loading: () => <div style={{ background: '#11191c', color: '#eae4d5', minHeight: '100dvh', display: 'grid', placeItems: 'center', fontFamily: 'monospace' }}>DISTRITO / LOADING WORLD…</div>,
});

/** Loads the city only when its dedicated route is visited. */
export default function CityPage() {
  return <CityGame />;
}
