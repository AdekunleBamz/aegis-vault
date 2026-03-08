import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aegis Vault - STX Staking Protocol',
  description: 'Stake STX tokens and earn AGS rewards on the Stacks blockchain',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/favicon-32x32.png',
    apple: '/images/favicon-180x180.png',
  },
  other: {
    'talentapp:project_verification': '36aec8876745b73a508e63b8c62b758a9b3cbf52bf469e2db41d5c2a1a65294eab81b60bd435d913b20894a9a09e86672a56efc5f7ad3da8df4f45caf9523e2e',
  },
};

import { AppProviders } from '@/components/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
