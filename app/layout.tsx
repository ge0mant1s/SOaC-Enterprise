export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import GoogleAnalytics from './components/google-analytics';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'SOaC Enterprise | Security Operations as Code',
  description: 'Distributed Intelligence Architecture for modern security operations. Detection, AI governance, automated response, and edge enforcement.',
  openGraph: {
    title: 'SOaC Enterprise | Security Operations as Code',
    description: 'Distributed Intelligence Architecture for modern security operations.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
