'use client';

import React from 'react';
import { WalletProvider } from '@/context/wallet-context';
import { SettingsProvider } from '@/context/settings-context';
import { ThemeProvider } from '@/context/theme-context';
import { NotificationProvider } from '@/context/notification-context';
import { ModalProvider } from '@/context/modal-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <WalletProvider>
                    <NotificationProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </NotificationProvider>
                </WalletProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
