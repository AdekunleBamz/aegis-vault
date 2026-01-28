'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { useTotalStaked, useTreasuryBalance } from '@/hooks/use-contract-read';
import { useNetworkStats } from '@/hooks/use-network';
import { formatSTX, formatCompact } from '@/lib/format';
import { CONTRACTS, EXPLORER_URL } from '@/lib/constants';

export default function StatsPage() {
  const { data: totalStakedData, isLoading: stakingLoading } = useTotalStaked();
  const { data: treasuryData, isLoading: treasuryLoading } = useTreasuryBalance();
  const { currentBlock, isLoading: networkLoading } = useNetworkStats();

  const totalStaked = totalStakedData?.value 
    ? parseInt(totalStakedData.value) / 1_000_000 
    : 0;
  
  const treasuryBalance = treasuryData?.value 
    ? parseInt(treasuryData.value) / 1_000_000 
    : 0;

  const stats = [
    {
      label: 'Total Value Locked',
      value: stakingLoading ? '...' : `${formatCompact(totalStaked)} STX`,
      subValue: stakingLoading ? '' : `≈ $${formatCompact(totalStaked * 0.5)}`,
      color: 'text-blue-400',
    },
    {
      label: 'Treasury Balance',
      value: treasuryLoading ? '...' : `${formatCompact(treasuryBalance)} STX`,
      subValue: 'Reward Pool',
      color: 'text-green-400',
    },
    {
      label: 'Active Stakers',
      value: '---',
      subValue: 'Unique addresses',
      color: 'text-purple-400',
    },
    {
      label: 'Total Rewards Paid',
      value: '---',
      subValue: 'AGS distributed',
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Protocol Statistics</h1>
            <p className="text-gray-400">
              Real-time metrics from the Aegis Vault protocol
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.subValue}</div>
              </Card>
            ))}
          </div>

          {/* Network Info */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Network Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-400 text-sm">Current Block</div>
                <div className="text-2xl font-bold">
                  {networkLoading ? '...' : currentBlock.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Network</div>
                <div className="text-2xl font-bold text-green-400">Mainnet</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Block Time</div>
                <div className="text-2xl font-bold">~10 min</div>
              </div>
            </div>
          </Card>

          {/* Contracts */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Smart Contracts</h2>
            <div className="space-y-4">
              {Object.entries(CONTRACTS).map(([key, contract]) => (
                <div 
                  key={key}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-gray-400 font-mono">
                      {contract.address}.{contract.name}
                    </div>
                  </div>
                  <a
                    href={`${EXPLORER_URL}/txid/${contract.address}.${contract.name}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm mt-2 md:mt-0"
                  >
                    View on Explorer →
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
