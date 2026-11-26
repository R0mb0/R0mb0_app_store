'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { useTranslation } from './LanguageProvider';

export function LanguageSelector() {
  const { locale, preference, setPreference, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Language"
        className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 backdrop-blur-md border border-zinc-300/50 dark:border-zinc-700/50 text-xs font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-100 transition-colors"
      >
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>{preference === 'auto' ? `${t.languageAuto} (${locale})` : locale}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-40"
          >
            {/* Opzione Automatica */}
            <button
              onClick={() => {
                setPreference('auto');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                preference === 'auto'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{t.languageAuto} (Browser)</span>
              {preference === 'auto' && <Check className="w-3.5 h-3.5" />}
            </button>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

            {/* 6 Lingue Europee */}
            {SUPPORTED_LOCALES.map((item) => {
              const active = preference === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setPreference(item.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400">{item.short}</span>
                    {active && <Check className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}