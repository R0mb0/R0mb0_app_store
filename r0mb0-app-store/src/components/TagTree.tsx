'use client';

import { CategoryNode, TagCount } from '@/lib/categorizer';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FolderTree, RotateCcw, Tag, X } from 'lucide-react';
import { useTranslation } from './LanguageProvider';

interface TagTreeProps {
  categories: CategoryNode[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  subTags: TagCount[];
  onResetAll: () => void;
}

export function TagTree({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedTags,
  onToggleTag,
  subTags,
  onResetAll,
}: TagTreeProps) {
  const { t } = useTranslation();
  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  const getCategoryLabel = (id: string, fallback: string) =>
    t.categories[id] || fallback;

  const activeCategoryNode = categories.find((c) => c.id === selectedCategory);
  const activeCategoryLabel = activeCategoryNode
    ? getCategoryLabel(activeCategoryNode.id, activeCategoryNode.label)
    : null;

  return (
    <section className="rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Intestazione Tronco + Reset */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <FolderTree className="w-4 h-4 text-blue-500" />
          <span>{t.categoriesTrunk}</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.resetFilters}
          </button>
        )}
      </div>

      {/* Livello 1: Macro-categorie (Tronco) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedCategory === null
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
          }`}
        >
          {t.allCategories}
        </button>

        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(active ? null : cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              <span>{getCategoryLabel(cat.id, cat.label)}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-200/80 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Percorso attivo (Breadcrumb) */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs"
          >
            <span className="text-zinc-400 font-medium mr-1">{t.activePath}</span>
            {activeCategoryLabel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {activeCategoryLabel}
                <button onClick={() => onSelectCategory(null)} aria-label={t.close}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <div key={tag} className="inline-flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  #{tag}
                  <button onClick={() => onToggleTag(tag)} aria-label={t.close}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Livello 2+: Sotto-tag contestuali (Rami) */}
      {subTags.length > 0 && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {selectedCategory || selectedTags.length > 0
                ? t.refineSubtopics
                : t.popularTags}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {subTags.map(({ tag, count }) => (
              <motion.button
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onToggleTag(tag)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100/80 hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-800/80 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 text-zinc-600 dark:text-zinc-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <span>#{tag}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}