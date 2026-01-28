'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WithdrawFlow } from '@/components/flows/withdraw-flow';
import { Section } from '@/components/ui/section';

export default function WithdrawPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Withdraw Stake</h1>
              <p className="text-gray-400">
                Unstake your STX and claim your rewards
              </p>
            </div>
            
            <WithdrawFlow />
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
