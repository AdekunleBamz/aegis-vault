'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from '@/context/wallet-context';
import { ToastProvider } from './toast-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <WalletProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </WalletProvider>
        </ThemeProvider>
    );
}
