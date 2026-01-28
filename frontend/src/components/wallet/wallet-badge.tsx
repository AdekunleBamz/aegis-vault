type WalletBadgeProps = {
  address?: string
}

export default function WalletBadge({ address }: WalletBadgeProps) {
  if (!address) return null
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`
  return <span className="rounded-full border border-base-700 px-3 py-1 text-xs text-base-200">{short}</span>
}
