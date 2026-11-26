'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from './LanguageProvider';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
}

export function SearchBar({ value, onChange, totalResults }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full pl-12 pr-24 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm sm:text-base placeholder:text-zinc-400"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          {totalResults}
        </span>
        {value && (
          <button
            onClick={() => onChange('')}
            aria-label={t.clearSearch}
            className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}