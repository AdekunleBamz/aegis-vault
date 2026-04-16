import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { AppProviders } from '@/components/providers';
import { NetworkWarning } from '@/components/ui/network-warning';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aegis Vault | Premium Bitcoin DeFi Staking & Yield Optimization',
  description: 'The premier yield optimization protocol on Stacks. Secure, non-custodial Bitcoin DeFi with automated strategies, advanced governance, and institutional-grade analytics.',
  keywords: ['Stacks', 'Bitcoin', 'DeFi', 'Staking', 'Yield Farming', 'Crypto', 'Aegis Vault', 'Smart Contracts'],
  authors: [{ name: 'Aegis Protocol Team' }],
  themeColor: '#0A0A0B',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/favicon-32x32.png',
    apple: '/images/favicon-180x180.png',
  },
  openGraph: {
    title: 'Aegis Vault - STX Staking Protocol',
    description: 'Stake STX tokens and earn AGS rewards on the Stacks blockchain',
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: 'Aegis Vault Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegis Vault - STX Staking Protocol',
    description: 'Stake STX tokens and earn AGS rewards on the Stacks blockchain',
    images: ['/images/logo.png'],
  },
  other: {
    'talentapp:project_verification': '36aec8876745b73a508e63b8c62b758a9b3cbf52bf469e2db41d5c2a1a65294eab81b60bd435d913b20894a9a09e86672a56efc5f7ad3da8df4f45caf9523e2e',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning prefix="og: http://ogp.me/ns#">
      <body className={outfit.className}>
        <AppProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-background"
          >
            Skip to content
          </a>
          <Header />
          <NetworkWarning />
          <main id="main-content" className="flex-1 pt-20" aria-label="Main content">{children}</main>
          <Footer />
        </AppProviders>
        <PerformanceMonitor />
      </body>
    </html>
  );
}
