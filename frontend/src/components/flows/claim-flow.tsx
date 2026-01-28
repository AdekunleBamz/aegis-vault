'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRewards } from '@/hooks/use-rewards';
import { usePositions } from '@/hooks/use-positions';
import { formatSTX } from '@/lib/format';

interface ClaimFlowProps {
  onClose?: () => void;
}

export function ClaimFlow({ onClose }: ClaimFlowProps) {
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { positions } = usePositions();
  const { claimRewards, claimAllRewards, isLoading, error, txId } = useRewards();

  const positionsWithRewards = positions.filter((p) => p.rewards > 0);
  const totalRewards = positionsWithRewards.reduce((sum, p) => sum + p.rewards, 0);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(positionsWithRewards.map((p) => p.id));
  };

  const handleClaim = async () => {
    if (selectedIds.length === 0) return;

    if (selectedIds.length === 1) {
      await claimRewards(selectedIds[0]);
    } else {
      await claimAllRewards(selectedIds);
    }

    if (!error) {
      setStep('success');
    }
  };

  const selectedRewards = positionsWithRewards
    .filter((p) => selectedIds.includes(p.id))
    .reduce((sum, p) => sum + p.rewards, 0);

  return (
    <Card className="max-w-lg mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Claim Rewards</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Step: Select */}
        {step === 'select' && (
          <div className="space-y-4">
            {positionsWithRewards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No rewards to claim</p>
                <p className="text-sm text-gray-500 mt-2">
                  Stake STX to earn AGS rewards
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Total Available: <span className="text-green-400">{totalRewards.toFixed(4)} AGS</span>
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-blue-400 text-sm hover:underline"
                  >
                    Select All
                  </button>
                </div>

                <div className="space-y-2">
                  {positionsWithRewards.map((pos) => (
                    <label
                      key={pos.id}
                      className={`flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer transition ${
                        selectedIds.includes(pos.id)
                          ? 'ring-2 ring-blue-500'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pos.id)}
                        onChange={() => toggleSelection(pos.id)}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pos.tier.color }}
                          />
                          <span className="font-medium">{pos.tier.name} #{pos.id}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {formatSTX(pos.amount * 1_000_000)} STX staked
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">
                          {pos.rewards.toFixed(4)} AGS
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Selected Rewards</span>
                    <span className="text-xl font-bold text-green-400">
                      {selectedRewards.toFixed(4)} AGS
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('confirm')}
                  disabled={selectedIds.length === 0}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {selectedRewards.toFixed(4)} AGS
              </div>
              <p className="text-gray-400">
                from {selectedIds.length} stake{selectedIds.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              {selectedIds.map((id) => {
                const pos = positionsWithRewards.find((p) => p.id === id);
                if (!pos) return null;
                return (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {pos.tier.name} #{id}
                    </span>
                    <span className="text-green-400">{pos.rewards.toFixed(4)} AGS</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onClick={handleClaim} className="flex-1" disabled={isLoading}>
                {isLoading ? 'Claiming...' : 'Claim Rewards'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold">Rewards Claimed!</h3>
            <div className="text-3xl font-bold text-green-400">
              {selectedRewards.toFixed(4)} AGS
            </div>

            {txId && (
              <a
                href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                View Transaction →
              </a>
            )}

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
