export type Locale = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt';
export type LanguagePreference = 'auto' | Locale;

export const SUPPORTED_LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'pt', label: 'Português', short: 'PT' },
];

export interface Dictionary {
  languagesLabel: string;
  webTrioLabel: string;
  languageAuto: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
  loadingTitle: string;
  loadingSubtitle: string;
  projectsAvailable: string;
  loadError: string;
  retry: string;
  searchPlaceholder: string;
  clearSearch: string;
  categoriesTrunk: string;
  resetFilters: string;
  allCategories: string;
  activePath: string;
  refineSubtopics: string;
  popularTags: string;
  noDescription: string;
  close: string;
  codeButton: string;
  openToolButton: string;
  readmeHeading: string;
  noReadme: string;
  emptyTitle: string;
  emptySubtitle: string;
  showAllButton: string;
  categories: Record<string, string>;
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    languagesLabel: 'Languages & Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Light',
    themeDark: 'Dark',
    loadingTitle: 'Syncing App Store',
    loadingSubtitle: 'Analyzing repositories, parsing README previews, and building categories...',
    projectsAvailable: 'projects available',
    loadError: 'Unable to load catalog from GitHub',
    retry: 'Retry',
    searchPlaceholder: 'Search tools, tags, PDF, converters... (press /)',
    clearSearch: 'Clear search',
    categoriesTrunk: 'Categories (Trunk)',
    resetFilters: 'Reset filters',
    allCategories: 'All',
    activePath: 'Path:',
    refineSubtopics: 'Refine by subtopic (Branches):',
    popularTags: 'Popular tags:',
    noDescription: 'No description available for this project.',
    close: 'Close',
    codeButton: 'Code',
    openToolButton: 'Open Tool',
    readmeHeading: 'Overview (README)',
    noReadme: 'No README file found for this repository.',
    emptyTitle: 'No projects found',
    emptySubtitle: 'Try changing your keywords or removing a filter from the tag tree.',
    showAllButton: 'Show all projects',
    categories: {
      pdf: 'PDF',
      media: 'Images & Media',
      dev: 'Developer & Code',
      text: 'Text & Documents',
      web: 'Web & Network',
      utility: 'Utilities & Productivity',
      other: 'Other',
    },
  },
  it: {
    languagesLabel: 'Linguaggi & Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',
    loadingTitle: 'Sincronizzazione dello Store',
    loadingSubtitle: 'Analisi delle repository, estrazione dei README e preparazione delle categorie...',
    projectsAvailable: 'progetti disponibili',
    loadError: 'Impossibile caricare il catalogo da GitHub',
    retry: 'Riprova',
    searchPlaceholder: 'Cerca strumenti, tag, PDF, convertitori... (premi /)',
    clearSearch: 'Cancella ricerca',
    categoriesTrunk: 'Categorie (Tronco)',
    resetFilters: 'Reimposta filtri',
    allCategories: 'Tutti',
    activePath: 'Percorso:',
    refineSubtopics: 'Raffina per sottotema (Rami):',
    popularTags: 'Tag popolari:',
    noDescription: 'Nessuna descrizione disponibile per questo progetto.',
    close: 'Chiudi',
    codeButton: 'Codice',
    openToolButton: 'Vai allo strumento',
    readmeHeading: 'Approfondimento (README)',
    noReadme: 'Nessun file README trovato per questa repository.',
    emptyTitle: 'Nessun progetto trovato',
    emptySubtitle: "Prova a cambiare parola chiave o a rimuovere qualche filtro dall'albero.",
    showAllButton: 'Mostra tutti i progetti',
    categories: {
      pdf: 'PDF',
      media: 'Immagini & Media',
      dev: 'Sviluppo & Codice',
      text: 'Testo & Documenti',
      web: 'Web & Rete',
      utility: 'Utility & Produttività',
      other: 'Altro',
    },
  },
  es: {
    languagesLabel: 'Lenguajes y Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    loadingTitle: 'Sincronizando la Tienda',
    loadingSubtitle: 'Analizando repositorios, extrayendo vistas previas y creando categorías...',
    projectsAvailable: 'proyectos disponibles',
    loadError: 'No se pudo cargar el catálogo desde GitHub',
    retry: 'Reintentar',
    searchPlaceholder: 'Buscar herramientas, etiquetas, PDF, conversores... (pulsa /)',
    clearSearch: 'Borrar búsqueda',
    categoriesTrunk: 'Categorías (Tronco)',
    resetFilters: 'Restablecer filtros',
    allCategories: 'Todos',
    activePath: 'Ruta:',
    refineSubtopics: 'Refinar por subtema (Ramas):',
    popularTags: 'Etiquetas populares:',
    noDescription: 'No hay descripción disponible para este proyecto.',
    close: 'Cerrar',
    codeButton: 'Código',
    openToolButton: 'Ir a la herramienta',
    readmeHeading: 'Detalles (README)',
    noReadme: 'No se encontró ningún archivo README para este repositorio.',
    emptyTitle: 'No se encontraron proyectos',
    emptySubtitle: 'Prueba a cambiar las palabras clave o quitar algún filtro del árbol.',
    showAllButton: 'Mostrar todos los proyectos',
    categories: {
      pdf: 'PDF',
      media: 'Imágenes y Multimedia',
      dev: 'Desarrollo y Código',
      text: 'Texto y Documentos',
      web: 'Web y Red',
      utility: 'Utilidades y Productividad',
      other: 'Otros',
    },
  },
  fr: {
    languagesLabel: 'Langages & Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    loadingTitle: 'Synchronisation du Store',
    loadingSubtitle: 'Analyse des dépôts, extraction des aperçus README et création des catégories...',
    projectsAvailable: 'projets disponibles',
    loadError: 'Impossible de charger le catalogue depuis GitHub',
    retry: 'Réessayer',
    searchPlaceholder: 'Rechercher des outils, tags, PDF, convertisseurs... (appuyez sur /)',
    clearSearch: 'Effacer la recherche',
    categoriesTrunk: 'Catégories (Tronc)',
    resetFilters: 'Réinitialiser les filtres',
    allCategories: 'Tous',
    activePath: 'Chemin :',
    refineSubtopics: 'Affiner par sous-thème (Branches) :',
    popularTags: 'Tags populaires :',
    noDescription: 'Aucune description disponible pour ce projet.',
    close: 'Fermer',
    codeButton: 'Code',
    openToolButton: "Ouvrir l'outil",
    readmeHeading: 'Présentation (README)',
    noReadme: 'Aucun fichier README trouvé pour ce dépôt.',
    emptyTitle: 'Aucun projet trouvé',
    emptySubtitle: "Essayez d'autres mots-clés ou supprimez un filtre de l'arborescence.",
    showAllButton: 'Afficher tous les projets',
    categories: {
      pdf: 'PDF',
      media: 'Images & Médias',
      dev: 'Développement & Code',
      text: 'Texte & Documents',
      web: 'Web & Réseau',
      utility: 'Utilitaires & Productivité',
      other: 'Autre',
    },
  },
  de: {
    languagesLabel: 'Sprachen & Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    loadingTitle: 'Store wird synchronisiert',
    loadingSubtitle: 'Repositories werden analysiert, READMEs ausgelesen und Kategorien erstellt...',
    projectsAvailable: 'Projekte verfügbar',
    loadError: 'Katalog konnte nicht von GitHub geladen werden',
    retry: 'Erneut versuchen',
    searchPlaceholder: 'Tools, Tags, PDF, Konverter suchen... (drücke /)',
    clearSearch: 'Suche löschen',
    categoriesTrunk: 'Kategorien (Stamm)',
    resetFilters: 'Filter zurücksetzen',
    allCategories: 'Alle',
    activePath: 'Pfad:',
    refineSubtopics: 'Nach Unterthema verfeinern (Äste):',
    popularTags: 'Beliebte Tags:',
    noDescription: 'Keine Beschreibung für dieses Projekt verfügbar.',
    close: 'Schließen',
    codeButton: 'Code',
    openToolButton: 'Tool öffnen',
    readmeHeading: 'Details (README)',
    noReadme: 'Keine README-Datei für dieses Repository gefunden.',
    emptyTitle: 'Keine Projekte gefunden',
    emptySubtitle: 'Versuche andere Suchbegriffe oder entferne einen Filter aus dem Baum.',
    showAllButton: 'Alle Projekte anzeigen',
    categories: {
      pdf: 'PDF',
      media: 'Bilder & Medien',
      dev: 'Entwicklung & Code',
      text: 'Text & Dokumente',
      web: 'Web & Netzwerk',
      utility: 'Dienstprogramme & Produktivität',
      other: 'Sonstiges',
    },
  },
  pt: {
    languagesLabel: 'Linguagens e Stack', webTrioLabel: 'HTML / CSS / JS',
    languageAuto: 'Auto',
    themeAuto: 'Auto',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    loadingTitle: 'Sincronizando a Loja',
    loadingSubtitle: 'Analisando repositórios, extraindo pré-visualizações e organizando categorias...',
    projectsAvailable: 'projetos disponíveis',
    loadError: 'Não foi possível carregar o catálogo do GitHub',
    retry: 'Tentar novamente',
    searchPlaceholder: 'Pesquisar ferramentas, tags, PDF, conversores... (prima /)',
    clearSearch: 'Limpar pesquisa',
    categoriesTrunk: 'Categorias (Tronco)',
    resetFilters: 'Repor filtros',
    allCategories: 'Todos',
    activePath: 'Caminho:',
    refineSubtopics: 'Refinar por subtema (Ramos):',
    popularTags: 'Tags populares:',
    noDescription: 'Sem descrição disponível para este projeto.',
    close: 'Fechar',
    codeButton: 'Código',
    openToolButton: 'Abrir ferramenta',
    readmeHeading: 'Detalhes (README)',
    noReadme: 'Nenhum ficheiro README encontrado para este repositório.',
    emptyTitle: 'Nenhum projeto encontrado',
    emptySubtitle: 'Experimente alterar as palavras-chave ou remover algum filtro da árvore.',
    showAllButton: 'Mostrar todos os projetos',
    categories: {
      pdf: 'PDF',
      media: 'Imagens e Multimédia',
      dev: 'Desenvolvimento e Código',
      text: 'Texto e Documentos',
      web: 'Web e Rede',
      utility: 'Utilitários e Produtividade',
      other: 'Outros',
    },
  },
};

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const raw of candidates) {
    const base = raw?.toLowerCase().split('-')[0] as Locale;
    if (base && base in DICTIONARIES) {
      return base;
    }
  }

  return 'en';
}