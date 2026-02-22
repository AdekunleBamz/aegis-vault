'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useWallet } from '@/context/wallet-context';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRelativeTime, truncateAddress, formatSTX, formatAGS } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading';
import { HistoryFilters } from '@/components/widgets';
import { motion, AnimatePresence } from 'framer-motion';

// Action configuration
const ACTION_CONFIG: Record<string, {
  name: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
}> = {
  stake: {
    name: 'Stake',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  'request-withdrawal': {
    name: 'Withdrawal Request',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  'complete-withdrawal': {
    name: 'Withdrawal Complete',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  'claim-rewards': {
    name: 'Claim Rewards',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
};

const defaultAction = {
  name: 'Transaction',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  color: 'text-gray-400',
  bgColor: 'bg-gray-500/20',
};

export default function HistoryPage() {
  const { address, isConnected, connect } = useWallet();
  const { transactions, isLoading } = useTransactions(address || '', 50);
  const [filter, setFilter] = useState<'all' | 'stake' | 'withdraw' | 'claim'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all');

  const getActionConfig = (functionName: string) => {
    return ACTION_CONFIG[functionName] || defaultAction;
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    if (status === 'success') return 'success';
    if (status === 'pending') return 'warning';
    return 'error';
  };

  // Filter and Sort transactions
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // Type Filter
    if (filter !== 'all') {
      result = result.filter((tx) => {
        const fn = tx.contract_call?.function_name || '';
        if (filter === 'stake') return fn === 'stake';
        if (filter === 'withdraw') return fn.includes('withdrawal');
        if (filter === 'claim') return fn === 'claim-rewards';
        return true;
      });
    }

    // Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(tx => tx.tx_status === statusFilter);
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx =>
        tx.tx_id.toLowerCase().includes(query) ||
        tx.contract_call?.function_name?.toLowerCase().includes(query) ||
        tx.block_height?.toString().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return b.burn_block_time - a.burn_block_time;
      if (sortBy === 'date-asc') return a.burn_block_time - b.burn_block_time;

      // For amount sorting, we'd need to extract value from args if available
      // For now, let's keep it simple or sort by block height as proxy
      if (sortBy === 'amount-desc') return (b.block_height || 0) - (a.block_height || 0);
      if (sortBy === 'amount-asc') return (a.block_height || 0) - (b.block_height || 0);

      return 0;
    });

    return result;
  }, [transactions, filter, searchQuery, sortBy, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const successful = transactions.filter(tx => tx.tx_status === 'success').length;
    const pending = transactions.filter(tx => tx.tx_status === 'pending').length;
    const failed = transactions.filter(tx => tx.tx_status !== 'success' && tx.tx_status !== 'pending').length;

    return { total: transactions.length, successful, pending, failed };
  }, [transactions]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-md text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Transaction History</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view your Aegis Vault activity</p>
            <Button onClick={connect} size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connect Wallet
            </Button>
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
            <p className="text-gray-400">Track all your Aegis Vault activity in one place</p>
          </div>

          {/* Stats Summary */}
          {!isLoading && transactions.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{stats.successful}</p>
                <p className="text-gray-400 text-sm">Successful</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                <p className="text-gray-400 text-sm">Failed</p>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {!isLoading && transactions.length > 0 && (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                {(['all', 'stake', 'withdraw', 'claim'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                      ${filter === f
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <HistoryFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </>
          )}

          <Card>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-700 last:border-0">
                    <LoadingSkeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1">
                      <LoadingSkeleton className="w-32 h-5 mb-2" />
                      <LoadingSkeleton className="w-48 h-4" />
                    </div>
                    <LoadingSkeleton className="w-20 h-6" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
                <p className="text-gray-400 mb-6">
                  {filter === 'all'
                    ? "You haven't made any transactions yet. Start by staking some STX!"
                    : `No ${filter} transactions found.`
                  }
                </p>
                {filter === 'all' && (
                  <Button as="a" href="/stake">Start Staking</Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-700/30">
                <AnimatePresence mode="popLayout">
                  {processedTransactions.map((tx, index) => {
                    const action = getActionConfig(tx.contract_call?.function_name || '');

                    return (
                      <motion.a
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.03 }}
                        key={tx.tx_id}
                        href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=mainnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 py-5 hover:bg-white/[0.02] px-4 -mx-4 first:rounded-t-2xl last:rounded-b-2xl transition-colors group"
                      >
                        {/* Icon */}
                        <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <span className={action.color}>{action.icon}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{action.name}</p>
                            <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded italic">{truncateAddress(tx.tx_id)}</span>
                            <span>•</span>
                            <span>Block #{tx.block_height?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Status & Time */}
                        <div className="text-right flex-shrink-0">
                          <Badge variant={getStatusVariant(tx.tx_status)} size="sm" className="font-bold">
                            {tx.tx_status === 'success' && (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {tx.tx_status}
                          </Badge>
                          <p className="text-gray-500 text-xs mt-1.5 font-medium">
                            {formatRelativeTime(tx.burn_block_time)}
                          </p>
                        </div>
                      </motion.a>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Card>

          {/* Pagination hint */}
          {filteredTransactions.length >= 50 && (
            <p className="text-center text-gray-500 text-sm mt-6">
              Showing latest 50 transactions. View more on{' '}
              <a
                href={`https://explorer.stacks.co/address/${address}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Stacks Explorer
              </a>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
