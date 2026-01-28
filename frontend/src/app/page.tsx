import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { StakeForm } from '@/components/sections/stake-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <StakeForm />
      </main>
      <Footer />
    </div>
  );
}
