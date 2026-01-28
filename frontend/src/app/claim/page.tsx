import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ClaimFlow } from '@/components/flows/claim-flow';

export default function ClaimPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2">Claim Rewards</h1>
          <p className="text-gray-400 text-center mb-12">
            Collect your earned AGS tokens
          </p>

          <ClaimFlow />

          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
            <h3 className="text-white font-medium mb-2">About AGS Rewards</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                Rewards accumulate based on your staked amount and tier
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                Higher tiers earn more rewards per block
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                Claim anytime - no minimum withdrawal
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
