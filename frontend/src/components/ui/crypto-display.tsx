'use client';

import React from 'react';

// QR Code Display (placeholder - actual rendering would use a library)
export interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 200,
  label,
  className = '',
}: QRCodeDisplayProps) {
  // This is a placeholder - in real implementation use qrcode library
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className="bg-white p-4 rounded-xl"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          QR Code: {value.slice(0, 20)}...
        </div>
      </div>
      {label && (
        <p className="mt-2 text-sm text-gray-400">{label}</p>
      )}
    </div>
  );
}

// Token Logo
export interface TokenLogoProps {
  symbol: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const logoSizes = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

export function TokenLogo({
  symbol,
  imageUrl,
  size = 'md',
  className = '',
}: TokenLogoProps) {
  const [hasError, setHasError] = React.useState(false);

  if (imageUrl && !hasError) {
    return (
      <img
        src={imageUrl}
        alt={symbol}
        className={`${logoSizes[size].split(' ').slice(0, 2).join(' ')} rounded-full ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback to initials
  const initial = symbol.slice(0, 2).toUpperCase();

  return (
    <div
      className={`${logoSizes[size]} rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold ${className}`}
    >
      {initial}
    </div>
  );
}

// Token Pair
export interface TokenPairProps {
  token0: { symbol: string; imageUrl?: string };
  token1: { symbol: string; imageUrl?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenPair({
  token0,
  token1,
  size = 'md',
  className = '',
}: TokenPairProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <TokenLogo {...token0} size={size} />
      <TokenLogo {...token1} size={size} className="-ml-2" />
    </div>
  );
}

// Price Display
export interface PriceDisplayProps {
  price: number;
  currency?: string;
  change24h?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const priceSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function PriceDisplay({
  price,
  currency = 'USD',
  change24h,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);

  return (
    <div className={className}>
      <p className={`font-bold text-white ${priceSizes[size]}`}>{formattedPrice}</p>
      {change24h !== undefined && (
        <p
          className={`text-sm font-medium ${
            change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
        </p>
      )}
    </div>
  );
}

// Network Badge
export interface NetworkBadgeProps {
  network: string;
  isTestnet?: boolean;
  className?: string;
}

const networkColors: Record<string, string> = {
  mainnet: 'bg-emerald-500/20 text-emerald-400',
  testnet: 'bg-yellow-500/20 text-yellow-400',
  devnet: 'bg-purple-500/20 text-purple-400',
  stacks: 'bg-indigo-500/20 text-indigo-400',
  bitcoin: 'bg-orange-500/20 text-orange-400',
};

export function NetworkBadge({
  network,
  isTestnet = false,
  className = '',
}: NetworkBadgeProps) {
  const colorClass = isTestnet
    ? networkColors.testnet
    : networkColors[network.toLowerCase()] || networkColors.mainnet;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {network}
      {isTestnet && ' (Testnet)'}
    </span>
  );
}

// Gas Estimate
export interface GasEstimateProps {
  gasLimit: number;
  gasPrice: number;
  symbol?: string;
  className?: string;
}

export function GasEstimate({
  gasLimit,
  gasPrice,
  symbol = 'STX',
  className = '',
}: GasEstimateProps) {
  const estimatedFee = (gasLimit * gasPrice) / 1e6;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="text-gray-400">Est. fee:</span>
      <span className="text-white font-medium">
        {estimatedFee.toFixed(6)} {symbol}
      </span>
    </div>
  );
}
