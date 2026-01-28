'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transactions';
import { useWallet } from '@/hooks/use-wallet';
import { formatRelativeTime, truncateAddress } from '@/lib/format';
import { EXPLORER_URL } from '@/lib/constants';

export default function HistoryPage() {
  const { isConnected, address } = useWallet();
  const { transactions, isLoading, hasMore, loadMore, refresh } = useTransactions(address);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400">Connect to view your transaction history</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'abort_by_response':
      case 'abort_by_post_condition':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'pending':
        return 'Pending';
      case 'abort_by_response':
        return 'Failed';
      case 'abort_by_post_condition':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getFunctionLabel = (functionName: string) => {
    const labels: Record<string, string> = {
      stake: 'Stake',
      'initiate-withdraw': 'Initiate Withdraw',
      'complete-withdraw': 'Complete Withdraw',
      'cancel-withdraw': 'Cancel Withdraw',
      'claim-rewards': 'Claim Rewards',
      transfer: 'Transfer',
      mint: 'Mint',
    };
    return labels[functionName] || functionName;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
              <p className="text-gray-400">
                Your recent blockchain transactions
              </p>
            </div>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Refresh
            </button>
          </div>

          {isLoading && transactions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-xl font-bold mb-2">No Transactions</h2>
              <p className="text-gray-400">
                Your transaction history will appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <a
                  key={tx.tx_id}
                  href={`${EXPLORER_URL}/txid/${tx.tx_id}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-4 hover:border-gray-600 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.tx_status === 'success' ? 'bg-green-900/30' :
                          tx.tx_status === 'pending' ? 'bg-yellow-900/30' : 'bg-red-900/30'
                        }`}>
                          {tx.tx_type === 'contract_call' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          )}
                        </div>

                        {/* Details */}
                        <div>
                          <div className="font-medium">
                            {tx.contract_call
                              ? getFunctionLabel(tx.contract_call.function_name)
                              : tx.tx_type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-gray-400">
                            {truncateAddress(tx.tx_id)}
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="text-right">
                        <div className={`font-medium ${getStatusColor(tx.tx_status)}`}>
                          {getStatusLabel(tx.tx_status)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatRelativeTime(tx.burn_block_time)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
