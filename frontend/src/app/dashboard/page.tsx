import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PortfolioSummary } from '@/components/widgets/portfolio-summary';
import { RecentActivity } from '@/components/widgets/recent-activity';
import { ProtocolStats } from '@/components/widgets/protocol-stats';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400 mb-8">
            Overview of your staking portfolio
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PortfolioSummary />
              <RecentActivity />
            </div>
            <div>
              <ProtocolStats />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/stake"
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">Stake More</h3>
              <p className="text-gray-400 text-sm">Increase your staked position</p>
            </a>
            <a
              href="/withdraw"
              className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">Withdraw</h3>
              <p className="text-gray-400 text-sm">Unstake your STX tokens</p>
            </a>
            <a
              href="/claim"
              className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">Claim Rewards</h3>
              <p className="text-gray-400 text-sm">Collect your AGS earnings</p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
