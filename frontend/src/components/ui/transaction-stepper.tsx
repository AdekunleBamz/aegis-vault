'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepStatus = 'idle' | 'processing' | 'success' | 'error';

export interface Step {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
}

/**
 * Props for the TransactionStepper component.
 * Renders a vertical stepper that visualises multi-step transaction progress.
 */
interface TransactionStepperProps {
    steps: Step[];
    currentStepIndex: number;
}

export function TransactionStepper({ steps, currentStepIndex }: TransactionStepperProps) {
    return (
        <div className="w-full space-y-6">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex || step.status === 'success';
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                    <div key={step.id} className="relative">
                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "absolute left-6 top-12 w-0.5 h-12 -translate-x-1/2 transition-colors duration-500",
                                    isCompleted ? "bg-aegis-blue" : "bg-muted"
                                )}
                            />
                        )}

                        <div className="flex gap-6 items-start group">
                            {/* Icon / Indicator */}
                            <div className="relative z-10 flex-shrink-0">
                                <AnimatePresence mode="wait">
                                    {step.status === 'processing' ? (
                                        <motion.div
                                            key="processing"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="w-12 h-12 bg-aegis-blue/10 border-2 border-aegis-blue rounded-2xl flex items-center justify-center text-aegis-blue"
                                        >
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </motion.div>
                                    ) : step.status === 'success' ? (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-background shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </motion.div>
                                    ) : step.status === 'error' ? (
                                        <motion.div
                                            key="error"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="w-12 h-12 bg-destructive rounded-2xl flex items-center justify-center text-background"
                                        >
                                            <AlertCircle className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="idle"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                                                isCurrent
                                                    ? "bg-background border-aegis-blue text-aegis-blue shadow-lg shadow-aegis-blue/10"
                                                    : "bg-muted/30 border-border text-muted-foreground/30"
                                            )}
                                        >
                                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-black text-sm">{index + 1}</span>}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Text Content */}
                            <div className="pt-1.5 flex-1 pb-8">
                                <h4 className={cn(
                                    "text-lg font-black tracking-tight transition-colors duration-500",
                                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground/40"
                                )}>
                                    {step.title}
                                </h4>
                                <p className={cn(
                                    "text-sm font-medium transition-colors duration-500",
                                    isCurrent ? "text-muted-foreground" : "text-muted-foreground/30"
                                )}>
                                    {step.description}
                                </p>

                                {step.status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-destructive"
                                    >
                                        Action required to proceed
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
