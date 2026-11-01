import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Archivo } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Digital Dark Spot | AI-Assisted Information Gap & Contradiction Detection',
  description: 'Unearth what is missing, contradictory, stale, and unverified in complex multi-source research before high-stakes decisions.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} ${archivo.variable} min-h-screen bg-[#05030A] text-[#F5F3FF] antialiased selection:bg-[#7C3AED] selection:text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
