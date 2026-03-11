'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { truncateAddress, formatSTX } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useBalances } from '@/hooks/use-balances';
import { useNetwork } from '@/hooks/use-network';
import {
  Menu,
  X,
  Wallet,
  LogOut,
  LayoutDashboard,
  Layers,
  History,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkBadge } from '@/components/ui/network-badge';

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const { stxBalance } = useBalances();
  const { blockHeight } = useNetwork();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/stake', label: 'Stake', icon: Layers },
    { href: '/positions', label: 'Positions', icon: History },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
    { href: '/tiers', label: 'Tiers', icon: ShieldCheck },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Left: Logo & Network */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Aegis Vault Home">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-aegis-blue to-aegis-purple rounded-xl flex items-center justify-center shadow-lg shadow-aegis-blue/20 group-hover:shadow-aegis-blue/40 transition-all duration-500 group-hover:rotate-6">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-aegis-blue/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient hidden sm:block">
              Aegis Vault
            </span>
          </Link>

          <div className="hidden lg:block">
            <NetworkBadge />
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Wallet / Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                aria-label="Wallet menu"
                aria-expanded={showWalletMenu}
                aria-haspopup="true"
                className="flex items-center gap-3 px-4 py-2 bg-muted/50 hover:bg-muted/80 rounded-full border border-border/50 backdrop-blur-sm transition-all group"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-black tabular-nums tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {truncateAddress(address || '')}
                </span>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-300",
                  showWalletMenu ? "rotate-90" : ""
                )} />
              </button>

              <AnimatePresence>
                {showWalletMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-56 rounded-3xl bg-background/90 backdrop-blur-2xl border border-border shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border/50 mb-1 space-y-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Balances</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">STX</span>
                            <span className="text-xs font-black tabular-nums">{formatSTX(stxBalance)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">AGS</span>
                            <span className="text-xs font-black tabular-nums">0.00</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Network</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-aegis-blue" />
                            <span className="text-xs font-bold">Mainnet</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-[10px] font-black text-muted-foreground">24ms</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground italic">Block Height</span>
                          <span className="text-[10px] font-black tabular-nums text-aegis-blue">{blockHeight}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={disconnect}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-2xl transition-all group"
                    >
                      <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              aria-label={isConnecting ? "Authenticating wallet" : "Connect Stacks Wallet"}
              className="group relative px-6 py-2.5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_-5px_hsl(var(--foreground)/0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Wallet className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {isConnecting ? 'Authenticating...' : 'Connect Wallet'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-aegis-blue to-aegis-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-full border border-border/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-2xl transition-all flex items-center justify-between",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
