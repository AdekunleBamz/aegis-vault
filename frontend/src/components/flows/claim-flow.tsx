'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useRewards } from '@/hooks/use-rewards';
import { formatAGS, formatSTX } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { TIERS } from '@/lib/constants';
import { determineTier } from '@/lib/staking';

interface ClaimFlowProps {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export function ClaimFlow({ onSuccess, onError }: ClaimFlowProps) {
  const { address, isConnected, connect } = useWallet();
  const { position, refetch: refetchPositions } = usePositions(address || '');
  const { claimRewards, isLoading, error } = useRewards();
  const [step, setStep] = useState<'view' | 'pending' | 'success'>('view');
  const [txId, setTxId] = useState<string | null>(null);
  const [claimedAmount, setClaimedAmount] = useState<bigint>(BigInt(0));

  const pendingRewards = position?.pendingRewards || BigInt(0);
  const stakedAmount = position?.amountStaked || BigInt(0);
  const tier = determineTier(Number(stakedAmount));

  // Calculate estimated USD value (mock rate)
  const agsUsdRate = 0.042; // Mock AGS/USD rate
  const pendingUsd = (Number(pendingRewards) / 1e6) * agsUsdRate;

  const handleClaim = async () => {
    if (pendingRewards <= BigInt(0)) return;
    setStep('pending');
    setClaimedAmount(pendingRewards);

    try {
      const result = await claimRewards();
      setTxId(result.txId);
      setStep('success');
      onSuccess?.(result.txId);
      refetchPositions();
    } catch (err) {
      setStep('view');
      onError?.(error || 'Claim failed');
    }
  };

  const handleReset = () => {
    setStep('view');
    setTxId(null);
    setClaimedAmount(BigInt(0));
  };

  if (!isConnected) {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect to Claim Rewards</h3>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">
          Connect your Stacks wallet to claim your AGS staking rewards
        </p>
        <Button onClick={connect} size="lg">Connect Wallet</Button>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="text-center py-12">
        {/* Celebration Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mx-auto relative">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-ping" />
          </div>
          {/* Confetti dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'][i],
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Rewards Claimed! 🎉</h3>
        <p className="text-gray-400 mb-6">Your AGS tokens have been sent to your wallet.</p>
        
        {/* Claimed Amount */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5 max-w-sm mx-auto mb-6">
          <p className="text-gray-400 text-sm mb-1">You Received</p>
          <p className="text-3xl font-bold text-white">{formatAGS(claimedAmount)} AGS</p>
          <p className="text-purple-400 text-sm mt-1">≈ ${(Number(claimedAmount) / 1e6 * agsUsdRate).toFixed(2)} USD</p>
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
          <Button onClick={handleReset} variant="secondary">Claim More</Button>
          <Button as="a" href="/dashboard">View Dashboard</Button>
        </div>
      </Card>
    );
  }

  if (step === 'pending') {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-pink-500/30 rounded-full" />
          <div className="absolute inset-2 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Confirm in Wallet</h3>
        <p className="text-gray-400 mb-4">Please confirm the transaction in your wallet.</p>
        <p className="text-purple-400 text-sm">Claiming {formatAGS(pendingRewards)} AGS...</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Claim Rewards" subtitle="Collect your earned AGS tokens" />
      
      <div className="space-y-5">
        {/* Rewards Display */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Available to Claim</p>
            <p className="text-5xl font-bold text-white mb-2">{formatAGS(pendingRewards)}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-purple-400 font-medium">AGS</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">≈ ${pendingUsd.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Staking Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-400 text-sm">Currently Staked</span>
            </div>
            <p className="text-white font-bold text-lg">{formatSTX(stakedAmount)} STX</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: TIERS[tier]?.color }} />
              <span className="text-gray-400 text-sm">Your Tier</span>
            </div>
            <p style={{ color: TIERS[tier]?.color }} className="font-bold text-lg">{TIERS[tier]?.name}</p>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="bg-gray-900/30 rounded-xl p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How Rewards Work
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Rewards accumulate automatically based on your stake
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Higher tiers earn more AGS per STX staked
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Claim anytime with no penalties or fees
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleClaim}
          disabled={pendingRewards <= BigInt(0) || isLoading}
          isLoading={isLoading}
          fullWidth
          size="lg"
        >
          {pendingRewards <= BigInt(0) ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rewards Accumulating...
            </span>
          ) : (
            `Claim ${formatAGS(pendingRewards)} AGS`
          )}
        </Button>

        {pendingRewards <= BigInt(0) && (
          <p className="text-center text-gray-500 text-sm">
            Keep staking to earn more AGS rewards
          </p>
        )}
      </div>
    </Card>
  );
}
