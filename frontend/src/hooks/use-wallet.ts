import { useEffect, useState } from 'react'
import { showConnect } from '@stacks/connect'
import { userSession } from '../lib/stacks'

export type WalletState = {
  isSignedIn: boolean
  address?: string
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({ isSignedIn: false })

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const profile = userSession.loadUserData()
      const address = profile.profile?.stxAddress?.mainnet
      setState({ isSignedIn: true, address })
    }
  }, [])

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'Aegis Vault',
        icon: 'https://app.aegis.finance/icon.png'
      },
      onFinish: () => {
        const profile = userSession.loadUserData()
        const address = profile.profile?.stxAddress?.mainnet
        setState({ isSignedIn: true, address })
      },
      userSession
    })
  }

  const disconnect = () => {
    userSession.signUserOut()
    setState({ isSignedIn: false })
  }

  return { ...state, connect, disconnect }
}
