'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface WalletContextValue extends WalletState {
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
  });

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setState({
        address: userData.profile.stxAddress.mainnet,
        isConnected: true,
        isConnecting: false,
      });
    }
  }, []);

  const connect = useCallback(() => {
    setState((prev) => ({ ...prev, isConnecting: true }));

    showConnect({
      appDetails: {
        name: 'Aegis Vault',
        icon: '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setState({
          address: userData.profile.stxAddress.mainnet,
          isConnected: true,
          isConnecting: false,
        });
      },
      onCancel: () => {
        setState((prev) => ({ ...prev, isConnecting: false }));
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
