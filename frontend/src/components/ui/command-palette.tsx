'use client';

import React, { useState, useRef, useCallback } from 'react';

// =============================================================================
// COMMAND PALETTE
// =============================================================================

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
}

export function CommandPalette({
  commands,
  isOpen,
  onClose,
  placeholder = 'Type a command or search...',
  className = '',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    const category = cmd.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
          setQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        setQuery('');
        break;
    }
  }, [filteredCommands, selectedIndex, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let currentIndex = -1;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 ${className}`} onClick={onClose}>
      <div
        className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-zinc-700">
          <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-4 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500"
          />
          <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-500">
            esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500">No commands found</div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  {category}
                </div>
                {cmds.map(cmd => {
                  currentIndex++;
                  const isSelected = currentIndex === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                        setQuery('');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                      }`}
                    >
                      {cmd.icon && <span className="w-5 h-5 text-zinc-400">{cmd.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <div className="text-zinc-100 font-medium">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-sm text-zinc-500 truncate">{cmd.description}</div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <div className="flex items-center gap-1">
                          {cmd.shortcut.map((key, i) => (
                            <React.Fragment key={key}>
                              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-500">
                                {key}
                              </kbd>
                              {i < cmd.shortcut!.length - 1 && <span className="text-zinc-600">+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SEARCH INPUT WITH SUGGESTIONS
// =============================================================================

interface Suggestion {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
  suggestions?: Suggestion[];
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  showRecentSearches?: boolean;
  recentSearches?: string[];
  onClearRecent?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onSelect,
  suggestions = [],
  placeholder = 'Search...',
  isLoading = false,
  className = '',
  showRecentSearches = false,
  recentSearches = [],
  onClearRecent,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onSelect?.(suggestions[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {value && !isLoading && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || (showRecentSearches && recentSearches.length > 0 && !value)) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
          {!value && showRecentSearches && recentSearches.length > 0 && (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Recent Searches</span>
                {onClearRecent && (
                  <button onClick={onClearRecent} className="text-xs text-zinc-500 hover:text-zinc-300">
                    Clear
                  </button>
                )}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => onChange(search)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-700 text-zinc-300"
                >
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {search}
                </button>
              ))}
            </>
          )}

          {value && suggestions.length > 0 && (
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    onSelect?.(suggestion);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                    index === selectedIndex ? 'bg-zinc-700' : 'hover:bg-zinc-700'
                  }`}
                >
                  {suggestion.icon && <span className="w-5 h-5 text-zinc-400">{suggestion.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="text-zinc-100">{suggestion.label}</div>
                    {suggestion.description && (
                      <div className="text-sm text-zinc-500 truncate">{suggestion.description}</div>
                    )}
                  </div>
                  {suggestion.category && (
                    <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
                      {suggestion.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// QUICK ACTION BUTTON
// =============================================================================

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className = '' }: QuickActionsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.action}
          title={action.label}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span className="w-5 h-5 block">{action.icon}</span>
        </button>
      ))}
    </div>
  );
}
