import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.headlineEn}`,
  description: SITE_CONFIG.descriptionVi,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
