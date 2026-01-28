'use client';

import React, { useState, useMemo } from 'react';
import { TIERS, BLOCKS_PER_YEAR } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { toMicroSTX, formatSTX } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function RewardsCalculator() {
  const [stakeAmount, setStakeAmount] = useState('1000');
  const [duration, setDuration] = useState('365');

  const calculations = useMemo(() => {
    const amount = parseFloat(stakeAmount) || 0;
    const days = parseFloat(duration) || 0;
    const microAmount = toMicroSTX(amount);
    
    const tier = determineTier(microAmount);
    const apy = calculateAPY(microAmount, tier);
    
    const blocks = Math.floor(days * 144);
    const yearlyRewards = (amount * apy) / 100;
    const periodRewards = (yearlyRewards * blocks) / BLOCKS_PER_YEAR;
    
    return {
      tier,
      tierName: TIERS[tier]?.name || 'Bronze',
      tierColor: TIERS[tier]?.color || '#CD7F32',
      apy,
      dailyRewards: yearlyRewards / 365,
      weeklyRewards: yearlyRewards / 52,
      monthlyRewards: yearlyRewards / 12,
      totalRewards: periodRewards,
    };
  }, [stakeAmount, duration]);

  return (
    <Card>
      <CardHeader 
        title="Rewards Calculator" 
        subtitle="Estimate your AGS earnings"
      />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stake Amount (STX)"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="1000"
          />
          <Input
            label="Duration (Days)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="365"
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Tier</span>
            <span style={{ color: calculations.tierColor }} className="font-medium">
              {calculations.tierName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">APY</span>
            <span className="text-green-400 font-medium">{calculations.apy}%</span>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Daily</span>
              <span className="text-white">{calculations.dailyRewards.toFixed(4)} AGS</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Weekly</span>
              <span className="text-white">{calculations.weeklyRewards.toFixed(4)} AGS</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Monthly</span>
              <span className="text-white">{calculations.monthlyRewards.toFixed(4)} AGS</span>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Total ({duration} days)</span>
              <span className="text-xl font-bold text-purple-400">
                {calculations.totalRewards.toFixed(4)} AGS
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
