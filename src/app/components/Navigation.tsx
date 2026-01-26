'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

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
    { href: '/projects', label: 'Projects', icon: '🖥️', isPrimary: false },
    { href: '/profile', label: 'Profile', icon: '👤', isPrimary: false },
    { href: '/blog', label: 'Blog', icon: '📝', isPrimary: false },
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-12">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={item.onClick}
            className={`
              px-6 py-3 rounded-lg border-2 font-medium transition-all
              ${
                item.isPrimary
                  ? isActive
                    ? 'bg-white text-black border-white'
                    : 'bg-white text-black border-white hover:bg-gray-100'
                  : isActive
                  ? 'bg-gray-800 text-white border-gray-600'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-300'
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
        className="px-6 py-3 rounded-lg border-2 border-white bg-white text-black font-medium hover:bg-gray-100 transition-all"
      >
        <span className="mr-2">🐙</span>
        GitHub
      </a>
    </nav>
  );
}

