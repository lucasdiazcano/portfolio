import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import "../globals.css";
import GradualBlur from "@/components/GradualBlur";
import NavigationProgress from "./components/NavigationProgress";
import ThemeSwitcher from "./components/ThemeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
