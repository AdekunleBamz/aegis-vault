'use client';

import React from 'react';

export interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function CopyButton({ 
  text, 
  onCopy, 
  className = '',
  children 
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 
        text-sm text-gray-400 hover:text-white
        bg-gray-800 hover:bg-gray-700 
        rounded-lg transition-all
        ${className}
      `}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {children || (
        <>
          {copied ? (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </>
      )}
    </button>
  );
}

// Address display with copy functionality
export interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  showCopy?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  truncate = true,
  showCopy = true,
  className = '',
}: AddressDisplayProps) {
  const displayAddress = truncate 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : address;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm text-gray-300">{displayAddress}</span>
      {showCopy && (
        <CopyButton text={address} className="p-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </CopyButton>
      )}
    </div>
  );
}

// Transaction hash display
export interface TxHashDisplayProps {
  txId: string;
  network?: 'mainnet' | 'testnet';
  className?: string;
}

export function TxHashDisplay({
  txId,
  network = 'mainnet',
  className = '',
}: TxHashDisplayProps) {
  const truncated = `${txId.slice(0, 8)}...${txId.slice(-6)}`;
  const explorerUrl = `https://explorer.stacks.co/txid/${txId}?chain=${network}`;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        {truncated}
      </a>
      <CopyButton text={txId} className="p-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </CopyButton>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-gray-400 hover:text-white transition-colors"
        title="View on Explorer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
