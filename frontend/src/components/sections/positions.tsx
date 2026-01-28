import Card from '../ui/card'

const positions = [
  { id: 1, amount: '120 STX', lock: '7 days', status: 'Active' },
  { id: 2, amount: '80 STX', lock: '30 days', status: 'Unlocking' }
]

export default function Positions() {
  return (
    <section className="section">
      <div className="container">
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-white">Your Positions</h3>
          <div className="mt-6 space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="flex items-center justify-between rounded-xl border border-base-700 bg-base-900 px-4 py-3">
                <div>
                  <p className="text-sm text-base-200">{position.amount}</p>
                  <p className="text-xs text-base-200">{position.lock}</p>
                </div>
                <span className="text-xs text-accent-300">{position.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
