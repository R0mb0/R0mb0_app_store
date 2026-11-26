'use client';

import { StoreApp } from '@/types/repo';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code2, Star, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { useEffect } from 'react';
import { useTranslation } from './LanguageProvider';

interface AppModalProps {
  app: StoreApp | null;
  onClose: () => void;
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'picture', 'source'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'align', 'className'],
    img: [
      ...(defaultSchema.attributes?.img || []),
      'src',
      'alt',
      'width',
      'height',
      'loading',
    ],
    source: ['srcSet', 'media', 'type'],
    a: [...(defaultSchema.attributes?.a || []), 'href', 'target', 'rel'],
  },
};

function resolveAssetUrl(
  rawUrl: string | undefined,
  owner: string,
  repo: string,
  branch: string
): string | undefined {
  if (!rawUrl) return undefined;
  const trimmed = rawUrl.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('github.com/') && trimmed.includes('/blob/')) {
      return trimmed
        .replace('github.com/', 'raw.githubusercontent.com/')
        .replace('/blob/', '/');
    }
    return trimmed;
  }

  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^(\.\/|\/)/, '');
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
}

function resolveLinkUrl(
  rawUrl: string | undefined,
  owner: string,
  repo: string,
  branch: string
): string | undefined {
  if (!rawUrl) return undefined;
  const trimmed = rawUrl.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^(\.\/|\/)/, '');
  return `https://github.com/${owner}/${repo}/blob/${branch}/${cleanPath}`;
}

export function AppModal({ app, onClose }: AppModalProps) {
  const { locale, t } = useTranslation();

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

  const ownerMatch = app?.repoUrl.match(/github\.com\/([^/]+)\//i);
  const owner = ownerMatch?.[1] || 'R0mb0';
  const branch = app?.defaultBranch || 'main';

  return (
    <AnimatePresence>
      {app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-3xl max-h-[88vh] rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Pulsante di chiusura sempre visibile in alto a destra */}
            <button
              onClick={onClose}
              aria-label={t.close}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/85 dark:bg-zinc-900/85 text-zinc-700 dark:text-zinc-200 hover:scale-105 transition-transform backdrop-blur-md shadow-sm border border-zinc-200/50 dark:border-zinc-700/50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Contenitore scrollabile unico: banner + intestazione + README */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="relative h-52 sm:h-60 bg-gradient-to-br from-blue-600/15 via-indigo-500/15 to-purple-500/15">
                {app.thumbnail && (
                  <img
                    src={app.thumbnail}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-black/20" />
              </div>

              <div className="px-6 sm:px-8 pt-4 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
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
                        {new Date(app.updatedAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <a
                      href={app.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Code2 className="w-4 h-4" />
                      {t.codeButton}
                    </a>
                    {app.liveUrl && (
                      <a
                        href={app.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                      >
                        {t.openToolButton}
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

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                    {t.readmeHeading}
                  </h3>
                  {app.readme ? (
                    <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed [&_div[align='center']]:text-center [&_div[align='center']]:flex [&_div[align='center']]:flex-col [&_div[align='center']]:items-center [&_div[align='center']]:gap-2 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-5 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-zinc-200 dark:[&_h2]:border-zinc-800 [&_h3]:font-semibold [&_h3]:mt-4 [&_p]:my-2 [&_hr]:my-5 [&_hr]:border-zinc-200 dark:[&_hr]:border-zinc-800 [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-800 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-zinc-100 dark:[&_pre]:bg-zinc-950 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-500 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-zinc-200 dark:[&_th]:border-zinc-800 [&_th]:p-2 [&_th]:bg-zinc-50 dark:[&_th]:bg-zinc-800/50 [&_td]:border [&_td]:border-zinc-200 dark:[&_td]:border-zinc-800 [&_td]:p-2 [&_img]:inline-block [&_img]:rounded-xl [&_img]:my-1 [&_img]:max-w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                        components={{
                          img: ({ node: _node, src, alt, ...props }) => (
                            <img
                              {...props}
                              src={resolveAssetUrl(
                                typeof src === 'string' ? src : undefined,
                                owner,
                                app.name,
                                branch
                              )}
                              alt={alt || ''}
                              loading="lazy"
                            />
                          ),
                          source: ({ node: _node, srcSet, ...props }) => (
                            <source
                              {...props}
                              srcSet={resolveAssetUrl(
                                typeof srcSet === 'string' ? srcSet : undefined,
                                owner,
                                app.name,
                                branch
                              )}
                            />
                          ),
                          a: ({ node: _node, href, children, ...props }) => (
                            <a
                              {...props}
                              href={resolveLinkUrl(
                                typeof href === 'string' ? href : undefined,
                                owner,
                                app.name,
                                branch
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {app.readme}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">{t.noReadme}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}