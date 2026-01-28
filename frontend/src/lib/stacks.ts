import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { NETWORK } from './constants';

// Get network instance
export function getStacksNetwork() {
  return NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
}

// Get session options for connect
export function getSessionOptions() {
  return {
    appDetails: {
      name: 'Aegis Vault',
      icon: '/aegis-icon.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  };
}

// Check if user is signed in
export function isUserSignedIn(): boolean {
  return userSession.isUserSignedIn();
}

// Get user data
export function getUserData() {
  if (!userSession.isUserSignedIn()) {
    return null;
  }
  return userSession.loadUserData();
}

// Get user address
export function getUserAddress(): string | null {
  const userData = getUserData();
  if (!userData) return null;
  
  return NETWORK === 'mainnet'
    ? userData.profile?.stxAddress?.mainnet
    : userData.profile?.stxAddress?.testnet;
}

// Sign out user
export function signOut() {
  userSession.signUserOut();
}
