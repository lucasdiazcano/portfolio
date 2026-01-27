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
    <div className="min-h-screen bg-black text-white relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('projects.title')}</h1>
          <p className="text-xl text-gray-400">
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
              className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-10 md:p-12 hover:border-white/20 transition-colors shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h2>
                  <p className="text-gray-400 mb-3 text-lg md:text-xl">
                    {project.sector} • {project.client}
                  </p>
                  <p className="text-gray-500 text-base md:text-lg mb-2">
                    📍 {project.location}
                  </p>
                  <p className="text-gray-500 text-base md:text-lg italic mb-3">
                    {project.context}
                  </p>
                  {project.englishCommunication && (
                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-5 py-2.5 text-white text-base md:text-lg font-bold rounded-full border-2 border-blue-400 shadow-lg">
                        🇺🇸 {t('projects.englishCommunication')}
                      </span>
                      <span className="text-gray-400 text-base md:text-lg">• {t('projects.allTeamEnglish')}</span>
                    </div>
                  )}
                </div>
                <span className="px-4 py-2 bg-green-600 text-white text-sm md:text-base font-medium rounded mt-3 md:mt-0">
                  GLOBANT
                </span>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech: string, techIndex: number) => (
                  <span
                    key={techIndex}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300"
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
