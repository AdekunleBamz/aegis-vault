'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useWallet } from '@/context/wallet-context';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRelativeTime, truncateAddress, formatSTX } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading';

export default function HistoryPage() {
  const { address, isConnected, connect } = useWallet();
  const { transactions, isLoading } = useTransactions(address || '', 50);

  const getActionName = (functionName: string) => {
    const actions: Record<string, string> = {
      stake: 'Stake',
      'request-withdrawal': 'Withdrawal Request',
      'complete-withdrawal': 'Withdrawal Complete',
      'claim-rewards': 'Claim Rewards',
    };
    return actions[functionName] || functionName;
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    if (status === 'success') return 'success';
    if (status === 'pending') return 'warning';
    return 'error';
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">Transaction History</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view history</p>
            <button
              onClick={connect}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
            >
              Connect Wallet
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-gray-400 mb-8">Your Aegis Vault activity</p>

          <Card>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-700">
                    <LoadingSkeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <LoadingSkeleton className="w-32 h-5 mb-2" />
                      <LoadingSkeleton className="w-24 h-4" />
                    </div>
                    <LoadingSkeleton className="w-20 h-6" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No transactions found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {transactions.map((tx) => (
                  <a
                    key={tx.tx_id}
                    href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 py-4 hover:bg-gray-800/50 px-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">
                        {getActionName(tx.contract_call?.function_name || 'Unknown')}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {truncateAddress(tx.tx_id)} • Block {tx.block_height}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(tx.tx_status)}>
                        {tx.tx_status}
                      </Badge>
                      <p className="text-gray-500 text-sm mt-1">
                        {formatRelativeTime(tx.burn_block_time)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
