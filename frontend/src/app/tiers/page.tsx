import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TIERS } from '@/lib/constants';
import { Card } from '@/components/ui/card';

export default function TiersPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-amber-400 text-sm font-medium">Tier System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-amber-100 to-purple-200 bg-clip-text text-transparent">
              Staking Tiers
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Unlock exclusive benefits and higher rewards by reaching higher tiers. 
              The more you stake, the more you earn.
            </p>
          </div>

          {/* Tier Comparison Table */}
          <div className="hidden md:block mb-12 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Tier</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Min. Stake</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Multiplier</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">APY</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Benefits</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((tier, index) => (
                  <tr key={tier.name} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                          style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-semibold" style={{ color: tier.color }}>{tier.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-white">{tier.minStake.toLocaleString()} STX</td>
                    <td className="py-4 px-4 text-center text-white">{tier.multiplier}x</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">{(12 * tier.multiplier).toFixed(0)}%</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {index >= 0 && <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Rewards</span>}
                        {index >= 2 && <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-400">Voting</span>}
                        {index >= 3 && <span className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-400">Airdrops</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tier Cards (Mobile + Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIERS.map((tier, index) => (
              <Card 
                key={tier.name}
                className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                style={{ borderColor: `${tier.color}40` }}
              >
                {/* Background Decoration */}
                <div 
                  className="absolute top-0 right-0 w-40 h-40 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity"
                  style={{ backgroundColor: tier.color }}
                />
                <div 
                  className="absolute bottom-0 left-0 w-24 h-24 opacity-5 rounded-full -ml-8 -mb-8"
                  style={{ backgroundColor: tier.color }}
                />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
                        style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: tier.color }}>
                          {tier.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {tier.minStake.toLocaleString()}+ STX required
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">{(12 * tier.multiplier).toFixed(0)}%</span>
                      <p className="text-gray-500 text-xs">APY</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Minimum Stake</p>
                      <p className="text-white font-semibold">{tier.minStake.toLocaleString()} STX</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Reward Multiplier</p>
                      <p className="text-white font-semibold">{tier.multiplier}x</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="border-t border-gray-700/50 pt-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Benefits</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Priority reward distribution</span>
                      </div>
                      {index >= 1 && (
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Reduced cooldown period</span>
                        </div>
                      )}
                      {index >= 2 && (
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Governance voting rights</span>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-amber-400">Exclusive airdrops & early access</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Level Up?</h2>
            <p className="text-gray-400 mb-6">Start staking today and climb the tier ladder</p>
            <a
              href="/stake"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
            >
              Start Staking Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
