'use client';

import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-28 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />;
  }

  const options = [
    { id: 'system', icon: Monitor, label: 'Auto' },
    { id: 'light', icon: Sun, label: 'Chiaro' },
    { id: 'dark', icon: Moon, label: 'Scuro' },
  ] as const;

  return (
    <div className="inline-flex items-center p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-300/50 dark:border-zinc-700/50">
      {options.map(({ id, icon: Icon, label }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            title={label}
            aria-label={label}
            className={`relative p-2 rounded-full transition-colors ${
              active
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-zinc-700 shadow-sm"
              />
            )}
            <Icon className="relative z-10 w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}