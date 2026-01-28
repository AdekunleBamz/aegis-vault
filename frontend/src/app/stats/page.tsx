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
          <h1 className="text-4xl font-bold text-center mb-2">Protocol Statistics</h1>
          <p className="text-gray-400 text-center mb-12">
            Real-time data from the Aegis Vault smart contracts
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProtocolStats />
            <RewardsCalculator />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-400 text-sm mb-2">Contract Version</h3>
              <p className="text-2xl font-bold text-white">v2.15</p>
              <p className="text-gray-400 text-sm mt-1">Split architecture</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-purple-400 text-sm mb-2">Network</h3>
              <p className="text-2xl font-bold text-white">Stacks Mainnet</p>
              <p className="text-gray-400 text-sm mt-1">Live production</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-green-400 text-sm mb-2">Token Standard</h3>
              <p className="text-2xl font-bold text-white">SIP-010</p>
              <p className="text-gray-400 text-sm mt-1">Fungible token</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Contract Addresses</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium">Contract</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="p-4 text-white">Staking</td>
                    <td className="p-4">
                      <a 
                        href="https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-staking-v2-15?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        SP3FKNEZ...aegis-staking-v2-15
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 text-white">Withdrawals</td>
                    <td className="p-4">
                      <a 
                        href="https://explorer.stacks.co/txid/SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.aegis-withdrawals-v2-15?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline font-mono text-sm"
                      >
                        SP3FKNEZ...aegis-withdrawals-v2-15
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 text-white">Rewards</td>
                    <td className="p-4">
                      <a 
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
