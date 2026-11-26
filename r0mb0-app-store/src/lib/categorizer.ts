import { StoreApp } from '@/types/repo';

export interface CategoryRule {
  id: string;
  label: string;
  keywords: string[];
}

export const MACRO_CATEGORIES: CategoryRule[] = [
  {
    id: 'pdf',
    label: 'PDF',
    keywords: ['pdf', 'pdf-tools', 'pdf-merger', 'pdf-editor', 'pdf-converter', 'ocr'],
  },
  {
    id: 'media',
    label: 'Immagini & Media',
    keywords: ['image', 'images', 'photo', 'svg', 'png', 'jpg', 'webp', 'canvas', 'editor', 'color', 'video', 'audio', 'media', 'icon'],
  },
  {
    id: 'dev',
    label: 'Sviluppo & Codice',
    keywords: ['developer', 'devtools', 'code', 'json', 'yaml', 'regex', 'markdown', 'html', 'css', 'api', 'github', 'git', 'cli', 'formatter'],
  },
  {
    id: 'text',
    label: 'Testo & Documenti',
    keywords: ['text', 'document', 'docx', 'csv', 'excel', 'word', 'notes', 'writing', 'translator', 'diff', 'typography'],
  },
  {
    id: 'web',
    label: 'Web & Rete',
    keywords: ['web', 'url', 'qr', 'qrcode', 'network', 'seo', 'bookmark', 'link', 'pwa', 'browser', 'extension'],
  },
  {
    id: 'utility',
    label: 'Utility & Produttività',
    keywords: ['utility', 'utilities', 'tool', 'tools', 'converter', 'calculator', 'generator', 'timer', 'productivity', 'dashboard', 'calendar'],
  },
];

export interface CategoryNode {
  id: string;
  label: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

/** Restituisce gli ID delle macro-categorie a cui appartiene un'app */
export function getAppCategories(app: StoreApp): string[] {
  const haystack = [
    ...app.topics,
    app.name.toLowerCase(),
    app.description.toLowerCase(),
  ].join(' ');

  const matched = MACRO_CATEGORIES.filter((cat) =>
    cat.keywords.some((kw) => {
      // Match esatto nei topic oppure parola nel nome/descrizione
      if (app.topics.includes(kw)) return true;
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(haystack);
    })
  ).map((cat) => cat.id);

  return matched.length > 0 ? matched : ['other'];
}

/** Costruisce il "Tronco" (macro-categorie con almeno 1 progetto) */
export function buildCategoryTrunk(apps: StoreApp[]): CategoryNode[] {
  const counts: Record<string, number> = {};

  apps.forEach((app) => {
    const cats = getAppCategories(app);
    cats.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });

  const nodes: CategoryNode[] = MACRO_CATEGORIES.filter((c) => (counts[c.id] || 0) > 0).map((c) => ({
    id: c.id,
    label: c.label,
    count: counts[c.id],
  }));

  if (counts['other'] > 0) {
    nodes.push({ id: 'other', label: 'Altro', count: counts['other'] });
  }

  return nodes.sort((a, b) => b.count - a.count);
}

/** Costruisce i "Rami" (sotto-tag disponibili nel sottoinsieme filtrato) */
export function buildSubTagBranches(
  apps: StoreApp[],
  selectedTags: string[],
  limit = 18
): TagCount[] {
  const counts: Record<string, number> = {};
  const selectedSet = new Set(selectedTags);

  apps.forEach((app) => {
    app.topics.forEach((topic) => {
      if (!selectedSet.has(topic)) {
        counts[topic] = (counts[topic] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}