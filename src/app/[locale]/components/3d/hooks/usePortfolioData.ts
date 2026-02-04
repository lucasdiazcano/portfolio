'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePipBoyStore, type PortfolioProject, type PortfolioSkill, type PipBoyStore } from '../store';

/**
 * Skills del portfolio con niveles (estilo Fallout S.P.E.C.I.A.L.)
 * Los niveles van de 0-100 para renderizar barras de progreso
 */
const PORTFOLIO_SKILLS: PortfolioSkill[] = [
  // Core / Technical
  { name: 'React', level: 95, category: 'core' },
  { name: 'TypeScript', level: 90, category: 'core' },
  { name: 'Next.js', level: 85, category: 'core' },
  { name: 'JavaScript', level: 95, category: 'core' },
  { name: 'CSS/SASS', level: 85, category: 'core' },
  { name: 'Three.js', level: 40, category: 'core' },
  
  // Tools
  { name: 'Git', level: 90, category: 'tools' },
  { name: 'Jest/Testing', level: 80, category: 'tools' },
  { name: 'Cypress', level: 75, category: 'tools' },
  { name: 'Redux', level: 85, category: 'tools' },
  
  // Soft / Professional
  { name: 'Team Leadership', level: 85, category: 'soft' },
  { name: 'Code Review', level: 90, category: 'soft' },
  { name: 'Agile/SCRUM', level: 85, category: 'soft' },
  { name: 'Documentation', level: 80, category: 'soft' },
];

/**
 * Hook que carga los datos del portfolio desde las traducciones
 * y los inyecta en el store de Zustand
 * 
 * @example
 * // En el componente raíz del PipBoy
 * usePortfolioData();
 */
export function usePortfolioData() {
  const t = useTranslations();
  const setProjects = usePipBoyStore((state: PipBoyStore) => state.setProjects);
  const setSkills = usePipBoyStore((state: PipBoyStore) => state.setSkills);
  
  useEffect(() => {
    // Cargar proyectos desde traducciones
    try {
      const projectsData = t.raw('projects.list') as any[];
      
      const projects: PortfolioProject[] = projectsData.map((project, index) => ({
        id: `project-${index}-${project.title.toLowerCase().replace(/\s+/g, '-')}`,
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        sector: project.sector || '',
        client: project.client || '',
        location: project.location || '',
        context: project.context,
        englishCommunication: project.englishCommunication || false,
      }));
      
      setProjects(projects);
    } catch (error) {
      console.warn('[usePortfolioData] Error loading projects:', error);
    }
    
    // Cargar skills (estáticas por ahora)
    setSkills(PORTFOLIO_SKILLS);
    
  }, [t, setProjects, setSkills]);
}

/**
 * Hook para obtener los datos del perfil desde traducciones
 * Retorna datos estructurados para el tab STATS
 */
export function useProfileData() {
  const t = useTranslations();
  
  return {
    name: t('hero.name'),
    title: t('hero.title'),
    about: t('profile.about.description'),
    employment: {
      position: t('profile.employment.position'),
      company: t('profile.employment.company'),
      period: t('profile.employment.period'),
      description: t('profile.employment.description'),
    },
    education: {
      title: t('education.title'),
      institution: t('education.institution'),
      period: t('education.period'),
      focus: t('education.focus'),
    },
  };
}

/**
 * Hook para obtener los datos del tab DATA (Blog, Educación, Contacto)
 */
export function useDataTabContent() {
  const t = useTranslations();
  
  return {
    education: {
      title: t('education.title'),
      institution: t('education.institution'),
      period: t('education.period'),
      focus: t('education.focus'),
    },
    blog: {
      title: t('blog.title'),
      description: t('blog.description'),
    },
    contact: {
      title: t('profile.contact.title'),
    },
    languages: {
      title: t('profile.languages.title'),
      spanish: { name: t('profile.languages.spanish'), level: t('profile.languages.native') },
      english: { name: t('profile.languages.english'), level: t('profile.languages.advanced') },
    },
  };
}
