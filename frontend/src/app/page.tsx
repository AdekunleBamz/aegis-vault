import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { StakeForm } from '@/components/sections/stake-form';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1">
        <Hero />
        <Stats />
        <StakeForm />
      </main>
    </div>
  );
}
