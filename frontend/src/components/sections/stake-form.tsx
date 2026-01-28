import Button from '../ui/button'
import Card from '../ui/card'

export default function StakeForm() {
  return (
    <section id="stake" className="section">
      <div className="container">
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-white">Stake STX</h3>
          <p className="mt-2 text-sm text-base-200">Choose a lock period and start earning AGS.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs uppercase text-base-200">Amount</span>
              <input
                className="w-full rounded-xl border border-base-700 bg-base-900 px-4 py-3 text-white"
                placeholder="0.0 STX"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-base-200">Lock Period</span>
              <select className="w-full rounded-xl border border-base-700 bg-base-900 px-4 py-3 text-white">
                <option>3 Days</option>
                <option>7 Days</option>
                <option>30 Days</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-base-200">Multiplier</span>
              <div className="rounded-xl border border-base-700 bg-base-900 px-4 py-3 text-white">1.25x</div>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Stake Now</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
