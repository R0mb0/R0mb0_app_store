'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from './LanguageProvider';

export function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex items-center justify-center mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-[2px] shadow-xl shadow-blue-500/20"
        >
          <div className="w-full h-full rounded-[22px] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-2xl font-bold tracking-tight text-center"
      >
        {t.loadingTitle}
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm"
      >
        {t.loadingSubtitle}
      </motion.p>

      <div className="mt-8 w-56 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1/2 h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
        />
      </div>
    </div>
  );
}