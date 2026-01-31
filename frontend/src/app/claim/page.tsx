import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ClaimFlow } from '@/components/flows/claim-flow';

export default function ClaimPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-xl">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-2xl mb-4 relative">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Claim Rewards
            </h1>
            <p className="text-gray-400">
              Collect your earned AGS tokens to your wallet
            </p>
          </div>

          {/* Rewards Summary Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Available Rewards</span>
              <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                Claimable Now
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">0.00</span>
              <span className="text-purple-400 font-medium mb-1">AGS</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">≈ $0.00 USD</p>
          </div>

          <ClaimFlow />

          {/* About Rewards */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About AGS Rewards
            </h3>
            <div className="grid gap-3">
              {[
                { icon: '📈', title: 'Tier-Based Earnings', desc: 'Higher tiers earn more rewards per block' },
                { icon: '⏱️', title: 'Real-Time Accrual', desc: 'Rewards accumulate continuously as you stake' },
                { icon: '💰', title: 'No Minimums', desc: 'Claim any amount at any time, no restrictions' },
                { icon: '🔄', title: 'Compound Option', desc: 'Restake rewards to boost your earnings' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards History Link */}
          <div className="mt-4 text-center">
            <a href="/history" className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1 transition-colors">
              View Rewards History
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
