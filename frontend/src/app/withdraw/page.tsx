import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WithdrawFlow } from '@/components/flows/withdraw-flow';

export default function WithdrawPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2">Withdraw</h1>
          <p className="text-gray-400 text-center mb-12">
            Unstake your STX tokens
          </p>

          <WithdrawFlow />

          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-medium mb-2">Withdrawal Process</h3>
            <ol className="text-gray-400 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                Request withdrawal with desired amount
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                Wait for the 144-block cooldown period (~24 hours)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                Complete the withdrawal to receive your STX
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
