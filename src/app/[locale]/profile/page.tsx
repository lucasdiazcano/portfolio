'use client';

import Navigation from '../components/Navigation';
import Dither from '../components/Dither';
import { ditherConfig } from '../config/dither';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Profile() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('profile.title')}</h1>
          <p className="text-xl text-foreground">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Navigation */}
        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10 md:space-y-12">
            {/* About Section */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('profile.about.title')}</h2>
              <p className="text-foreground leading-relaxed text-lg md:text-xl">
                {t('profile.about.description')}
              </p>
            </section>

            {/* Employment History */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('profile.employment.title')}</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl md:text-3xl font-semibold">{t('profile.employment.position')}</h3>
                    <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm md:text-base font-medium rounded">
                      {t('profile.employment.current')}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 text-lg md:text-xl">{t('profile.employment.company')} • {t('profile.employment.period')}</p>
                  <p className="text-foreground text-lg md:text-xl leading-relaxed">
                    {t('profile.employment.description')}
                  </p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('education.title')}</h2>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl md:text-3xl font-semibold">{t('education.title')}</h3>
                  <span className="px-3 py-1.5 bg-destructive text-destructive-foreground text-sm md:text-base font-bold rounded">
                    P5
                  </span>
                </div>
                <p className="text-muted-foreground mb-2 text-lg md:text-xl">{t('education.institution')}</p>
                <p className="text-base md:text-lg text-muted-foreground/80 mb-6">{t('education.period')}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                    React
                  </span>
                  <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                    JavaScript
                  </span>
                  <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                    Node
                  </span>
                  <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                    SASS
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:space-y-10">
            {/* Profile Photo */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-8 md:p-10 shadow-2xl">
              <div className="flex justify-center">
                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-border">
                  <Image
                    src="/profile.png"
                    alt={t('hero.altImage')}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('profile.contact.title')}</h2>
              <div className="space-y-4 text-base md:text-lg">
                <div className="flex items-center gap-3 text-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(+54 9) 3874474789</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:lucasdiazcanoup@gmail.com" className="hover:text-primary transition-colors">
                    lucasdiazcanoup@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Buenos Aires, Argentina</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('profile.skills.title')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-muted-foreground mb-3">{t('profile.skills.core')}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      JavaScript
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      React.js
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      Node.js
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      CSS/SASS
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      Redux
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-muted-foreground mb-3">{t('profile.skills.soft')}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      Agile/SCRUM
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      Technical Writing
                    </span>
                    <span className="px-4 py-2 bg-secondary border border-border rounded-full text-base md:text-lg text-secondary-foreground">
                      R&D
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
