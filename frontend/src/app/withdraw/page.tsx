import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WithdrawFlow } from '@/components/flows/withdraw-flow';

export default function WithdrawPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-xl">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Withdraw
            </h1>
            <p className="text-gray-400">
              Unstake your STX tokens and return to your wallet
            </p>
          </div>

          <WithdrawFlow />

          {/* Process Steps */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Withdrawal Process
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Request Withdrawal', desc: 'Enter the amount of STX you want to unstake', time: 'Instant' },
                { step: 2, title: 'Cooldown Period', desc: 'Wait for the 144-block security cooldown', time: '~24 hours' },
                { step: 3, title: 'Complete Withdrawal', desc: 'Finalize to receive your STX tokens', time: 'Instant' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <span className="text-gray-500 text-xs">{item.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-yellow-500 font-medium text-sm">Important Notice</h4>
              <p className="text-gray-400 text-sm mt-1">
                Withdrawing will affect your tier status. You will stop earning rewards on withdrawn amounts immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
