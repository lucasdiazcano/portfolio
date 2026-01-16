import Navigation from './components/Navigation';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-700">
              <Image
                src="/profile.png"
                alt="Lucas Diaz Cano"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Lucas Diaz Cano
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Senior Frontend Engineer building scalable web applications and 
            leading high-performance teams in the Fintech and Healthcare sectors.
          </p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* BBVA Project */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 md:p-10 hover:border-gray-700 transition-colors">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Banco BBVA - Mobile & Web Renewal</h3>
            <p className="text-gray-500 text-sm md:text-base mb-3">📍 Argentina</p>
            <p className="text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
              Renovated frontend architecture for mobile/web apps using Open Cells. 
              Modernized legacy flows into scalable, modular architecture.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                React
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                Open Cells
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                Fintech
              </span>
            </div>
          </div>

          {/* J&J Project */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 md:p-10 hover:border-gray-700 transition-colors">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Johnson & Johnson - Data Visualization</h3>
            <p className="text-gray-500 text-sm md:text-base mb-3">📍 USA • International team (USA & Europe)</p>
            <div className="mb-4">
              <span className="px-4 py-2 text-white text-sm md:text-base font-bold rounded-full border-2 border-blue-400">
                🇺🇸 ENGLISH COMMUNICATION
              </span>
            </div>
            <p className="text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
              High-performance statistical data app for analytics with React, Redux, and SCSS. 
              Complex dashboards with Recharts for real-time insights.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                React
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                Redux
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                Recharts
              </span>
            </div>
          </div>

          {/* Banco Hipotecario Project */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 md:p-10 hover:border-gray-700 transition-colors">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Banco Hipotecario - Core Banking</h3>
            <p className="text-gray-500 text-sm md:text-base mb-3">📍 Argentina</p>
            <p className="text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
              Developed a scalable banking application from scratch. 
              Established technical documentation and Code Review protocols.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                React
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                Redux
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm md:text-base text-gray-300">
                SCSS
              </span>
            </div>
          </div>

          {/* Education Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 md:p-10 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl md:text-3xl font-bold">Coding Bootcamp</h3>
              <span className="px-3 py-1.5 bg-red-600 text-white text-sm md:text-base font-bold rounded">
                P5
              </span>
            </div>
            <p className="text-gray-400 mb-2 text-base md:text-lg">Plataforma 5</p>
            <p className="text-sm md:text-base text-gray-500 mb-4">January - April 2021</p>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xl">🧠</span>
              <span className="text-base md:text-lg">Focus: React, JavaScript, Node, SASS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
