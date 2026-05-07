'use client';

import React from 'react';
import Link from 'next/link';
import {
  Github,
  Twitter,
  Disc as Discord,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/AdekunleBamz/aegis-vault', label: 'View source code on GitHub' },
  { icon: Twitter, href: '', label: 'Follow us on Twitter' },
  { icon: Discord, href: '', label: 'Join our Discord community' },
];

const FOOTER_LINKS = {
  protocol: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Stake STX', href: '/stake' },
    { label: 'Account History', href: '/history' },
    { label: 'Transparency', href: '/security' },
    { label: 'Yield Strategies', href: '/strategies' },
    { label: 'Ecosystem', href: '/ecosystem' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Vault Stats', href: '/stats' },
  ],
  resources: [
    { label: 'Documentation', href: 'https://github.com/AdekunleBamz/aegis-vault#readme', external: true },
    { label: 'Analytics Hub', href: '/analytics' },
    { label: 'Security Portal', href: '/security' },
    { label: 'Governance', href: '/governance' },
    { label: 'Stacks Explorer', href: 'https://explorer.stacks.co', external: true },
  ],
};

const LEGAL_LINKS = [
  { label: 'Terms', href: '' },
  { label: 'Privacy', href: '' },
  { label: 'Security', href: '/security' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    protocol: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Stake STX', href: '/stake' },
      { label: 'Account History', href: '/history' },
      { label: 'Transparency', href: '/security' },
      { label: 'Yield Strategies', href: '/strategies' },
      { label: 'Ecosystem', href: '/ecosystem' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Vault Stats', href: '/stats' },
    ],
    resources: [
      { label: 'Status Page', href: 'https://status.example.com', external: true },
      { label: 'Documentation', href: '#' },
      { label: 'Analytics Hub', href: '/analytics' },
      { label: 'Security Portal', href: '/security' },
      { label: 'Governance', href: '/governance' },
      { label: 'Partner Portal', href: '#' },
      { label: 'Stacks Explorer', href: 'https://explorer.stacks.co', external: true },
    ],
  };

  return (
    <footer className="border-t border-border bg-muted/30 backdrop-blur-sm mt-auto" style={{ contentVisibility: 'auto' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 group mb-6" aria-label="Aegis Vault Home" title="Return to Aegis Vault home">
              <div className="w-10 h-10 bg-gradient-to-br from-aegis-blue to-aegis-purple rounded-xl flex items-center justify-center shadow-lg shadow-aegis-blue/20">
                <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient">
                Aegis Vault
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
              The next-generation staking protocol for the Stacks ecosystem. Secure your assets and earn maximized rewards with institutional-grade technology. System status is available on the status page.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all hover:-translate-y-1 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    key={social.label}
                    aria-disabled="true"
                    title={`${social.label} coming soon`}
                    className="w-10 h-10 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
                  >
                    <social.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="sm:col-span-4 md:col-span-2 lg:col-span-2">
            <h4 className="text-foreground font-semibold mb-6 text-sm uppercase tracking-wider">Protocol</h4>
            <ul className="space-y-4" aria-label="Protocol links">
              {FOOTER_LINKS.protocol.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={`Navigate to ${link.label}`}
                    className={cn("text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center group", link.href === "/dashboard" && "text-foreground font-bold")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-4 md:col-span-3 lg:col-span-2">
            <h4 className="text-foreground font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4" aria-label="Resource links">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={link.external ? `Open ${link.label} in a new tab` : `Navigate to ${link.label}`}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.external ? (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA/Newsletter */}
          <div className="sm:col-span-4 md:col-span-3 lg:col-span-3">
            <div className="p-6 rounded-3xl bg-muted/50 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 bg-foreground rounded-bl-3xl translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h4 className="text-foreground font-semibold mb-2 text-sm relative z-10">Start Staking</h4>
              <p className="text-muted-foreground text-xs mb-4 relative z-10">Join 5,000+ stakers securing the network.</p>
              <Link
                href="/stake"
                aria-label="Start staking now"
                className="inline-flex items-center gap-2 text-xs font-bold text-aegis-blue hover:text-aegis-purple transition-colors relative z-10"
              >
                Get Started
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-xs">
            &copy; {currentYear} Aegis Vault. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            {LEGAL_LINKS.map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  aria-label={`Open ${item.label} page`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  aria-disabled="true"
                  className="text-xs text-muted-foreground/50 cursor-not-allowed"
                  title={`${item.label} policy coming soon`}
                >
                  {item.label}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
