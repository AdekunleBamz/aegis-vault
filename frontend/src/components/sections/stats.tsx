'use client';

import React from 'react';
import { useNetwork } from '@/hooks/use-network';
import { formatSTX, formatBlockHeight } from '@/lib/format';

export function Stats() {
  const { blockHeight } = useNetwork();

  // TODO: Fetch real stats from contract
  const stats = {
    totalStaked: BigInt(1500000000000),
    totalStakers: 42,
    rewardsDistributed: BigInt(50000000000),
  };

  return (
    <section className="py-16 px-4 bg-gray-900/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Protocol Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="text-blue-400 text-sm mb-2">Total Value Locked</div>
            <div className="text-3xl font-bold text-white">
              {formatSTX(stats.totalStaked)} STX
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="text-purple-400 text-sm mb-2">Total Stakers</div>
            <div className="text-3xl font-bold text-white">
              {stats.totalStakers}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="text-green-400 text-sm mb-2">Rewards Distributed</div>
            <div className="text-3xl font-bold text-white">
              {formatSTX(stats.rewardsDistributed)} AGS
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-6">
            <div className="text-orange-400 text-sm mb-2">Current Block</div>
            <div className="text-3xl font-bold text-white">
              {formatBlockHeight(blockHeight)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
