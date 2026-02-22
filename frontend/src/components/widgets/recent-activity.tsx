'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRelativeTime, truncateAddress } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import { ArrowUpRight, History as HistoryIcon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecentActivity() {
  const { address, isConnected } = useWallet();
  const { transactions, isLoading } = useTransactions(address || '', 10);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader title="Recent Activity" />
        <div className="text-center py-8 text-gray-500">
          <p>Connect wallet to view activity</p>
        </div>
      </Card>
    );
  }

  const getActionName = (functionName: string) => {
    const actions: Record<string, string> = {
      stake: 'Staked',
      'request-withdrawal': 'Withdrawal Requested',
      'complete-withdrawal': 'Withdrawal Completed',
      'claim-rewards': 'Rewards Claimed',
    };
    return actions[functionName] || functionName;
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    if (status === 'success') return 'success';
    if (status === 'pending') return 'warning';
    return 'error';
  };

  return (
    <div className="glass-dark border border-white/5 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">Transaction History</h3>
          <p className="text-gray-500 text-xs">Your recent on-chain activity</p>
        </div>
        <a href="/history" className="text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1">
          View All
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 animate-pulse rounded-xl" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-white/5 animate-pulse rounded" />
                    <div className="w-16 h-2 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
                <div className="w-16 h-5 bg-white/5 animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center opacity-40">
            <HistoryIcon className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-gray-500 text-sm font-medium">No recent activity found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <motion.a
                key={tx.tx_id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, x: 5 }}
                whileTap={{ scale: 0.99 }}
                transition={{ delay: 0.05 * i }}
                href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 hover:bg-white/[0.03] rounded-xl border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-white text-sm font-bold truncate group-hover:text-blue-400 transition-colors">
                      {getActionName(tx.contract_call?.function_name || 'Unknown')}
                    </p>
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-tight">
                      {formatRelativeTime(tx.burn_block_time)}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                  tx.tx_status === 'success'
                    ? "bg-green-500/5 text-green-400 border-green-500/20"
                    : tx.tx_status === 'pending'
                      ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                      : "bg-red-500/5 text-red-400 border-red-500/20"
                )}>
                  {tx.tx_status}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
