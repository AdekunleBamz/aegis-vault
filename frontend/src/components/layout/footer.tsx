import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-lg font-bold text-white">Aegis Vault</span>
            </div>
            <p className="text-gray-400 text-sm">
              Secure STX staking protocol on the Stacks blockchain.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Protocol</h4>
            <ul className="space-y-2">
              <li>
                <a href="/stake" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Stake
                </a>
              </li>
              <li>
                <a href="/withdraw" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Withdraw
                </a>
              </li>
              <li>
                <a href="/claim" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Claim Rewards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Explorer
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/AdekunleBamz/aegis-vault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Aegis Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
