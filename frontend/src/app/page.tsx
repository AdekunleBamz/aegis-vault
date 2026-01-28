import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import Hero from '../components/sections/hero'
import Stats from '../components/sections/stats'
import StakeForm from '../components/sections/stake-form'
import RewardsPanel from '../components/sections/rewards-panel'
import TreasuryPanel from '../components/sections/treasury-panel'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <StakeForm />
      <RewardsPanel />
      <TreasuryPanel />
      <Footer />
    </main>
  )
}
