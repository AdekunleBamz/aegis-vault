'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useRewards } from '@/hooks/use-rewards';
import { formatAGS } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';

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

  const pendingRewards = position?.pendingRewards || BigInt(0);

  const handleClaim = async () => {
    if (pendingRewards <= BigInt(0)) return;
    setStep('pending');

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
  };

  if (!isConnected) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-400 mb-4">Connect your wallet to claim rewards</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Rewards Claimed!</h3>
        <p className="text-gray-400 mb-4">Your AGS rewards have been sent to your wallet.</p>
        {txId && (
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            View on Explorer →
          </a>
        )}
        <div className="mt-6">
          <Button onClick={handleReset} variant="secondary">Done</Button>
        </div>
      </Card>
    );
  }

  if (step === 'pending') {
    return (
      <Card className="text-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Confirm in Wallet</h3>
        <p className="text-gray-400">Please confirm the transaction in your wallet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Claim Rewards" subtitle="Collect your AGS tokens" />
      
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Pending Rewards</p>
          <p className="text-4xl font-bold text-white">{formatAGS(pendingRewards)}</p>
          <p className="text-purple-400 text-sm mt-1">AGS</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleClaim}
          disabled={pendingRewards <= BigInt(0) || isLoading}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          {pendingRewards <= BigInt(0) ? 'No Rewards to Claim' : 'Claim Rewards'}
        </Button>
      </div>
    </Card>
  );
}
