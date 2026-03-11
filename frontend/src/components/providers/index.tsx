'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from '@/context/wallet-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <WalletProvider>
                {children}
            </WalletProvider>
        </ThemeProvider>
    );
}
