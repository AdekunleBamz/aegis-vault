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
import { STACKS_MAINNET, STACKS_TESTNET, StacksNetwork } from '@stacks/network';
import { USER_SESSION_INTERVAL } from '@/lib/constants';

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
const defaultNetwork = STACKS_MAINNET;

interface WalletProviderProps {
  children: ReactNode;
}

/**
 * WalletProvider Component
 * 
 * Manages the Stacks wallet connection state for the entire application.
 * Handles user sessions, connection requests, and network configuration.
 * 
 * @param {WalletProviderProps} props - The provider props.
 * @returns {JSX.Element} The provider component.
 */
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
    const interval = setInterval(checkUserSession, USER_SESSION_INTERVAL);
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

/**
 * Custom hook to access wallet state and actions.
 * 
 * Must be used within a WalletProvider.
 * 
 * @returns {WalletContextValue} The current wallet context value.
 * @throws {Error} If used outside of WalletProvider.
 */
export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
