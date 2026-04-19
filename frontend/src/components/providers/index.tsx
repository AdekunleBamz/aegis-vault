'use client';

/**
 * @file Application providers wrapper component
 *
 * Combines all context providers needed for the Aegis Vault application:
 * theme, wallet connection, and toast notifications.
 */

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from '@/context/wallet-context';
import { ToastProvider } from './toast-provider';

/**
 * AppProviders wraps the application with all necessary context providers.
 * Order matters: ThemeProvider > WalletProvider > ToastProvider
 *
 * @param children - The child components to wrap
 */
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
