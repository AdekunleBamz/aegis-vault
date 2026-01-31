'use client';

import React from 'react';

export interface NumberTickerProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function NumberTicker({
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  duration = 1000,
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setIsAnimating(true);
    const startValue = displayValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// Countdown Timer
export interface CountdownProps {
  targetDate: Date | number;
  onComplete?: () => void;
  className?: string;
  showLabels?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({
  targetDate,
  onComplete,
  className = '',
  showLabels = true,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const target = typeof targetDate === 'number' ? targetDate : targetDate.getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return <span className={className}>Complete</span>;
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-gray-800 rounded-lg px-3 py-2 min-w-[48px]">
        <span className="text-xl font-bold text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      {showLabels && (
        <span className="text-xs text-gray-500 mt-1 block">{label}</span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" />
          <span className="text-gray-600 text-xl">:</span>
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-gray-600 text-xl">:</span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-gray-600 text-xl">:</span>
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

// Token Amount Display
export interface TokenAmountProps {
  amount: number | bigint | string;
  symbol?: string;
  decimals?: number;
  showSymbol?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export function TokenAmount({
  amount,
  symbol = '',
  decimals = 6,
  showSymbol = true,
  className = '',
  size = 'md',
}: TokenAmountProps) {
  const numAmount = typeof amount === 'bigint' 
    ? Number(amount) / Math.pow(10, decimals)
    : typeof amount === 'string'
      ? parseFloat(amount)
      : amount;

  const formatted = numAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`font-medium tabular-nums ${sizeClasses[size]} ${className}`}>
      {formatted}
      {showSymbol && symbol && (
        <span className="text-gray-400 ml-1">{symbol}</span>
      )}
    </span>
  );
}

// Percentage Change Display
export interface PercentageChangeProps {
  value: number;
  showIcon?: boolean;
  className?: string;
}

export function PercentageChange({
  value,
  showIcon = true,
  className = '',
}: PercentageChangeProps) {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <span className={`inline-flex items-center gap-1 ${color} ${className}`}>
      {showIcon && (
        <svg 
          className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      )}
      <span className="font-medium">
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    </span>
  );
}
