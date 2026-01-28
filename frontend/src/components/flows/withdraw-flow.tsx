'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useWithdraw } from '@/hooks/use-withdraw';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';

interface WithdrawFlowProps {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export function WithdrawFlow({ onSuccess, onError }: WithdrawFlowProps) {
  const { address, isConnected, connect } = useWallet();
  const { position, refetch: refetchPositions } = usePositions(address || '');
  const { requestWithdraw, completeWithdraw, isLoading, error } = useWithdraw();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'pending' | 'success'>('input');
  const [txId, setTxId] = useState<string | null>(null);

  const stakedAmount = position?.amountStaked || BigInt(0);
  const numAmount = parseFloat(amount) || 0;

  const handleSubmit = async () => {
    if (numAmount <= 0) return;
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('pending');

    try {
      const result = await requestWithdraw(numAmount);
      setTxId(result.txId);
      setStep('success');
      onSuccess?.(result.txId);
      refetchPositions();
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
        <p className="text-gray-400 mb-4">Connect your wallet to withdraw</p>
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
        <h3 className="text-xl font-bold text-white mb-2">Withdrawal Requested!</h3>
        <p className="text-gray-400 mb-4">Your withdrawal is now in the cooldown period.</p>
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
          <Button onClick={handleReset} variant="secondary">Back</Button>
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
        <CardHeader title="Confirm Withdrawal" />
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Withdrawal Amount</span>
              <span className="text-white font-medium">{numAmount.toFixed(6)} STX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cooldown Period</span>
              <span className="text-orange-400">~24 hours</span>
            </div>
          </div>
          
          <p className="text-yellow-400 text-sm">
            ⚠️ After requesting, you must wait for the cooldown period before completing the withdrawal.
          </p>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('input')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Request Withdrawal
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Withdraw STX" subtitle="Unstake your tokens" />
      
      <div className="space-y-4">
        <Input
          label="Amount to Withdraw"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          suffix={
            <button
              onClick={() => setAmount((Number(stakedAmount) / 1e6).toString())}
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              MAX
            </button>
          }
        />
        
        <div className="text-gray-500 text-sm">
          Staked: {formatSTX(stakedAmount)} STX
        </div>

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
