'use client';

import React, { useState, useMemo } from 'react';
import { TIERS, BLOCKS_PER_YEAR } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { toMicroSTX, formatSTX } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

// Duration presets
const DURATION_PRESETS = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
];

// Amount presets
const AMOUNT_PRESETS = [1000, 5000, 10000, 50000];

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
    
    // Calculate next tier info
    const nextTier = tier < TIERS.length - 1 ? TIERS[tier + 1] : null;
    const currentTierMin = TIERS[tier]?.minStake || 0;
    const nextTierMin = nextTier?.minStake || 0;
    const progressToNext = nextTier 
      ? Math.min(100, ((amount - currentTierMin) / (nextTierMin - currentTierMin)) * 100)
      : 100;
    const amountToNext = nextTier ? nextTierMin - amount : 0;
    
    // USD estimates (mock rate)
    const agsUsdRate = 0.042;
    const totalUsd = periodRewards * agsUsdRate;
    
    return {
      tier,
      tierName: TIERS[tier]?.name || 'Bronze',
      tierColor: TIERS[tier]?.color || '#CD7F32',
      apy,
      dailyRewards: yearlyRewards / 365,
      weeklyRewards: yearlyRewards / 52,
      monthlyRewards: yearlyRewards / 12,
      totalRewards: periodRewards,
      totalUsd,
      nextTier,
      nextTierName: nextTier?.name,
      nextTierColor: nextTier?.color,
      progressToNext,
      amountToNext,
    };
  }, [stakeAmount, duration]);

  return (
    <Card>
      <CardHeader 
        title="Rewards Calculator" 
        subtitle="Estimate your AGS earnings based on stake amount and duration"
        icon={
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        }
      />
      
      <div className="space-y-5">
        {/* Stake Amount Input */}
        <div>
          <Input
            label="Stake Amount"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter STX amount"
            inputSize="lg"
            suffix={<span className="text-gray-400 font-medium">STX</span>}
          />
          <div className="flex gap-2 mt-2">
            {AMOUNT_PRESETS.map((amount) => (
              <button
                key={amount}
                onClick={() => setStakeAmount(amount.toString())}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors
                  ${parseFloat(stakeAmount) === amount 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Input */}
        <div>
          <Input
            label="Staking Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter days"
            suffix={<span className="text-gray-400 font-medium">days</span>}
          />
          <div className="flex gap-2 mt-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.days}
                onClick={() => setDuration(preset.days.toString())}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors
                  ${parseFloat(duration) === preset.days 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier & APY Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: calculations.tierColor }}
              />
              <span className="text-gray-400 text-sm">Your Tier</span>
            </div>
            <p style={{ color: calculations.tierColor }} className="text-xl font-bold">
              {calculations.tierName}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-gray-400 text-sm">APY Rate</span>
            </div>
            <p className="text-xl font-bold text-green-400">{calculations.apy}%</p>
          </div>
        </div>

        {/* Next Tier Progress */}
        {calculations.nextTier && (
          <div className="bg-gray-900/30 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Progress to {calculations.nextTierName}</span>
              <span className="text-gray-400 text-sm">
                {calculations.amountToNext.toLocaleString()} STX more
              </span>
            </div>
            <Progress 
              value={calculations.progressToNext} 
              color="purple" 
              size="sm" 
            />
            <p className="text-xs text-gray-500 mt-2">
              Upgrade to {calculations.nextTierName} for higher APY rewards
            </p>
          </div>
        )}

        {/* Rewards Breakdown */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated Rewards
          </h4>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Daily', value: calculations.dailyRewards },
              { label: 'Weekly', value: calculations.weeklyRewards },
              { label: 'Monthly', value: calculations.monthlyRewards },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900/50 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                <p className="text-white font-medium">{item.value.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">AGS</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700/50 pt-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Total Estimated ({duration} days)</p>
              <p className="text-3xl font-bold text-purple-400 mb-1">
                {calculations.totalRewards.toFixed(2)} AGS
              </p>
              <p className="text-gray-500 text-sm">
                ≈ ${calculations.totalUsd.toFixed(2)} USD
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          * Estimates based on current rates. Actual rewards may vary based on protocol activity.
        </p>
      </div>
    </Card>
  );
}
