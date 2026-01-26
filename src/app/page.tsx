'use client';

import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import Dither from './components/Dither';
import Image from 'next/image';
import { projects } from './data/projects';
import { useContent } from './data/content';
import { ditherConfig } from './config/dither';

export default function Home() {
  const content = useContent('en'); // Cambia a 'es' para español

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      {/* Contenido principal con z-index superior y efecto glass */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Container con efecto glassmorphism */}
        <div className="backdrop-blur-md bg-black/40 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-700">
                <Image
                  src="/profile.png"
                  alt={content.hero.altImage}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {content.hero.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              {content.hero.title}
            </p>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Featured Projects Grid */}
          <div id="projects" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
            
            {/* Education Card - caso especial */}
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-8 md:p-10 hover:border-white/20 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl md:text-3xl font-bold">{content.education.title}</h3>
                <span className="px-3 py-1.5 bg-red-600 text-white text-sm md:text-base font-bold rounded">
                  P5
                </span>
              </div>
              <p className="text-gray-400 mb-2 text-base md:text-lg">{content.education.institution}</p>
              <p className="text-sm md:text-base text-gray-500 mb-4">{content.education.period}</p>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xl">🧠</span>
                <span className="text-base md:text-lg">{content.education.focus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
