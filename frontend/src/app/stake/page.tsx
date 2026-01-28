'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StakingFlow } from '@/components/flows/staking-flow';
import { Section } from '@/components/ui/section';

export default function StakePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Stake STX</h1>
              <p className="text-gray-400">
                Stake your STX tokens to earn AGS rewards
              </p>
            </div>
            
            <StakingFlow />
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
