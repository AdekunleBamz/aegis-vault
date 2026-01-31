'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useWithdraw } from '@/hooks/use-withdraw';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WithdrawFlowProps {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

// Timeline step component
function TimelineStep({ 
  step, 
  title, 
  description, 
  isActive, 
  isCompleted 
}: { 
  step: number; 
  title: string; 
  description: string; 
  isActive: boolean; 
  isCompleted: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
          ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}
        `}>
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : step}
        </div>
        <div className={`w-0.5 h-12 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`} />
      </div>
      <div className="pb-8">
        <h4 className={`font-medium ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
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
  const percentageOfStake = stakedAmount > 0 ? (numAmount / (Number(stakedAmount) / 1e6)) * 100 : 0;

  // Quick amount buttons
  const quickAmounts = useMemo(() => [
    { label: '25%', value: Number(stakedAmount) / 4 / 1e6 },
    { label: '50%', value: Number(stakedAmount) / 2 / 1e6 },
    { label: '75%', value: (Number(stakedAmount) * 3) / 4 / 1e6 },
    { label: 'MAX', value: Number(stakedAmount) / 1e6 },
  ], [stakedAmount]);

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
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect to Withdraw</h3>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">
          Connect your Stacks wallet to withdraw your staked STX
        </p>
        <Button onClick={connect} size="lg">Connect Wallet</Button>
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
        <h3 className="text-2xl font-bold text-white mb-2">Withdrawal Requested!</h3>
        <p className="text-gray-400 mb-6">Your funds will be available after the cooldown period.</p>
        
        {/* Next Steps */}
        <div className="bg-gray-900/50 rounded-xl p-5 max-w-sm mx-auto mb-6 text-left">
          <h4 className="text-white font-medium mb-4">What happens next?</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 text-xs">1</span>
              </div>
              <p className="text-gray-400">Wait ~24 hours for cooldown period to complete</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xs">2</span>
              </div>
              <p className="text-gray-400">Return to complete your withdrawal</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs">3</span>
              </div>
              <p className="text-gray-400">Receive your STX back to your wallet</p>
            </div>
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
          <Button onClick={handleReset} variant="secondary">Withdraw More</Button>
          <Button as="a" href="/positions">View Positions</Button>
        </div>
      </Card>
    );
  }

  if (step === 'pending') {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Confirm in Wallet</h3>
        <p className="text-gray-400 mb-4">Please confirm the withdrawal request in your wallet.</p>
        <p className="text-gray-500 text-sm">This may take a few moments...</p>
      </Card>
    );
  }

  if (step === 'confirm') {
    return (
      <Card>
        <CardHeader title="Confirm Withdrawal" subtitle="Review your request" />
        <div className="space-y-5">
          {/* Amount Summary */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-5">
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm mb-1">You are withdrawing</p>
              <p className="text-3xl font-bold text-white">{numAmount.toFixed(6)} STX</p>
              <p className="text-gray-500 text-sm mt-1">{percentageOfStake.toFixed(1)}% of your stake</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
              <div className="flex justify-between">
                <span className="text-gray-400">Cooldown Period</span>
                <span className="text-orange-400 font-semibold">~24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Stake</span>
                <span className="text-white">{((Number(stakedAmount) / 1e6) - numAmount).toFixed(6)} STX</span>
              </div>
            </div>
          </div>
          
          {/* Warning Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-400 font-medium text-sm">Cooldown Period Required</p>
              <p className="text-gray-400 text-sm mt-1">
                After requesting, you must wait for the cooldown period before completing the withdrawal. 
                Your rewards will continue during this time.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('input')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1" size="lg">
              Request Withdrawal
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Withdraw STX" subtitle="Unstake your tokens and reclaim your STX" />
      
      <div className="space-y-5">
        {/* Current Stake Summary */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Currently Staked</p>
              <p className="text-2xl font-bold text-white">{formatSTX(stakedAmount)} STX</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <Input
            label="Amount to Withdraw"
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
        </div>

        {/* Withdrawal Preview */}
        {numAmount > 0 && (
          <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Withdrawing</span>
              <span className="text-white font-medium">{numAmount.toFixed(6)} STX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remaining Stake</span>
              <span className="text-white">{((Number(stakedAmount) / 1e6) - numAmount).toFixed(6)} STX</span>
            </div>
            <div className="pt-3 border-t border-gray-700/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Percentage</span>
                <span className="text-orange-400">{percentageOfStake.toFixed(1)}%</span>
              </div>
              <Progress value={percentageOfStake} color="orange" size="sm" />
            </div>
          </div>
        )}

        {/* Process Timeline */}
        <div className="bg-gray-900/30 rounded-xl p-4">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Withdrawal Process
          </h4>
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">1</div>
              <span className="text-gray-400">Request withdrawal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">2</div>
              <span className="text-gray-400">Wait ~24 hour cooldown</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
              <span className="text-gray-400">Complete withdrawal</span>
            </div>
          </div>
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
          onClick={handleSubmit}
          disabled={numAmount <= 0 || isLoading}
          isLoading={isLoading}
          fullWidth
          size="lg"
        >
          {numAmount > 0 ? `Withdraw ${numAmount.toFixed(2)} STX` : 'Enter Amount'}
        </Button>
      </div>
    </Card>
  );
}
