'use client';

/**
 * @file Wallet connection context for Aegis Vault
 *
 * Provides wallet connection functionality using Stacks connect.
 * Manages user sessions, connection state, and network configuration.
 *
 * @author Aegis Vault Team
 * @see {@link https://github.com/hirosystems/connect}
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { connect as stacksConnect, disconnect as stacksDisconnect, isConnected as stacksIsConnected, getLocalStorage } from '@stacks/connect';
import { STACKS_MAINNET, StacksNetwork } from '@stacks/network';

/**
 * Internal state shape for wallet connection.
 */
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
  /** Alias for isConnected — true when a wallet is active */
  isWalletReady: boolean;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

// Default to mainnet, but can be configured
const defaultNetwork = STACKS_MAINNET;

// How often to poll the connection state for sign-out changes
const SESSION_POLL_INTERVAL_MS = 1000;

interface WalletProviderProps {
  children: ReactNode;
}

function getAddressFromStorage(): string | null {
  try {
    const data = getLocalStorage();
    return (data as { addresses?: { stx?: { address: string }[] } })?.addresses?.stx?.[0]?.address ?? null;
  } catch {
    return null;
  }
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
  // Prevent opening a second wallet picker if one is already in progress.
  const connectingRef = useRef(false);

  useEffect(() => {
    const checkSession = () => {
      const connected = stacksIsConnected();
      const address = connected ? getAddressFromStorage() : null;

      setState((prev) => {
        if (prev.isConnected !== connected || prev.address !== address) {
          return {
            ...prev,
            address,
            isConnected: connected,
            isConnecting: prev.isConnecting && !connected ? prev.isConnecting : false,
          };
        }
        return prev;
      });
    };

    checkSession();
    const interval = setInterval(checkSession, SESSION_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(() => {
    if (connectingRef.current) return;
    connectingRef.current = true;

    // `stacksConnect()` opens the `<connect-modal>` wallet-picker overlay and
    // returns a Promise that resolves only once the user has selected a wallet
    // AND the wallet extension has approved the request.
    //
    // We intentionally do NOT set isConnecting here so the Connect button
    // stays enabled and visible while the modal is open (the modal itself
    // provides all the loading UI). isConnecting is set to true only during
    // the brief extension-auth phase after the user picks a wallet, which
    // is handled by the .then() callback below.
    stacksConnect()
      .then(() => {
        connectingRef.current = false;
        const address = getAddressFromStorage();
        setState((prev) => ({
          ...prev,
          address,
          isConnected: true,
          isConnecting: false,
        }));
      })
      .catch(() => {
        connectingRef.current = false;
        // User cancelled the picker or the wallet rejected — nothing to do.
        setState((prev) => ({ ...prev, isConnecting: false }));
      });
  }, []);

  const disconnect = useCallback(() => {
    stacksDisconnect();
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      network: defaultNetwork,
      error: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, isWalletReady: state.isConnected }}>
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
