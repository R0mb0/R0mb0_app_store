'use client';

import { StoreApp } from '@/types/repo';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Star, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect } from 'react';

interface AppModalProps {
  app: StoreApp | null;
  onClose: () => void;
}

export function AppModal({ app, onClose }: AppModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (app) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [app, onClose]);

  return (
    <AnimatePresence>
      {app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Sfondo sfocato */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Finestra Modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-3xl max-h-[88vh] rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header con immagine */}
            <div className="relative h-52 sm:h-60 bg-gradient-to-br from-blue-600/15 via-indigo-500/15 to-purple-500/15 shrink-0">
              {app.thumbnail && (
                <img
                  src={app.thumbnail}
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-black/20" />

              <button
                onClick={onClose}
                aria-label="Chiudi"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/85 dark:bg-zinc-900/85 text-zinc-700 dark:text-zinc-200 hover:scale-105 transition-transform backdrop-blur-md shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo scorrevole */}
            <div className="px-6 sm:px-8 pb-6 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 relative z-10 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {app.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {app.language && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: app.language.color }}
                        />
                        {app.language.name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {app.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Pulsanti di azione */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={app.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Codice
                  </a>
                  {app.liveUrl && (
                    <a
                      href={app.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                    >
                      Vai allo strumento
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {app.description && (
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-5">
                  {app.description}
                </p>
              )}

              {/* Tag */}
              {app.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {app.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Approfondimento dal README */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                  Approfondimento (README)
                </h3>
                {app.readme ? (
                  <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h3]:font-semibold [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-800 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-zinc-100 dark:[&_pre]:bg-zinc-950 [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-5 [&_img]:rounded-2xl [&_img]:my-3 [&_img]:max-w-full">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {app.readme}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">
                    Nessun file README trovato per questa repository.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}