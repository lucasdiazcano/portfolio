import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher ignora las rutas internas de Next.js y archivos estáticos
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
