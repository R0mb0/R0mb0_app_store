const IGNORED_IMAGE_DOMAINS = [
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

function isValidThumbnail(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.startsWith('data:')) return false;
  return !IGNORED_IMAGE_DOMAINS.some((domain) => lower.includes(domain));
}

function resolveImageUrl(
  rawUrl: string,
  username: string,
  repoName: string,
  branch: string
): string {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Converte link github.com/.../blob/... in raw.githubusercontent.com
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

  // Cerca sia immagini Markdown ![alt](url) sia tag HTML <img src="url">
  const regex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(readme)) !== null) {
    const candidate = match[1] || match[2];
    if (candidate && isValidThumbnail(candidate)) {
      return resolveImageUrl(candidate, username, repoName, branch);
    }
  }

  return null;
}