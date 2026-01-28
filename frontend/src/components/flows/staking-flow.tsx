'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';

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

  if (!isConnected) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-400 mb-4">Connect your wallet to stake</p>
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
        <h3 className="text-xl font-bold text-white mb-2">Stake Submitted!</h3>
        <p className="text-gray-400 mb-4">Your transaction has been submitted to the network.</p>
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
          <Button onClick={handleReset} variant="secondary">Stake More</Button>
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

  if (step === 'confirm') {
    return (
      <Card>
        <CardHeader title="Confirm Stake" />
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-medium">{numAmount.toFixed(6)} STX</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tier</span>
              <span style={{ color: TIERS[tier]?.color }}>{TIERS[tier]?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">APY</span>
              <span className="text-green-400">{apy}%</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('input')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirm Stake
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Stake STX" subtitle="Earn AGS rewards" />
      
      <div className="space-y-4">
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          suffix={
            <button
              onClick={() => setAmount((Number(stxBalance) / 1e6).toString())}
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              MAX
            </button>
          }
        />
        
        <div className="text-gray-500 text-sm">
          Balance: {formatSTX(stxBalance)} STX
        </div>

        {numAmount > 0 && (
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Tier</span>
              <span style={{ color: TIERS[tier]?.color }}>{TIERS[tier]?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Est. APY</span>
              <span className="text-green-400">{apy}%</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={numAmount <= 0 || isLoading}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
