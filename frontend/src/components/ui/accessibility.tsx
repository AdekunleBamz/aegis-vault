'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// KEYBOARD SHORTCUTS PROVIDER
// =============================================================================

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
}

const KeyboardShortcutsContext = React.createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = React.useContext(KeyboardShortcutsContext);
  if (!context) throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
  shortcuts?: Shortcut[];
}

export function KeyboardShortcutsProvider({ children, shortcuts: initialShortcuts = [] }: KeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(initialShortcuts);

  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts(prev => [...prev.filter(s => s.key !== shortcut.key), shortcut]);
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <KeyboardShortcutsContext.Provider value={{ shortcuts, registerShortcut, unregisterShortcut }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

// =============================================================================
// USE SHORTCUT HOOK
// =============================================================================

export function useShortcut(shortcut: Shortcut) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    registerShortcut(shortcut);
    return () => unregisterShortcut(shortcut.key);
  }, [shortcut, registerShortcut, unregisterShortcut]);
}

// =============================================================================
// KEYBOARD SHORTCUTS DISPLAY
// =============================================================================

interface KeyboardShortcutsDisplayProps {
  className?: string;
}

export function KeyboardShortcutsDisplay({ className = '' }: KeyboardShortcutsDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  // Open with ? key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatKey = (shortcut: Shortcut) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`} onClick={() => setIsOpen(false)}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.filter(s => s.description).map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-zinc-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm font-mono text-zinc-400">
                {formatKey(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500">Press ? to toggle this dialog</p>
      </div>
    </div>
  );
}

// =============================================================================
// KEYBOARD HINT
// =============================================================================

interface KeyboardHintProps {
  keys: string[];
  className?: string;
}

export function KeyboardHint({ keys, className = '' }: KeyboardHintProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-400">
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="text-zinc-600 text-xs">+</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// =============================================================================
// FOCUS TRAP
// =============================================================================

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function FocusTrap({ children, active = true, className = '' }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// =============================================================================
// SKIP LINK
// =============================================================================

interface SkipLinkProps {
  targetId: string;
  label?: string;
  className?: string;
}

export function SkipLink({ targetId, label = 'Skip to main content', className = '' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
        focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:rounded-lg
        focus:font-medium focus:outline-none
        ${className}
      `}
    >
      {label}
    </a>
  );
}

// =============================================================================
// LIVE REGION (ANNOUNCER)
// =============================================================================

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  className?: string;
}

export function LiveRegion({ message, politeness = 'polite', className = '' }: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Clear and re-set to ensure screen readers pick up repeated messages
    setAnnouncement('');
    const timeout = setTimeout(() => setAnnouncement(message), 100);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {announcement}
    </div>
  );
}

// =============================================================================
// ACCESSIBLE ICON BUTTON
// =============================================================================

interface AccessibleIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AccessibleIconButton({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
}: AccessibleIconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        bg-zinc-800 hover:bg-zinc-700 
        border border-zinc-700 rounded-lg
        text-zinc-400 hover:text-zinc-200
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900
        ${className}
      `}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </button>
  );
}

// =============================================================================
// VISUALLY HIDDEN
// =============================================================================

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}
