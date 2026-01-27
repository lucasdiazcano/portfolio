// Archivo para contenido que puede ser traducido fácilmente
export const content = {
  es: {
    hero: {
      name: 'Lucas Diaz Cano',
      title: 'Senior Frontend Engineer building scalable web applications and leading high-performance teams in the Fintech and Healthcare sectors.',
      altImage: 'Lucas Diaz Cano'
    },
    education: {
      title: 'Coding Bootcamp',
      institution: 'Plataforma 5',
      period: 'January - April 2021',
      focus: 'Focus: React, JavaScript, Node, SASS'
    }
  },
  en: {
    hero: {
      name: 'Lucas Diaz Cano',
      title: 'Senior Frontend Engineer building scalable web applications and leading high-performance teams in the Fintech and Healthcare sectors.',
      altImage: 'Lucas Diaz Cano'
    },
    education: {
      title: 'Coding Bootcamp',
      institution: 'Plataforma 5',
      period: 'January - April 2021',
      focus: 'Focus: React, JavaScript, Node, SASS'
    }
  }
};

// Hook para obtener el idioma actual (puedes expandir esto con contexto de React)
export const useContent = (lang: 'es' | 'en' = 'en') => {
  return content[lang];
};
