'use client';

import { StoreApp } from '@/types/repo';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Layers } from 'lucide-react';
import { useTranslation } from './LanguageProvider';

interface AppCardProps {
  app: StoreApp;
  onSelect: (app: StoreApp) => void;
  index: number;
}

export function AppCard({ app, onSelect, index }: AppCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(app)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(app);
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-shadow flex flex-col"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
        {app.thumbnail ? (
          <img
            src={app.thumbnail}
            alt={app.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
            <Layers className="w-10 h-10 text-blue-500/70 dark:text-blue-400/70 mb-2" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-4 truncate max-w-full">
              {app.name}
            </span>
          </div>
        )}

        {app.liveUrl && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-zinc-900/90 text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {app.name}
          </h3>
          {app.stars > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 shrink-0 mt-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              {app.stars}
            </span>
          )}
        </div>

        <p className="mt-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {app.description || t.noDescription}
        </p>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
            {app.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                #{topic}
              </span>
            ))}
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 shrink-0 transition-colors" />
        </div>
      </div>
    </motion.article>
  );
}