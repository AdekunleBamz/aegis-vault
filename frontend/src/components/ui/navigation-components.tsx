import React from 'react';

/**
 * PR #38: Drawer navigation for mobile
 */
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'left',
  children,
}) => {
  const positionClass = position === 'right' ? 'right-0' : 'left-0';
  const translateClass = position === 'right' ?
    `${isOpen ? 'translate-x-0' : 'translate-x-full'}` :
    `${isOpen ? 'translate-x-0' : '-translate-x-full'}`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed top-0 ${positionClass} bottom-0 w-64 bg-gray-900 border
          ${position === 'right' ? 'border-l' : 'border-r'} border-gray-800
          transform transition-transform duration-300 z-50
          ${translateClass}
        `}
      >
        {children}
      </div>
    </>
  );
};

/**
 * PR #39: Responsive grid layouts
 */
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: { sm?: number; md?: number; lg?: number };
}> = ({ children, cols = { sm: 1, md: 2, lg: 3 } }) => {
  const colClasses = `
    grid gap-4
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : 'grid-cols-1'}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
  `;

  return <div className={colClasses}>{children}</div>;
};

/**
 * PR #40: Breadcrumb navigation
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {item.href && !item.current ? (
          <a href={item.href} className="text-blue-400 hover:text-blue-300">
            {item.label}
          </a>
        ) : (
          <span className={item.current ? 'text-gray-300' : 'text-gray-500'}>
            {item.label}
          </span>
        )}
        {idx < items.length - 1 && <span className="text-gray-600">/</span>}
      </React.Fragment>
    ))}
  </nav>
);

/**
 * PR #41: Active link indicators
 */
export const NavLink: React.FC<{
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ href, label, isActive = false, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg transition-all
      ${
        isActive
          ? 'bg-blue-500/20 border-b-2 border-blue-500 text-blue-300'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }
    `}
  >
    {label}
  </a>
);

/**
 * PR #42: Page transition animations
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`animate-fade-in ${className}`}>{children}</div>
);

/**
 * PR #43: Back button navigation
 */
export const BackButton: React.FC<{
  onClick?: () => void;
  label?: string;
}> = ({ onClick, label = 'Back' }) => (
  <button
    onClick={onClick || (() => window.history.back())}
    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    {label}
  </button>
);

/**
 * PR #44: Navigation state persistence
 */
export function useNavigationState(key: string) {
  const [state, setState] = React.useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`nav_${key}`);
  });

  const setNavigationState = React.useCallback((value: string) => {
    setState(value);
    localStorage.setItem(`nav_${key}`, value);
  }, [key]);

  return { state, setNavigationState };
}
