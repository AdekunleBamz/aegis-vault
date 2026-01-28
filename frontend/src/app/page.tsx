export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container">
          <div className="card p-10">
            <h1 className="text-4xl font-semibold text-white">Aegis Vault</h1>
            <p className="mt-4 text-base-200">
              Stake STX, earn AGS rewards, and manage your positions with confidence.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="btn btn-primary">Connect Wallet</button>
              <button className="btn btn-secondary">Explore Vault</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
