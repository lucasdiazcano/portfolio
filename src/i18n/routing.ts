import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de todos los idiomas soportados
  locales: ['en', 'es'],

  // Idioma por defecto
  defaultLocale: 'en'
});

// Exportar funciones de navegación con tipos
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
