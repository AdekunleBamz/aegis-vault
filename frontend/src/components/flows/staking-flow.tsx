'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StakingFlowProps {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export function StakingFlow({ onSuccess, onError }: StakingFlowProps) {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance, refetch: refetchBalances } = useBalances(address || '');
  const { stake, isLoading, error } = useStaking(address || '');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'pending' | 'success'>('input');
  const [txId, setTxId] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const microAmount = toMicroSTX(numAmount);
  const tier = determineTier(microAmount);
  const apy = calculateAPY(microAmount, tier);

  // Calculate next tier progress
  const nextTierInfo = useMemo(() => {
    if (tier >= TIERS.length - 1) return null;
    const nextTier = TIERS[tier + 1];
    const currentMin = TIERS[tier].minStake;
    const nextMin = nextTier.minStake;
    const progress = ((numAmount - currentMin) / (nextMin - currentMin)) * 100;
    return {
      name: nextTier.name,
      minStake: nextMin,
      progress: Math.min(Math.max(progress, 0), 100),
      remaining: nextMin - numAmount,
    };
  }, [numAmount, tier]);

  const handleSubmit = async () => {
    if (numAmount <= 0) return;
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('pending');

    try {
      const result = await stake(numAmount);
      setTxId(result.txId);
      setStep('success');
      onSuccess?.(result.txId);
      refetchBalances();
    } catch (err) {
      setStep('input');
      onError?.(error || 'Transaction failed');
    }
  };

  const handleReset = () => {
    setAmount('');
    setStep('input');
    setTxId(null);
  };

  // Quick amount buttons
  const quickAmounts = [
    { label: '25%', value: Number(stxBalance) / 4 / 1e6 },
    { label: '50%', value: Number(stxBalance) / 2 / 1e6 },
    { label: '75%', value: (Number(stxBalance) * 3) / 4 / 1e6 },
    { label: 'MAX', value: Number(stxBalance) / 1e6 },
  ];

  if (!isConnected) {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect to Start Staking</h3>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">
          Connect your Stacks wallet to stake STX and earn AGS rewards
        </p>
        <Button onClick={connect} size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Connect Wallet
        </Button>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="absolute inset-0 rounded-2xl bg-green-500/20 animate-ping" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Stake Submitted!</h3>
        <p className="text-gray-400 mb-6">Your transaction has been submitted to the network.</p>
        
        <div className="bg-gray-900/50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Amount Staked</span>
            <span className="text-white font-medium">{numAmount.toFixed(6)} STX</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">New Tier</span>
            <span style={{ color: TIERS[tier]?.color }} className="font-medium">{TIERS[tier]?.name}</span>
          </div>
        </div>

        {txId && (
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-6"
          >
            View on Explorer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button onClick={handleReset} variant="secondary">Stake More</Button>
          <Button as="a" href="/dashboard">View Dashboard</Button>
        </div>
      </Card>
    );
  }

  if (step === 'pending') {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Confirm in Wallet</h3>
        <p className="text-gray-400 mb-4">Please confirm the transaction in your wallet.</p>
        <p className="text-gray-500 text-sm">This may take a few moments...</p>
      </Card>
    );
  }

  if (step === 'confirm') {
    return (
      <Card>
        <CardHeader title="Confirm Stake" subtitle="Review your transaction" />
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm mb-1">You are staking</p>
              <p className="text-3xl font-bold text-white">{numAmount.toFixed(6)} STX</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
              <div className="flex justify-between">
                <span className="text-gray-400">Tier</span>
                <span style={{ color: TIERS[tier]?.color }} className="font-semibold">{TIERS[tier]?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APY</span>
                <span className="text-green-400 font-semibold">{apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Daily Rewards</span>
                <span className="text-white">{((numAmount * apy / 100) / 365).toFixed(4)} AGS</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('input')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1" size="lg">
              Confirm Stake
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Stake STX" subtitle="Earn AGS rewards by staking your STX" />
      
      <div className="space-y-5">
        <div>
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            inputSize="lg"
            suffix={<span className="text-gray-400 font-medium">STX</span>}
          />
          
          {/* Quick amount buttons */}
          <div className="flex gap-2 mt-3">
            {quickAmounts.map((qa) => (
              <button
                key={qa.label}
                onClick={() => setAmount(qa.value.toFixed(6))}
                className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white 
                  rounded-lg text-sm font-medium transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mt-3">
            Available: {formatSTX(stxBalance)} STX
          </p>
        </div>

        {numAmount > 0 && (
          <>
            {/* Tier Preview */}
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: TIERS[tier]?.color }}
                  />
                  <span style={{ color: TIERS[tier]?.color }} className="font-semibold">
                    {TIERS[tier]?.name} Tier
                  </span>
                </div>
                <span className="text-green-400 font-bold">{apy}% APY</span>
              </div>
              
              {/* Next tier progress */}
              {nextTierInfo && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to {nextTierInfo.name}</span>
                    <span className="text-gray-400">{nextTierInfo.remaining.toLocaleString()} STX more</span>
                  </div>
                  <Progress value={nextTierInfo.progress} color="purple" size="sm" />
                </div>
              )}
            </div>

            {/* Rewards Preview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Daily', value: ((numAmount * apy / 100) / 365).toFixed(4) },
                { label: 'Weekly', value: ((numAmount * apy / 100) / 52).toFixed(4) },
                { label: 'Monthly', value: ((numAmount * apy / 100) / 12).toFixed(4) },
              ].map((item) => (
                <div key={item.label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-medium">{item.value}</p>
                  <p className="text-gray-500 text-xs">AGS</p>
                </div>
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={numAmount <= 0 || isLoading}
          isLoading={isLoading}
          fullWidth
          size="lg"
        >
          {numAmount > 0 ? `Stake ${numAmount.toFixed(2)} STX` : 'Enter Amount'}
        </Button>
      </div>
    </Card>
  );
}
