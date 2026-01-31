import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'highlight';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  padding = 'md' 
}: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-gray-800/50 border border-gray-700/50',
    gradient: 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/30',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    highlight: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover 
    ? 'hover:border-gray-600 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5' 
    : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, icon, badge }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/10 flex items-center justify-center text-blue-400">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-700/50 ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <Card variant="glass" hover className="group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
              {changeType === 'positive' && '↑ '}
              {changeType === 'negative' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-700/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
