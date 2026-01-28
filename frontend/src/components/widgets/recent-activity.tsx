'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRelativeTime, truncateAddress } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading';

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
    <Card>
      <CardHeader 
        title="Recent Activity" 
        action={
          <a href="/history" className="text-blue-400 text-sm hover:underline">
            View All
          </a>
        }
      />
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <LoadingSkeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <LoadingSkeleton className="w-24 h-4 mb-1" />
                <LoadingSkeleton className="w-16 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <a
              key={tx.tx_id}
              href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {getActionName(tx.contract_call?.function_name || 'Unknown')}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatRelativeTime(tx.burn_block_time)}
                </p>
              </div>
              <Badge variant={getStatusVariant(tx.tx_status)}>
                {tx.tx_status}
              </Badge>
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
