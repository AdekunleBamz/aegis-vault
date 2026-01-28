'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStaking } from '@/hooks/use-staking';
import { useBalances } from '@/hooks/use-balances';
import { STAKING_TIERS } from '@/lib/constants';
import { formatSTX, validateStakeAmount, getRecommendedTier } from '@/lib';

export function StakingFlow() {
  const [step, setStep] = useState<'amount' | 'tier' | 'confirm' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState(STAKING_TIERS[0]);
  
  const { stx: balance } = useBalances();
  const { stake, isLoading, error, txId } = useStaking();

  const numAmount = parseFloat(amount) || 0;
  const validation = validateStakeAmount(numAmount, selectedTier);
  const recommended = getRecommendedTier(numAmount);

  const handleAmountSubmit = () => {
    if (numAmount > 0) {
      setSelectedTier(recommended);
      setStep('tier');
    }
  };

  const handleTierSelect = (tier: typeof STAKING_TIERS[number]) => {
    setSelectedTier(tier);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    await stake({ amount: numAmount, tierLevel: selectedTier.level });
    if (!error) {
      setStep('success');
    }
  };

  const handleReset = () => {
    setStep('amount');
    setAmount('');
    setSelectedTier(STAKING_TIERS[0]);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <div className="p-6">
        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          {['Amount', 'Tier', 'Confirm', 'Done'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  idx <= ['amount', 'tier', 'confirm', 'success'].indexOf(step)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    idx < ['amount', 'tier', 'confirm', 'success'].indexOf(step)
                      ? 'bg-blue-600'
                      : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step: Amount */}
        {step === 'amount' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">How much STX to stake?</h2>
            <p className="text-gray-400">
              Available: {formatSTX(balance * 1_000_000)} STX
            </p>
            
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-2xl focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                STX
              </span>
            </div>

            <div className="flex gap-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setAmount(String((balance * pct) / 100))}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                >
                  {pct}%
                </button>
              ))}
            </div>

            <Button
              onClick={handleAmountSubmit}
              disabled={numAmount <= 0 || numAmount > balance}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step: Tier Selection */}
        {step === 'tier' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select a tier</h2>
            <p className="text-gray-400">
              Staking {formatSTX(numAmount * 1_000_000)} STX
            </p>

            <div className="space-y-3">
              {STAKING_TIERS.map((tier) => {
                const isValid = numAmount >= tier.minStake;
                const isRecommended = tier.level === recommended.level;

                return (
                  <button
                    key={tier.level}
                    onClick={() => isValid && handleTierSelect(tier)}
                    disabled={!isValid}
                    className={`w-full p-4 rounded-lg border text-left transition ${
                      isValid
                        ? 'border-gray-600 hover:border-blue-500 bg-gray-800'
                        : 'border-gray-800 bg-gray-900 opacity-50 cursor-not-allowed'
                    } ${selectedTier.level === tier.level ? 'border-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="font-semibold">{tier.name}</span>
                        {isRecommended && isValid && (
                          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-green-400 font-bold">{tier.apy}% APY</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Min: {tier.minStake} STX • Lock: {tier.lockPeriod / 144} days
                    </div>
                  </button>
                );
              })}
            </div>

            <Button variant="outline" onClick={() => setStep('amount')} className="w-full">
              Back
            </Button>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Confirm your stake</h2>

            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="font-semibold">{formatSTX(numAmount * 1_000_000)} STX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier</span>
                <span className="font-semibold" style={{ color: selectedTier.color }}>
                  {selectedTier.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APY</span>
                <span className="font-semibold text-green-400">{selectedTier.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lock Period</span>
                <span className="font-semibold">{selectedTier.lockPeriod / 144} days</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('tier')}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onClick={handleConfirm} className="flex-1" disabled={isLoading}>
                {isLoading ? 'Confirming...' : 'Stake STX'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold">Stake submitted!</h2>
            <p className="text-gray-400">
              Your transaction has been submitted to the network.
            </p>

            {txId && (
              <a
                href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                View on Explorer →
              </a>
            )}

            <Button onClick={handleReset} className="w-full">
              Stake More
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
