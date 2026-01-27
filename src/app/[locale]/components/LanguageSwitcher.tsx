'use client';

import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
          locale === 'en'
            ? 'bg-white text-black'
            : 'bg-transparent text-gray-400 border border-gray-700 hover:border-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
          locale === 'es'
            ? 'bg-white text-black'
            : 'bg-transparent text-gray-400 border border-gray-700 hover:border-gray-600'
        }`}
      >
        ES
      </button>
    </div>
  );
}
