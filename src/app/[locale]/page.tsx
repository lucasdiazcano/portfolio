'use client';

import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import Dither from './components/Dither';
import Image from 'next/image';
import { ditherConfig } from './config/dither';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  
  // Obtener proyectos desde las traducciones
  const projectsData = t.raw('projects.list');
  
  // Mapear los proyectos al formato esperado por ProjectCard
  const projects = projectsData.map((project: any) => ({
    id: project.title.toLowerCase().replace(/\s+/g, '-'),
    title: project.title,
    location: `📍 ${project.location}${project.context ? ` • ${project.context}` : ''}`,
    description: project.description,
    tags: project.technologies.slice(0, 3),
    highlightBadge: project.englishCommunication ? {
      text: `🇺🇸 ${t('projects.englishCommunication')}`,
      variant: 'highlight' as const
    } : undefined
  }));

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      {/* Contenido principal con z-index superior y efecto glass */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Container con efecto glassmorphism */}
        <div className="backdrop-blur-md bg-card/40 rounded-3xl p-8 md:p-12 border border-border shadow-2xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-border">
                <Image
                  src="/profile.png"
                  alt={t('hero.altImage')}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {t('hero.name')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('hero.title')}
            </p>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Featured Projects Grid */}
          <div id="projects" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {projects.slice(0, 3).map((project: any) => (
              <ProjectCard key={project.id} {...project} />
            ))}
            
            {/* Education Card - caso especial */}
            <div className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-8 md:p-10 hover:border-primary/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl md:text-3xl font-bold">{t('education.title')}</h3>
                <span className="px-3 py-1.5 bg-red-600 text-white text-sm md:text-base font-bold rounded">
                  P5
                </span>
              </div>
              <p className="text-muted-foreground mb-2 text-base md:text-lg">{t('education.institution')}</p>
              <p className="text-sm md:text-base text-muted-foreground/80 mb-4">{t('education.period')}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xl">🧠</span>
                <span className="text-base md:text-lg">{t('education.focus')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
