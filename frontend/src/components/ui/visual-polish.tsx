import React from 'react';

/**
 * PR #49: Enhanced gradient effects
 */
export const gradientClasses = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-600',
  danger: 'bg-gradient-to-r from-red-500 to-pink-600',
  cool: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600',
};

export const GradientText: React.FC<{
  variant?: keyof typeof gradientClasses;
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'primary', children, className = '' }) => (
  <span
    className={`${gradientClasses[variant]} bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

export const GradientCard: React.FC<{
  variant?: keyof typeof gradientClasses;
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'primary', children, className = '' }) => (
  <div
    className={`relative overflow-hidden rounded-lg ${className}`}
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))`,
    }}
  >
    <div className="absolute inset-0 opacity-20 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

/**
 * PR #50: Hover state improvements
 */
export const hoverEffects = {
  lift: 'hover:shadow-lg hover:-translate-y-1 transition-all',
  glow: 'hover:shadow-lg hover:shadow-blue-500/50 transition-shadow',
  grow: 'hover:scale-105 transition-transform',
  brighten: 'hover:opacity-100 opacity-90 transition-opacity',
};

export const HoverCard: React.FC<{
  effect?: keyof typeof hoverEffects;
  children: React.ReactNode;
  className?: string;
}> = ({ effect = 'lift', children, className = '' }) => (
  <div className={`${hoverEffects[effect]} ${className}`}>{children}</div>
);

/**
 * PR #51: Dark mode color refinements
 */
export const darkModeColors = {
  bg: {
    primary: 'bg-gray-950',
    secondary: 'bg-gray-900',
    tertiary: 'bg-gray-800',
    hover: 'hover:bg-gray-700',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-500',
    muted: 'text-gray-600',
  },
  border: {
    primary: 'border-gray-800',
    secondary: 'border-gray-700',
  },
};

export const DarkModeCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg';
}> = ({ children, className = '', elevation = 'md' }) => {
  const elevations = {
    sm: darkModeColors.bg.secondary,
    md: `${darkModeColors.bg.tertiary} shadow-lg shadow-black/20`,
    lg: `${darkModeColors.bg.tertiary} shadow-xl shadow-black/40 border ${darkModeColors.border.secondary}`,
  };

  return (
    <div className={`rounded-lg p-4 ${elevations[elevation]} ${className}`}>
      {children}
    </div>
  );
};
