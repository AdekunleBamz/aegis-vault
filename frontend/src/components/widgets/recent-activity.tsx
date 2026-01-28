'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transactions';
import { useWallet } from '@/hooks/use-wallet';
import { formatRelativeTime, truncateAddress } from '@/lib/format';
import { EXPLORER_URL } from '@/lib/constants';
import Link from 'next/link';

export function RecentActivity() {
  const { address, isConnected } = useWallet();
  const { transactions, isLoading } = useTransactions(address, 5);

  if (!isConnected) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="text-green-400">✓</span>;
      case 'pending':
        return <span className="text-yellow-400 animate-pulse">●</span>;
      default:
        return <span className="text-red-400">✗</span>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Link href="/history" className="text-blue-400 text-sm hover:underline">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No recent transactions</div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <a
              key={tx.tx_id}
              href={`${EXPLORER_URL}/txid/${tx.tx_id}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(tx.tx_status)}
                <div>
                  <div className="font-medium text-sm">
                    {tx.contract_call?.function_name || tx.tx_type}
                  </div>
                  <div className="text-xs text-gray-400">
                    {truncateAddress(tx.tx_id)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {formatRelativeTime(tx.burn_block_time)}
              </div>
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
