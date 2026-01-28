'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { STAKING_TIERS } from '@/lib/constants';
import { estimateRewards } from '@/lib/staking';
import { formatSTX } from '@/lib/format';

export function RewardsCalculator() {
  const [amount, setAmount] = useState('1000');
  const [selectedTier, setSelectedTier] = useState(STAKING_TIERS[0]);
  const [duration, setDuration] = useState(30);

  const numAmount = parseFloat(amount) || 0;
  const rewards = estimateRewards(numAmount, selectedTier, duration);

  const durations = [
    { label: '30 Days', days: 30 },
    { label: '90 Days', days: 90 },
    { label: '180 Days', days: 180 },
    { label: '1 Year', days: 365 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Rewards Calculator</h2>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Stake Amount (STX)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          placeholder="Enter amount"
        />
      </div>

      {/* Tier Selection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Staking Tier</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STAKING_TIERS.map((tier) => (
            <button
              key={tier.level}
              onClick={() => setSelectedTier(tier)}
              className={`p-3 rounded-lg border transition ${
                selectedTier.level === tier.level
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="font-medium" style={{ color: tier.color }}>
                {tier.name}
              </div>
              <div className="text-sm text-green-400">{tier.apy}% APY</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Duration</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {durations.map((d) => (
            <button
              key={d.days}
              onClick={() => setDuration(d.days)}
              className={`p-3 rounded-lg border transition ${
                duration === d.days
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Initial Stake</span>
          <span className="text-xl font-bold">{formatSTX(numAmount * 1_000_000)} STX</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Estimated STX Rewards</span>
          <span className="text-xl font-bold text-green-400">
            +{rewards.stxRewards.toFixed(4)} STX
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Estimated AGS Rewards</span>
          <span className="text-xl font-bold text-purple-400">
            +{rewards.agsRewards.toFixed(4)} AGS
          </span>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total After {duration} Days</span>
            <span className="text-2xl font-bold">
              {formatSTX((numAmount + rewards.stxRewards) * 1_000_000)} STX
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-4">
        * Estimated rewards are for illustration only. Actual rewards may vary based on 
        network conditions and protocol parameters.
      </p>
    </Card>
  );
}
