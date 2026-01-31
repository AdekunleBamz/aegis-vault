'use client';

import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// ANIMATED COUNTER
// =============================================================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formattedValue = formatter 
    ? formatter(displayValue)
    : displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

// =============================================================================
// ANIMATED NUMBER WITH FLIP
// =============================================================================

interface FlipCounterProps {
  value: number;
  className?: string;
  digitClassName?: string;
}

export function FlipCounter({ value, className = '', digitClassName = '' }: FlipCounterProps) {
  const digits = Math.abs(value).toString().padStart(1, '0').split('');
  const isNegative = value < 0;

  return (
    <div className={`flex items-center ${className}`}>
      {isNegative && <span className="mr-1">-</span>}
      {digits.map((digit, index) => (
        <FlipDigit key={`${index}-${digit}`} digit={digit} className={digitClassName} />
      ))}
    </div>
  );
}

function FlipDigit({ digit, className = '' }: { digit: string; className?: string }) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setPrevDigit(digit);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [digit, prevDigit]);

  return (
    <div className={`relative overflow-hidden w-8 h-12 bg-zinc-800 rounded ${className}`}>
      <div
        className={`absolute inset-0 flex items-center justify-center text-xl font-bold transition-transform duration-300 ${
          isFlipping ? '-translate-y-full' : ''
        }`}
      >
        {prevDigit}
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center text-xl font-bold transition-transform duration-300 ${
          isFlipping ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {digit}
      </div>
    </div>
  );
}

// =============================================================================
// TYPING ANIMATION
// =============================================================================

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  loop?: boolean;
}

export function TypingAnimation({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
  cursorClassName = '',
  showCursor = true,
  loop = true,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          if (loop || textIndex < texts.length - 1) {
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className={`animate-pulse ${cursorClassName}`}>|</span>
      )}
    </span>
  );
}

// =============================================================================
// FADE IN VIEW
// =============================================================================

interface FadeInViewProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export function FadeInView({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
  className = '',
}: FadeInViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, once]);

  const directionStyles = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    none: '',
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : undefined,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={isVisible ? '' : directionStyles[direction]}>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// STAGGER CHILDREN
// =============================================================================

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  className = '',
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeInView delay={initialDelay + index * staggerDelay}>
          {child}
        </FadeInView>
      ))}
    </div>
  );
}

// =============================================================================
// PULSE ANIMATION
// =============================================================================

interface PulseProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Pulse({ children, color = 'bg-amber-500', size = 'md', className = '' }: PulseProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span className={`relative inline-flex ${className}`}>
      {children}
      <span className="absolute -top-1 -right-1 flex">
        <span className={`animate-ping absolute inline-flex ${sizes[size]} rounded-full ${color} opacity-75`} />
        <span className={`relative inline-flex rounded-full ${sizes[size]} ${color}`} />
      </span>
    </span>
  );
}

// =============================================================================
// SHIMMER EFFECT
// =============================================================================

interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Shimmer({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = '',
}: ShimmerProps) {
  return (
    <div
      className={`relative overflow-hidden bg-zinc-800 ${className}`}
      style={{ width, height, borderRadius }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"
        style={{
          animation: 'shimmer 2s infinite',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// CONFETTI BURST
// =============================================================================

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  className?: string;
}

export function Confetti({
  trigger,
  duration = 2000,
  particleCount = 50,
  className = '',
}: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ['#fbbf24', '#f97316', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'];
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: -Math.random() * 15 - 5,
        },
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timeout);
    }
  }, [trigger, particleCount, duration]);

  if (particles.length === 0) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${duration}ms ease-out forwards`,
            animationDelay: `${Math.random() * 100}ms`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}
