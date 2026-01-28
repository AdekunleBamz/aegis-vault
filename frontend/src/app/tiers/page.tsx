import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TIERS } from '@/lib/constants';
import { Card } from '@/components/ui/card';

export default function TiersPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-2">Staking Tiers</h1>
          <p className="text-gray-400 text-center mb-12">
            Higher tiers unlock better rewards
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIERS.map((tier, index) => (
              <Card 
                key={tier.name}
                className="relative overflow-hidden"
                style={{ borderColor: `${tier.color}40` }}
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-10 -mt-10"
                  style={{ backgroundColor: tier.color }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: tier.color }}>
                        {tier.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {tier.minStake.toLocaleString()}+ STX
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum Stake</span>
                      <span className="text-white font-medium">
                        {tier.minStake.toLocaleString()} STX
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Multiplier</span>
                      <span className="text-white font-medium">{tier.multiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Effective APY</span>
                      <span className="text-green-400 font-medium">
                        {(12 * tier.multiplier).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority reward distribution
                    </div>
                    {index >= 2 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Governance voting rights
                      </div>
                    )}
                    {index === 3 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Exclusive airdrops
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/stake"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Start Staking Now
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
