import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="bg-[#0B0F14] text-[#F8FAFC] antialiased selection:bg-[#F59E0B] selection:text-black">
        {children}
      </body>
    </html>
  );
}
