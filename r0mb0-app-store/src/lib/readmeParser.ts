const IGNORED_DOMAINS = [
  'shields.io',
  'img.shields.io',
  'badge.fury.io',
  'badgen.net',
  'travis-ci.org',
  'github.com/workflows',
  'codecov.io',
  'sonarcloud.io',
  'komarev.com',
  'visitor-badge',
  'buymeacoffee.com',
  'ko-fi.com',
];

const BADGE_KEYWORDS = [
  'badge',
  'shield',
  'support_the_dev',
  'support-the-dev',
  'code_quality',
  'code-quality',
  'ready_for',
  'ready-for',
  'crafted_with',
  'crafted-with',
  'no_google',
  'no-google',
  'made_with',
  'made-with',
  'status',
  'license',
  'workflow',
  'coverage',
  'sponsor',
];

const RASTER_EXT_REGEX = /\.(png|jpe?g|webp|gif)(\?.*)?$/i;

function isBadgeOrInvalid(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.startsWith('data:')) return true;
  if (IGNORED_DOMAINS.some((domain) => lower.includes(domain))) return true;
  if (BADGE_KEYWORDS.some((kw) => lower.includes(kw))) return true;
  // I badge su GitHub sono quasi sempre .svg; gli screenshot reali sono raster (.png, .jpg, .webp, .gif)
  if (/\.svg(\?.*)?$/i.test(lower)) return true;
  return false;
}

function resolveImageUrl(
  rawUrl: string,
  username: string,
  repoName: string,
  branch: string
): string {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('github.com') && trimmed.includes('/blob/')) {
      return trimmed
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^(\.\/|\/)/, '');
  return `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/${cleanPath}`;
}

export function extractThumbnailFromReadme(
  readme: string,
  username: string,
  repoName: string,
  branch: string
): string | null {
  if (!readme) return null;

  const regex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(readme)) !== null) {
    const candidate = match[1] || match[2];
    if (candidate && !isBadgeOrInvalid(candidate)) {
      return resolveImageUrl(candidate, username, repoName, branch);
    }
  }

  return null;
}

export interface RepoTreeEntry {
  name: string;
  type: string;
  object?: {
    entries?: Array<{
      name: string;
      type: string;
    }>;
  } | null;
}

/** Cerca immagini nelle cartelle readme_imgs, Readme_images, readme_imgaes, images, screenshots, ecc. */
export function extractThumbnailFromRepoTree(
  entries: RepoTreeEntry[] | undefined,
  username: string,
  repoName: string,
  branch: string
): string | null {
  if (!entries || entries.length === 0) return null;

  const imageFolderRegex =
    /^(readme[_-]?)?(imgs?|im[ag]{2}es?|screenshots?|previews?|media|assets)$/i;

  // Priorità alle cartelle che contengono "readme" nel nome
  const sortedFolders = entries
    .filter((e) => e.type === 'tree' && imageFolderRegex.test(e.name))
    .sort((a, b) => {
      const aReadme = /readme/i.test(a.name) ? 0 : 1;
      const bReadme = /readme/i.test(b.name) ? 0 : 1;
      return aReadme - bReadme;
    });

  for (const folder of sortedFolders) {
    const files = folder.object?.entries || [];
    const firstImage = files.find(
      (f) =>
        f.type === 'blob' &&
        RASTER_EXT_REGEX.test(f.name) &&
        !isBadgeOrInvalid(f.name)
    );

    if (firstImage) {
      return `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/${encodeURIComponent(
        folder.name
      )}/${encodeURIComponent(firstImage.name)}`;
    }
  }

  return null;
}