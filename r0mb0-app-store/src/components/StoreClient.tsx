'use client';

import { useEffect, useState } from 'react';
import { CatalogResponse, StoreApp } from '@/types/repo';
import { LoadingScreen } from './LoadingScreen';
import { ThemeToggle } from './ThemeToggle';
import { AppCard } from './AppCard';
import { AppModal } from './AppModal';
import { LayoutGrid, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function StoreClient() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) throw new Error('Impossibile caricare il catalogo da GitHub');
      const data: CatalogResponse = await res.json();
      setCatalog(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !catalog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={loadCatalog}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar arrotondata con effetto vetro */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">
                {catalog.username} Store
              </h1>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {catalog.totalCount} progetti disponibili
              </span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Griglia dei progetti */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {catalog.apps.map((app, index) => (
            <AppCard
              key={app.id}
              app={app}
              index={index}
              onSelect={setSelectedApp}
            />
          ))}
        </motion.div>
      </main>

      {/* Modale di approfondimento */}
      <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}