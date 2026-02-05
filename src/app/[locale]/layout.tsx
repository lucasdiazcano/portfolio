import type { Metadata } from "next";
import localFont from "next/font/local"; // Cambiamos google por local
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import "../globals.css";
import GradualBlur from "@/components/GradualBlur";
import NavigationProgress from "./components/NavigationProgress";
import ThemeSwitcher from "./components/ThemeSwitcher";

// Configuración de Mulish Local
// Asumiendo que pusiste los archivos en public/fonts/mulish/
const mulish = localFont({
  src: [
    {
      path: '../../public/fonts/mulish-v18-cyrillic_latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/mulish-v18-cyrillic_latin-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/mulish-v18-cyrillic_latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/mulish-v18-cyrillic_latin-800.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "Lucas Diaz Cano - Senior Frontend Engineer",
  description: "Senior Frontend Engineer with 5+ years of experience specializing in the React ecosystem. Background in Cognitive Psychology, providing a unique edge in building intuitive UX/UI.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${mulish.variable} font-sans antialiased`} 
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeSwitcher />
          <NavigationProgress />
          {children}
          <GradualBlur 
            target="page"
            position="bottom"
            height="12rem"
            strength={20}
            divCount={1}
            curve="ease-out"
            opacity={1}
            zIndex={9999}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}