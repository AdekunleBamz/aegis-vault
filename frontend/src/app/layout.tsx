import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { AppProviders } from '@/components/providers';
import { NetworkWarning } from '@/components/ui/network-warning';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aegis Vault - STX Staking Protocol',
  description: 'Stake STX tokens and earn AGS rewards on the Stacks blockchain',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <AppProviders>
          <NetworkWarning />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
