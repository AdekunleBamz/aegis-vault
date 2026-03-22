'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRelativeTime, truncateAddress } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Coins,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function RecentActivity() {
  const { address, isConnected } = useWallet();
  const { transactions, isLoading } = useTransactions(address || '', 10);

  if (!isConnected) {
    return (
      <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 h-full flex flex-col items-center justify-center text-center group">
        <div className="w-16 h-16 bg-muted rounded-[24px] flex items-center justify-center mb-4 text-muted-foreground/40 group-hover:scale-110 transition-transform">
          <History className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-black mb-2">History Locked</h3>
        <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
          Connect your wallet to synchronize your transaction history.
        </p>
      </div>
    );
  }

  const getActionInfo = (functionName: string) => {
    const actions: Record<string, { label: string; icon: any; color: string }> = {
      stake: { label: 'Staking STX', icon: ShieldCheck, color: 'text-aegis-blue' },
      'request-withdrawal': { label: 'Withdrawal Request', icon: ArrowUpRight, color: 'text-amber-500' },
      'complete-withdrawal': { label: 'Settled Withdrawal', icon: Zap, color: 'text-emerald-500' },
      'claim-rewards': { label: 'Yield Collection', icon: Coins, color: 'text-aegis-purple' },
    };
    return actions[functionName] || { label: functionName, icon: ArrowRightLeft, color: 'text-muted-foreground' };
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />;
    if (status === 'pending') return <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" aria-hidden="true" />;
    return <AlertCircle className="w-3.5 h-3.5 text-destructive" aria-hidden="true" />;
  };

  return (
    <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center">
            <History className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
        </div>
        <Link
          href="/history"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          Full Ledger
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-2xl" />
                <div className="flex-1">
                  <div className="w-24 h-4 bg-muted rounded-full mb-2" />
                  <div className="w-16 h-3 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">
              No transactions found
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {transactions.map((tx: any, index: number) => {
                const info = getActionInfo(tx.contract_call?.function_name || '');
                const Icon = info.icon;

                return (
                  <motion.a
                    key={tx.tx_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    href={`https://explorer.stacks.co/txid/${tx.tx_id}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View transaction ${info.label} ${tx.tx_status} from ${formatRelativeTime(tx.burn_block_time)} on Stacks Explorer`}
                    className="group flex items-center gap-4 p-3 rounded-3xl hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      "bg-background/80 border border-border/50",
                      info.color
                    )}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black tracking-tight truncate">
                          {info.label}
                        </p>
                        {getStatusIcon(tx.tx_status)}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {formatRelativeTime(tx.burn_block_time)}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40" aria-hidden="true" />
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
