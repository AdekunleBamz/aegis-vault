import Button from '../ui/button'
import Card from '../ui/card'

export default function Hero() {
  return (
    <section className="section">
      <div className="container">
        <Card className="p-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-300">Aegis Vault</p>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Stake STX. Earn AGS. Control your vault.
            </h1>
            <p className="max-w-2xl text-base-200">
              A secure staking protocol with flexible lock periods, transparent rewards, and
              emergency exits when you need them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>Connect Wallet</Button>
              <Button variant="secondary">View Positions</Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
