import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StakingFlow } from '@/components/flows/staking-flow';
import { RewardsCalculator } from '@/components/widgets/rewards-calculator';

export default function StakePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-center mb-2">Stake STX</h1>
          <p className="text-gray-400 text-center mb-12">
            Stake your STX tokens and earn AGS rewards
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StakingFlow />
            <RewardsCalculator />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
