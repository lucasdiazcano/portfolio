export interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  tags: string[];
  highlightBadge?: {
    text: string;
    variant?: 'default' | 'highlight';
  };
  specialBadge?: string;
}

export const projects: Project[] = [
  {
    id: 'bbva',
    title: 'Banco BBVA - Mobile & Web Renewal',
    location: '📍 Argentina',
    description: 'Led the architectural renovation of BBVA\'s mobile and web platforms using **TypeScript** and Micro-frontends (Open Cells). Engineered a high-performance modular system to modernize legacy flows, significantly improving developer velocity and cross-platform consistency.',
    tags: ['React', 'Open Cells', 'Fintech']
  },
  {
    id: 'jnj',
    title: 'Johnson & Johnson - Data Visualization',
    location: '📍 USA • International team (USA & Europe)',
    description: 'Developed a mission-critical analytics platform for global teams (USA & Europe). Built complex, real-time dashboards with **Recharts** and **Redux**, ensuring 100% data integrity through strict **TypeScript** typing and **Unit Testing (Jest)**.',
    tags: ['React', 'Redux', 'Recharts'],
    highlightBadge: {
      text: '🇺🇸 ENGLISH COMMUNICATION',
      variant: 'highlight'
    }
  },
  {
    id: 'banco-hipotecario',
    title: 'Banco Hipotecario - Core Banking',
    location: '📍 Argentina',
    description: 'Architected and launched a comprehensive core banking platform from scratch. Established rigorous **Code Review protocols** and technical documentation that reduced development lead times by 30%. Focused on **Accessibility (WCAG)** and reusable component patterns.',
    tags: ['React', 'Redux', 'SCSS']
  }
];
