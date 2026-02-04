'use client';

import dynamic from 'next/dynamic';

// Importación dinámica para evitar SSR
const Scene3DFullscreen = dynamic(() => import('../components/Scene3DFullscreen'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-green-500 font-mono text-xl animate-pulse">
        INITIALIZING PIP-BOY 3000...
      </div>
    </div>
  )
});

export default function PipBoyPage() {
  return <Scene3DFullscreen />;
}
