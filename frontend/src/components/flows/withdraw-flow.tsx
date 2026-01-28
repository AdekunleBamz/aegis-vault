'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWithdraw } from '@/hooks/use-withdraw';
import { usePositions } from '@/hooks/use-positions';
import { useBlockCountdown } from '@/hooks/use-network';
import { formatSTX } from '@/lib/format';
import type { StakingPosition } from '@/types/staking';

interface WithdrawFlowProps {
  position?: StakingPosition;
  onClose?: () => void;
}

export function WithdrawFlow({ position, onClose }: WithdrawFlowProps) {
  const [step, setStep] = useState<'select' | 'confirm' | 'pending' | 'complete'>('select');
  const [selectedPosition, setSelectedPosition] = useState<StakingPosition | null>(
    position || null
  );

  const { positions } = usePositions();
  const { initiateWithdraw, completeWithdraw, isLoading, error, txId } = useWithdraw();

  const { timeRemaining, isReady } = useBlockCountdown(selectedPosition?.endBlock || 0);

  const handleSelectPosition = (pos: StakingPosition) => {
    setSelectedPosition(pos);
    setStep('confirm');
  };

  const handleInitiateWithdraw = async () => {
    if (!selectedPosition) return;
    await initiateWithdraw(selectedPosition.id);
    if (!error) {
      setStep('pending');
    }
  };

  const handleCompleteWithdraw = async () => {
    if (!selectedPosition) return;
    await completeWithdraw(selectedPosition.id);
    if (!error) {
      setStep('complete');
    }
  };

  const activePositions = positions.filter((p) => p.status === 'active');
  const pendingPositions = positions.filter((p) => p.status === 'pending-withdraw');

  return (
    <Card className="max-w-lg mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Withdraw Stake</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Step: Select Position */}
        {step === 'select' && (
          <div className="space-y-4">
            {activePositions.length === 0 && pendingPositions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No active stakes to withdraw
              </p>
            ) : (
              <>
                {activePositions.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Active Stakes</h3>
                    {activePositions.map((pos) => (
                      <PositionCard
                        key={pos.id}
                        position={pos}
                        onSelect={() => handleSelectPosition(pos)}
                      />
                    ))}
                  </div>
                )}

                {pendingPositions.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Pending Withdrawal</h3>
                    {pendingPositions.map((pos) => (
                      <PositionCard
                        key={pos.id}
                        position={pos}
                        onSelect={() => handleSelectPosition(pos)}
                        isPending
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && selectedPosition && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Stake ID</span>
                <span>#{selectedPosition.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="font-semibold">
                  {formatSTX(selectedPosition.amount * 1_000_000)} STX
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier</span>
                <span style={{ color: selectedPosition.tier.color }}>
                  {selectedPosition.tier.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Rewards</span>
                <span className="text-green-400">
                  {selectedPosition.rewards.toFixed(4)} AGS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unlock Status</span>
                <span className={isReady ? 'text-green-400' : 'text-yellow-400'}>
                  {isReady ? 'Ready' : timeRemaining}
                </span>
              </div>
            </div>

            {!isReady && (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 text-yellow-400 text-sm">
                ⚠️ Early withdrawal will incur a 10% penalty
              </div>
            )}

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
              <Button
                onClick={handleInitiateWithdraw}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Initiate Withdraw'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Pending */}
        {step === 'pending' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold">Withdrawal Initiated</h3>
            <p className="text-gray-400">
              Please wait for the cooldown period (~1 day) before completing your withdrawal.
            </p>

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

            <Button onClick={handleCompleteWithdraw} className="w-full" disabled={isLoading}>
              Complete Withdrawal
            </Button>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold">Withdrawal Complete!</h3>
            <p className="text-gray-400">
              Your STX has been returned to your wallet.
            </p>

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

// Position Card Component
function PositionCard({
  position,
  onSelect,
  isPending,
}: {
  position: StakingPosition;
  onSelect: () => void;
  isPending?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition mb-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: position.tier.color }}
            />
            <span className="font-semibold">{position.tier.name}</span>
            {isPending && (
              <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded">Pending</span>
            )}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Stake #{position.id}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">
            {formatSTX(position.amount * 1_000_000)} STX
          </div>
          <div className="text-sm text-green-400">
            +{position.rewards.toFixed(4)} AGS
          </div>
        </div>
      </div>
    </button>
  );
}
