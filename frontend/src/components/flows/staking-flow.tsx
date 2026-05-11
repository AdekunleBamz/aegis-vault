'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Coins,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TransactionStepper, Step } from '@/components/ui/transaction-stepper';
import { StakeForm } from '@/components/sections/stake-form';

/**
 * Props for the StakingFlow component.
 * Callbacks are fired after a successful or failed stake transaction.
 */
interface StakingFlowProps {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export function StakingFlow({ onSuccess, onError }: StakingFlowProps) {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance, refetch: refetchBalances } = useBalances(address || '');
  const { stake, isLoading, error: stakingError } = useStaking(address || '');

  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [txId, setTxId] = useState<string | null>(null);

  const steps: Step[] = [
    {
      id: 'input',
      title: 'Configure Stake',
      description: 'Enter the amount of STX you wish to deposit into the vault.',
      status: step === 'input' ? 'processing' : 'success'
    },
    {
      id: 'signing',
      title: 'Sign Transaction',
      description: 'Authorize the staking operation in your connected wallet.',
      status: step === 'input' ? 'idle' : step === 'processing' ? 'processing' : 'success'
    },
    {
      id: 'broadcast',
      title: 'Protocol Execution',
      description: 'Wait for the Stacks network to confirm your staking position.',
      status: step === 'success' ? 'success' : 'idle'
    }
  ];

  const currentStepIndex = step === 'input' ? 0 : step === 'processing' ? 1 : 2;

  if (!isConnected) {
    return (
      <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-12 text-center group">
        <div className="w-20 h-20 bg-muted rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
          <ShieldCheck className="w-10 h-10 text-muted-foreground/40" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-black mb-4">Staking Entry Locked</h3>
        <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
          Please connect your wallet to access the decentralized staking vault and start earning AGS.
        </p>
        <button type="button"
          onClick={connect}
          className="px-12 py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_0_40px_-10px_hsl(var(--foreground)/0.5)] transition-all active:scale-95"
        >
          Authenticate Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stepper Visualization */}
      <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 md:p-10">
        <TransactionStepper steps={steps} currentStepIndex={currentStepIndex} />
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StakeForm />
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-12 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="w-24 h-24 bg-aegis-blue/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 relative">
              <Clock className="w-10 h-10 text-aegis-blue animate-pulse" />
              <div className="absolute inset-0 rounded-[40px] border-4 border-aegis-blue border-t-transparent animate-spin" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-black mb-4">Awaiting Authorization</h3>
            <p className="text-muted-foreground font-medium mb-8 max-w-xs mx-auto">
              Please check your wallet extension to sign the staking transaction.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Zap className="w-3.5 h-3.5" />
              Gas fees: ~0.001 STX
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-2xl p-12 text-center relative overflow-hidden"
            role="status"
            aria-live="polite"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />

            <div className="w-24 h-24 bg-emerald-500 text-background rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Stake Broadcasted 🎉✨</h3>
            <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
              Your STX have been committed to the vault. Rewards will begin accruing after the next block confirmation.
            </p>
            <div className="mb-8 flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">TX ID: {txId?.slice(0, 8)}...{txId?.slice(-8)}</span>
              <button type="button"
                onClick={() => txId && navigator.clipboard.writeText(txId)}
                className="p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors border border-border/50 text-muted-foreground"
                title="Copy Transaction ID"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
              <a
                href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 bg-muted/50 hover:bg-muted border border-border/50 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Explorer
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 p-4 bg-foreground text-background rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
              >
                Dashboard
                <LayoutDashboard className="w-3.5 h-3.5" />
              </Link>
            </div>

            <button type="button"
              onClick={() => setStep('input')}
              className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Stake More STX
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
