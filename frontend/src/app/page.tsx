import { Hero } from '@/components/sections/hero';
import dynamic from 'next/dynamic';

const Stats = dynamic(
  () => import('@/components/sections/stats'),
  {
    loading: () => (
      <div className="container py-24">
        <div className="h-64 rounded-[32px] border border-border/60 bg-muted/20" />
      </div>
    ),
  }
);

const StakeForm = dynamic(
  () => import('@/components/sections/stake-form'),
  {
    ssr: false,
    loading: () => (
      <div className="container max-w-2xl py-24">
        <div className="h-96 rounded-[48px] border border-border/40 bg-muted/20" />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex-1">
        <div className="container pt-8 pb-2 flex flex-wrap items-center justify-center gap-3" role="navigation" aria-label="Page sections">
          <a
            href="#protocol-overview"
            className="rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-aegis-blue/40 transition-colors"
          >
            Overview
          </a>
          <a
            href="#protocol-stats"
            className="rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-aegis-blue/40 transition-colors"
          >
            Live Stats
          </a>
          <a
            href="#stake-entry"
            className="rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-aegis-blue/40 transition-colors"
          >
            Start Staking
          </a>
        </div>
        <section id="protocol-overview" className="scroll-mt-28">
          <Hero />
        </section>
        <section id="protocol-stats" className="scroll-mt-28">
          <Stats />
        </section>
        <section id="stake-entry" className="scroll-mt-28">
          <StakeForm />
        </section>
      </div>
    </div>
  );
}
