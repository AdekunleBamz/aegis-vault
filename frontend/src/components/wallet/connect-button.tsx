import Button from '../ui/button'
import WalletBadge from './wallet-badge'
import { useWallet } from '../../hooks/use-wallet'

export default function ConnectButton() {
  const { isSignedIn, address, connect, disconnect } = useWallet()

  if (!isSignedIn) {
    return <Button onClick={connect}>Connect</Button>
  }

  return (
    <div className="flex items-center gap-3">
      <WalletBadge address={address} />
      <Button variant="secondary" onClick={disconnect}>Disconnect</Button>
    </div>
  )
}
