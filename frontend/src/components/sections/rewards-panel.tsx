import Button from '../ui/button'
import Card from '../ui/card'

export default function RewardsPanel() {
  return (
    <section id="rewards" className="section">
      <div className="container">
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-white">Rewards</h3>
          <p className="mt-2 text-sm text-base-200">Track your earned AGS and claim available rewards.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-base-700 bg-base-900 p-4">
              <p className="text-xs uppercase text-base-200">Claimable</p>
              <p className="mt-2 text-2xl font-semibold text-white">1,245 AGS</p>
            </div>
            <div className="rounded-xl border border-base-700 bg-base-900 p-4">
              <p className="text-xs uppercase text-base-200">Total Earned</p>
              <p className="mt-2 text-2xl font-semibold text-white">6,980 AGS</p>
            </div>
            <div className="rounded-xl border border-base-700 bg-base-900 p-4">
              <p className="text-xs uppercase text-base-200">Next Payout</p>
              <p className="mt-2 text-2xl font-semibold text-white">12h</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Claim Rewards</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
