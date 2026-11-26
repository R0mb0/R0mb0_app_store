import { StoreApp } from '@/types/repo';
import { extractThumbnailFromReadme } from './readmeParser';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const IMAGE_FOLDER_REGEX =
  /^(readme[_-]?)?(imgs?|im[ag]{2}es?|screenshots?|previews?|media|assets)$/i;
const RASTER_EXT_REGEX = /\.(png|jpe?g|webp|gif)$/i;
const BADGE_NAME_REGEX = /(badge|shield|status|license|workflow|sponsor)/i;

const REPOS_QUERY = `
  query GetUserRepos($username: String!, $cursor: String) {
    user(login: $username) {
      repositories(
        first: 30
        after: $cursor
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          description
          url
          homepageUrl
          stargazerCount
          updatedAt
          isFork
          isArchived
          defaultBranchRef {
            name
          }
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
              color
            }
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
          rootTree: object(expression: "HEAD:") {
            ... on Tree {
              entries {
                name
                type
              }
            }
          }
          readmeUpper: object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
          readmeLower: object(expression: "HEAD:readme.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;

interface GraphQLRepoNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  updatedAt: string;
  isFork: boolean;
  isArchived: boolean;
  defaultBranchRef: { name: string } | null;
  primaryLanguage: { name: string; color: string } | null;
  languages: {
    nodes: Array<{ name: string; color: string | null }>;
  } | null;
  repositoryTopics: {
    nodes: Array<{ topic: { name: string } }>;
  };
  rootTree: {
    entries?: Array<{ name: string; type: string }>;
  } | null;
  readmeUpper: { text?: string } | null;
  readmeLower: { text?: string } | null;
}

interface GraphQLResponse {
  data?: {
    user?: {
      repositories?: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        nodes: GraphQLRepoNode[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

async function fetchFirstImageFromFolder(
  username: string,
  repoName: string,
  branch: string,
  folderName: string,
  token: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${encodeURIComponent(
        folderName
      )}?ref=${encodeURIComponent(branch)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const files: Array<{ name: string; type: string; download_url?: string }> =
      await res.json();

    if (!Array.isArray(files)) return null;

    const firstImg = files.find(
      (f) =>
        f.type === 'file' &&
        RASTER_EXT_REGEX.test(f.name) &&
        !BADGE_NAME_REGEX.test(f.name)
    );

    if (!firstImg) return null;
    return (
      firstImg.download_url ||
      `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/${encodeURIComponent(
        folderName
      )}/${encodeURIComponent(firstImg.name)}`
    );
  } catch {
    return null;
  }
}

export async function fetchGitHubCatalog(): Promise<StoreApp[]> {
  const username = process.env.GITHUB_USERNAME || 'R0mb0';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('Variabile GITHUB_TOKEN mancante');
  }

  const rawNodes: GraphQLRepoNode[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response: Response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: REPOS_QUERY,
        variables: { username, cursor },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Errore GitHub API: ${response.status} ${response.statusText}`);
    }

    const json: GraphQLResponse = await response.json();

    if (json.errors) {
      throw new Error(`Errore GraphQL: ${json.errors[0]?.message}`);
    }

    const reposData = json.data?.user?.repositories;
    if (!reposData) break;

    for (const node of reposData.nodes) {
      if (
        node.isFork ||
        node.isArchived ||
        node.name.toLowerCase() === username.toLowerCase()
      ) {
        continue;
      }
      rawNodes.push(node);
    }

    hasNextPage = reposData.pageInfo.hasNextPage;
    cursor = reposData.pageInfo.endCursor;
  }

  // Costruisce le app e risolve le cartelle immagini in parallelo solo dove serve
  const allApps = await Promise.all(
    rawNodes.map(async (node): Promise<StoreApp> => {
      const defaultBranch = node.defaultBranchRef?.name || 'main';
      const readme = node.readmeUpper?.text || node.readmeLower?.text || '';
      const topics = node.repositoryTopics.nodes.map((t) =>
        t.topic.name.toLowerCase()
      );

      let thumbnail = extractThumbnailFromReadme(
        readme,
        username,
        node.name,
        defaultBranch
      );

      if (!thumbnail && node.rootTree?.entries) {
        const imageFolder = node.rootTree.entries
          .filter((e) => e.type === 'tree' && IMAGE_FOLDER_REGEX.test(e.name))
          .sort((a, b) => (/readme/i.test(a.name) ? -1 : /readme/i.test(b.name) ? 1 : 0))[0];

        if (imageFolder) {
          thumbnail = await fetchFirstImageFromFolder(
            username,
            node.name,
            defaultBranch,
            imageFolder.name,
            token
          );
        }
      }

      const languages = (node.languages?.nodes || []).map((l) => ({
        name: l.name,
        color: l.color || '#64748b',
      }));

      return {
        id: node.id,
        name: node.name,
        description: node.description || '',
        repoUrl: node.url,
        liveUrl:
          node.homepageUrl && node.homepageUrl.trim() !== ''
            ? node.homepageUrl
            : null,
        stars: node.stargazerCount,
        updatedAt: node.updatedAt,
        defaultBranch,
        language: node.primaryLanguage,
        languages,
        topics,
        thumbnail,
        readme,
      };
    })
  );

  return allApps;
}