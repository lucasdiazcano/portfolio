'use client';

import Navigation from '../components/Navigation';
import Dither from '../components/Dither';
import { ditherConfig } from '../config/dither';
import { useTranslations } from 'next-intl';

export default function Projects() {
  const t = useTranslations();
  
  // Obtener proyectos desde las traducciones
  const projectsData = t.raw('projects.list');

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('projects.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('projects.description')}
          </p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Projects List */}
        <div className="space-y-10 md:space-y-12">
          {projectsData.map((project: any, index: number) => (
            <div
              key={index}
              className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-10 md:p-12 hover:border-primary/50 transition-colors shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h2>
                  <p className="text-muted-foreground mb-3 text-lg md:text-xl">
                    {project.sector} • {project.client}
                  </p>
                  <p className="text-muted-foreground/80 text-base md:text-lg mb-2">
                    📍 {project.location}
                  </p>
                  <p className="text-muted-foreground/80 text-base md:text-lg italic mb-3">
                    {project.context}
                  </p>
                  {project.englishCommunication && (
                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-5 py-2.5 text-foreground text-base md:text-lg font-bold rounded-full border-2 border-primary shadow-lg">
                        🇺🇸 {t('projects.englishCommunication')}
                      </span>
                      <span className="text-muted-foreground text-base md:text-lg">• {t('projects.allTeamEnglish')}</span>
                    </div>
                  )}
                </div>
                <span className="px-4 py-2 bg-primary text-primary-foreground text-sm md:text-base font-medium rounded mt-3 md:mt-0">
                  GLOBANT
                </span>
              </div>
              
              <p className="text-foreground mb-8 text-lg md:text-xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech: string, techIndex: number) => (
                  <span
                    key={techIndex}
                    className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
