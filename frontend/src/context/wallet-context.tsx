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
import { StacksMainnet, StacksTestnet, StacksNetwork } from '@stacks/network';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: StacksNetwork;
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Default to mainnet, but can be configured
const defaultNetwork = new StacksMainnet();

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    network: defaultNetwork,
    error: null,
  });

  useEffect(() => {
    const checkUserSession = () => {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const currentAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

        setState((prev) => {
          if (prev.address !== currentAddress) {
            return {
              ...prev,
              address: currentAddress,
              isConnected: true,
              isConnecting: false,
            };
          }
          return prev;
        });
      } else {
        setState((prev) => {
          if (prev.isConnected) {
            return {
              ...prev,
              address: null,
              isConnected: false,
              isConnecting: false,
            };
          }
          return prev;
        });
      }
    };

    checkUserSession();
    const interval = setInterval(checkUserSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(() => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    showConnect({
      appDetails: {
        name: 'Aegis Vault',
        icon: window.location.origin + '/images/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setState((prev) => ({
          ...prev,
          address: userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet,
          isConnected: true,
          isConnecting: false,
        }));
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
      network: defaultNetwork,
      error: null,
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
