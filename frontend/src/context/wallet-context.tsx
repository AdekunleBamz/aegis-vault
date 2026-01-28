'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { NETWORK_ID, APP_NAME } from '@/lib/constants';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      return userData.profile?.stxAddress?.[NETWORK_ID] || null;
    }
    return null;
  });

  const connect = () => {
    setIsConnecting(true);
    showConnect({
      appDetails: {
        name: APP_NAME,
        icon: '/aegis-icon.png',
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile?.stxAddress?.[NETWORK_ID] || null);
        setIsConnecting(false);
      },
      onCancel: () => {
        setIsConnecting(false);
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        userSession,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
}
