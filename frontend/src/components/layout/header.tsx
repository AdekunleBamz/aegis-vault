import Link from 'next/link'
import ConnectButton from '../wallet/connect-button'

export default function Header() {
  return (
    <header className="border-b border-base-700 bg-base-900/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent-500" />
          <span className="text-lg font-semibold text-white">Aegis Vault</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-base-200 md:flex">
          <Link href="#stake">Stake</Link>
          <Link href="#rewards">Rewards</Link>
          <Link href="#treasury">Treasury</Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  )
}
