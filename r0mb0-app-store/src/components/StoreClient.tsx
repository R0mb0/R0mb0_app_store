'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { CatalogResponse, StoreApp } from '@/types/repo';
import {
  buildCategoryTrunk,
  buildLanguageList,
  buildSubTagBranches,
  getAppCategories,
  WEB_TRIO_LANGUAGES,
} from '@/lib/categorizer';
import { useTranslation } from './LanguageProvider';
import { LoadingScreen } from './LoadingScreen';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { TagTree } from './TagTree';
import { AppCard } from './AppCard';
import { AppModal } from './AppModal';
import { LayoutGrid, RefreshCw, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export function StoreClient() {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const loadCatalog = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) throw new Error('API Error');
      const data: CatalogResponse = await res.json();
      setCatalog(data);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const apps = useMemo(() => catalog?.apps ?? [], [catalog]);
  const categories = useMemo(() => buildCategoryTrunk(apps), [apps]);
  const languages = useMemo(() => buildLanguageList(apps), [apps]);

  const webTrioCount = useMemo(() => {
    return apps.filter((app) => {
      const names = app.languages?.map((l) => l.name) || (app.language ? [app.language.name] : []);
      return names.some((n) => WEB_TRIO_LANGUAGES.includes(n));
    }).length;
  }, [apps]);

  const treeFilteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (selectedCategory && !getAppCategories(app).includes(selectedCategory)) {
        return false;
      }
      if (selectedLanguages.length > 0) {
        const appLangNames =
          app.languages && app.languages.length > 0
            ? app.languages.map((l) => l.name)
            : app.language
            ? [app.language.name]
            : [];
        const matchesLang = selectedLanguages.some((sel) =>
          appLangNames.includes(sel)
        );
        if (!matchesLang) return false;
      }
      if (selectedTags.length > 0) {
        return selectedTags.every((tag) => app.topics.includes(tag));
      }
      return true;
    });
  }, [apps, selectedCategory, selectedLanguages, selectedTags]);

  const subTags = useMemo(
    () => buildSubTagBranches(treeFilteredApps, selectedTags),
    [treeFilteredApps, selectedTags]
  );

  const fuse = useMemo(() => {
    return new Fuse(treeFilteredApps, {
      keys: [
        { name: 'name', weight: 0.45 },
        { name: 'topics', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'readme', weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [treeFilteredApps]);

  const visibleApps = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return treeFilteredApps;
    return fuse.search(trimmed).map((res) => res.item);
  }, [query, treeFilteredApps, fuse]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleToggleWebTrio = () => {
    const isAlreadyWebTrio =
      WEB_TRIO_LANGUAGES.every((l) => selectedLanguages.includes(l)) &&
      selectedLanguages.length === WEB_TRIO_LANGUAGES.length;

    setSelectedLanguages(isAlreadyWebTrio ? [] : [...WEB_TRIO_LANGUAGES]);
  };

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategory(id);
    setSelectedTags([]);
  };

  const handleCloseModal = useCallback(() => setSelectedApp(null), []);

  const handleResetAll = () => {
    setQuery('');
    setSelectedCategory(null);
    setSelectedLanguages([]);
    setSelectedTags([]);
  };

  if (loading) return <LoadingScreen />;

  if (hasError || !catalog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-medium mb-4">{t.loadError}</p>
        <button
          onClick={loadCatalog}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h1 className="font-bold text-base sm:text-lg leading-none tracking-tight truncate">
                {catalog.username} Store
              </h1>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {catalog.totalCount} {t.projectsAvailable}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          totalResults={visibleApps.length}
        />

        <TagTree
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          languages={languages}
          selectedLanguages={selectedLanguages}
          onToggleLanguage={handleToggleLanguage}
          onToggleWebTrio={handleToggleWebTrio}
          webTrioCount={webTrioCount}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          subTags={subTags}
          onResetAll={handleResetAll}
        />

        {visibleApps.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                onSelect={setSelectedApp}
              />
            ))}
          </motion.div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <SearchX className="w-12 h-12 text-zinc-400 mb-3" />
            <h3 className="text-lg font-bold">{t.emptyTitle}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
              {t.emptySubtitle}
            </p>
            <button
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {t.showAllButton}
            </button>
          </div>
        )}
      </main>

      <AppModal app={selectedApp} onClose={handleCloseModal} />
    </div>
  );
}