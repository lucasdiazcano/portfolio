'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const handleViewWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const navItems = [
    { href: '/', label: 'View Work', icon: '↓', isPrimary: true, onClick: handleViewWork },
    { href: '/projects', label: t('projects'), icon: '🖥️', isPrimary: false },
    { href: '/profile', label: t('profile'), icon: '👤', isPrimary: false },
    { href: '/blog', label: t('blog'), icon: '📝', isPrimary: false },
    { href: '/pipboy', label: 'PIP-BOY', icon: '🎮', isPrimary: false },
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-12">
      <LanguageSwitcher />
      {navItems.map((item) => {
        // Para '/' solo activar si estamos exactamente en '/', para otros usar startsWith
        const isActive = item.href === '/' 
          ? pathname === '/' || pathname === ''
          : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={item.onClick}
            className={`
              px-6 py-3 rounded-lg border-2 font-medium transition-all
              ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-card/20'
              }
            `}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-lg border-2 border-primary bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
      >
        <span className="mr-2">🐙</span>
        GitHub
      </a>
    </nav>
  );
}

