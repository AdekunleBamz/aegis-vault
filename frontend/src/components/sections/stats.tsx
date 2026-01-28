import Card from '../ui/card'

const stats = [
  { label: 'Total Value Locked', value: '$12.4M' },
  { label: 'Active Stakers', value: '4,210' },
  { label: 'Rewards Distributed', value: '8.7M AGS' }
]

export default function Stats() {
  return (
    <section className="section">
      <div className="container grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-base-200">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
