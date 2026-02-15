import React from 'react';

/**
 * PR #34: Mobile-first navigation redesign
 */
export const MobileNavigation: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ label: string; href: string }>;
}> = ({ isOpen, onClose, items }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />}
    <nav
      className={`
        fixed left-0 top-16 bottom-0 bg-gray-900 border-r border-gray-800
        w-64 transform transition-transform lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="space-y-2 p-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  </>
);

/**
 * PR #35: Touch-friendly button sizing
 */
export const TouchFriendlyButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`
      min-h-[44px] min-w-[44px] px-4 py-3
      rounded-lg font-medium transition-colors
      bg-blue-500 hover:bg-blue-600 text-white
      active:bg-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${className}
    `}
    {...props}
  />
));

TouchFriendlyButton.displayName = 'TouchFriendlyButton';

/**
 * PR #36: Responsive typography
 */
export const responsiveText = {
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
  h3: 'text-lg sm:text-xl md:text-2xl font-semibold',
  body: 'text-sm sm:text-base md:text-lg',
  small: 'text-xs sm:text-sm',
};

/**
 * PR #37: Mobile form optimization
 */
export const MobileFormField: React.FC<{
  label: string;
  children: React.ReactElement;
  error?: string;
}> = ({ label, children, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    {React.cloneElement(children, {
      className: `
        w-full px-4 py-3 text-base rounded-lg border
        bg-gray-900 text-white border-gray-700
        focus:border-blue-500 focus:outline-none
      `,
    })}
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </div>
);
