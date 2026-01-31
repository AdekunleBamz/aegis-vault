import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StakingFlow } from '@/components/flows/staking-flow';
import { RewardsCalculator } from '@/components/widgets/rewards-calculator';

export default function StakePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header with gradient */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">Live Staking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Stake STX
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Stake your STX tokens and earn AGS rewards. Higher tiers unlock better APY rates.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Value Locked', value: '$2.4M', change: '+12.5%' },
              { label: 'Current APY', value: '8.5%', change: '+0.5%' },
              { label: 'Total Stakers', value: '1,247', change: '+24' },
              { label: 'Rewards Distributed', value: '45M AGS', change: '+1.2M' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-green-400 text-xs mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <StakingFlow />
              
              {/* Quick Tips */}
              <div className="mt-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-gray-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Staking Tips
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Stake for longer periods to earn bonus rewards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Higher tiers provide better APY multipliers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Claim rewards regularly to compound your earnings
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <RewardsCalculator />
              
              {/* Tier Benefits */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Tier Benefits</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Bronze', requirement: '0+ STX', apy: '5%', color: 'text-amber-600' },
                    { name: 'Silver', requirement: '1,000+ STX', apy: '6.5%', color: 'text-gray-400' },
                    { name: 'Gold', requirement: '10,000+ STX', apy: '8%', color: 'text-yellow-500' },
                    { name: 'Platinum', requirement: '50,000+ STX', apy: '10%', color: 'text-blue-400' },
                  ].map((tier, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${tier.color}`}>{tier.name}</span>
                        <span className="text-gray-500 text-sm">{tier.requirement}</span>
                      </div>
                      <span className="text-green-400 font-semibold">{tier.apy} APY</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
