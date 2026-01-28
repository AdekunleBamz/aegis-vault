import Card from '../ui/card'

export default function TreasuryPanel() {
  return (
    <section id="treasury" className="section">
      <div className="container">
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-white">Treasury</h3>
          <p className="mt-2 text-sm text-base-200">Protocol fees and emergency penalties held in reserve.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-base-700 bg-base-900 p-4">
              <p className="text-xs uppercase text-base-200">Treasury Balance</p>
              <p className="mt-2 text-2xl font-semibold text-white">92.4 STX</p>
            </div>
            <div className="rounded-xl border border-base-700 bg-base-900 p-4">
              <p className="text-xs uppercase text-base-200">Penalty Pool</p>
              <p className="mt-2 text-2xl font-semibold text-white">14.2 STX</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
