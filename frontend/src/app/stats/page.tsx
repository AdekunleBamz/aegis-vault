import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProtocolStats } from '@/components/widgets/protocol-stats';
import { RewardsCalculator } from '@/components/widgets/rewards-calculator';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-blue-400 text-sm font-medium">Analytics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Protocol Statistics
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real-time data from the Aegis Vault smart contracts on Stacks Mainnet
            </p>
          </div>

          {/* Live Stats Banner */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-400 font-medium">Live Data</span>
            </div>
            <span className="text-gray-400 text-sm">Updates every block (~10 min)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProtocolStats />
            <RewardsCalculator />
          </div>

          {/* Protocol Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-400 text-sm font-medium">Contract Version</h3>
                <svg className="w-5 h-5 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">v2.15</p>
              <p className="text-gray-400 text-sm mt-2">Split architecture • Latest stable</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-purple-400 text-sm font-medium">Network</h3>
                <svg className="w-5 h-5 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">Stacks Mainnet</p>
              <p className="text-gray-400 text-sm mt-2">Secured by Bitcoin • Production</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-green-400 text-sm font-medium">Token Standard</h3>
                <svg className="w-5 h-5 text-green-400 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">SIP-010</p>
              <p className="text-gray-400 text-sm mt-2">Fungible Token • Verified</p>
            </div>
          </div>

          {/* Contract Addresses */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Contract Addresses</h2>
              <a 
                href="https://explorer.stacks.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                View on Explorer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-800/50">
                    <th className="text-left p-4 text-gray-400 font-medium">Contract</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Address</th>
                    <th className="text-center p-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {[
                    { name: 'Staking', address: 'aegis-staking-v2-15', status: 'Active' },
                    { name: 'Treasury', address: 'aegis-treasury-v2-15', status: 'Active' },
                    { name: 'Rewards', address: 'aegis-rewards-v2-15', status: 'Active' },
                    { name: 'Token (AGS)', address: 'aegis-token-v2-15', status: 'Active' },
                  ].map((contract, i) => (
                    <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 text-white font-medium">{contract.name}</td>
                      <td className="p-4">
                        <a 
                          href={`https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.${contract.address}?chain=mainnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-mono text-sm flex items-center gap-2 group"
                        >
                          SP3FKNEZ...{contract.address}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-12 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-1">Security First</h3>
                <p className="text-gray-400 text-sm">
                  All smart contracts are open source and deployed on Stacks blockchain, 
                  secured by Bitcoin&apos;s proof-of-work. Verify contract code on the explorer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}a 
                        href="https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-rewards-v2-15?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        SP3FKNEZ...aegis-rewards-v2-15
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 text-white">Token (AGS)</td>
                    <td className="p-4">
                      <a 
                        href="https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-token-v2-15?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        SP3FKNEZ...aegis-token-v2-15
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 text-white">Treasury</td>
                    <td className="p-4">
                      <a 
                        href="https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-treasury-v2-15?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        SP3FKNEZ...aegis-treasury-v2-15
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
