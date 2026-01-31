import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PortfolioSummary } from '@/components/widgets/portfolio-summary';
import { RecentActivity } from '@/components/widgets/recent-activity';
import { ProtocolStats } from '@/components/widgets/protocol-stats';

export default function DashboardPage() {
  const quickActions = [
    {
      href: '/stake',
      title: 'Stake More',
      description: 'Increase your staked position',
      gradient: 'from-blue-500/10 to-purple-500/10',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      href: '/withdraw',
      title: 'Withdraw',
      description: 'Unstake your STX tokens',
      gradient: 'from-orange-500/10 to-red-500/10',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      icon: (
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    },
    {
      href: '/claim',
      title: 'Claim Rewards',
      description: 'Collect your AGS earnings',
      gradient: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/20 hover:border-green-500/40',
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Connected
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Overview of your staking portfolio and protocol activity
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="lg:col-span-2 space-y-6">
              <PortfolioSummary />
              <RecentActivity />
            </div>
            <div>
              <ProtocolStats />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={action.href}
                  href={action.href}
                  className={`group bg-gradient-to-r ${action.gradient} border ${action.border} rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
