import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GradualBlur from "@/components/GradualBlur";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
