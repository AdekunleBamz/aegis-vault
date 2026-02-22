import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aegis Vault | Institutional-Grade STX Staking Protocol',
  description: 'Experience the ultimate security layer for your Stacks assets. Aegis Vault provides non-custodial staking with premium security health monitoring and competitive AGS rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
