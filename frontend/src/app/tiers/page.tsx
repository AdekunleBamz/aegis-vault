'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { STAKING_TIERS } from '@/lib/constants';
import { formatBlockDuration } from '@/lib/format';

export default function TiersPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Staking Tiers</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the tier that matches your staking goals. Higher tiers offer 
              better APY but require longer lock periods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAKING_TIERS.map((tier, index) => (
              <Card 
                key={tier.level}
                className="relative overflow-hidden"
                style={{ borderColor: tier.color + '40' }}
              >
                {/* Tier badge */}
                <div 
                  className="absolute top-0 right-0 px-4 py-1 text-xs font-bold"
                  style={{ backgroundColor: tier.color, color: '#000' }}
                >
                  TIER {tier.level}
                </div>

                <div className="p-6">
                  {/* Tier icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                    style={{ backgroundColor: tier.color + '20' }}
                  >
                    {index === 0 && '🥉'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥇'}
                    {index === 3 && '💎'}
                  </div>

                  {/* Tier name */}
                  <h2 className="text-2xl font-bold mb-2" style={{ color: tier.color }}>
                    {tier.name}
                  </h2>

                  {/* APY */}
                  <div className="text-4xl font-bold text-green-400 mb-4">
                    {tier.apy}%
                    <span className="text-lg text-gray-400 ml-1">APY</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum Stake</span>
                      <span className="font-medium">{tier.minStake.toLocaleString()} STX</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maximum Stake</span>
                      <span className="font-medium">
                        {tier.maxStake ? tier.maxStake.toLocaleString() + ' STX' : 'Unlimited'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period</span>
                      <span className="font-medium">
                        {formatBlockDuration(tier.lockPeriod)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Early Exit Penalty</span>
                      <span className="font-medium text-red-400">10%</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="text-sm font-medium mb-2">Benefits:</div>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        AGS Token Rewards
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        Compounding Interest
                      </li>
                      {tier.level >= 2 && (
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          Priority Support
                        </li>
                      )}
                      {tier.level >= 3 && (
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          Governance Voting
                        </li>
                      )}
                      {tier.level === 4 && (
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          Exclusive Airdrops
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Can I change my tier after staking?</h3>
                <p className="text-gray-400">
                  No, once you stake in a tier, you cannot change it. You would need to withdraw 
                  and create a new stake in a different tier.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">What happens if I withdraw early?</h3>
                <p className="text-gray-400">
                  Early withdrawals incur a 10% penalty on your staked amount. Your earned 
                  rewards are not affected by this penalty.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">How are rewards calculated?</h3>
                <p className="text-gray-400">
                  Rewards are calculated per block based on your tier's APY. You can claim 
                  accumulated rewards at any time without affecting your stake.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Is there a cooldown period for withdrawals?</h3>
                <p className="text-gray-400">
                  Yes, after initiating a withdrawal, there is a ~24 hour cooldown period 
                  before you can complete the withdrawal and receive your STX.
                </p>
              </Card>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
