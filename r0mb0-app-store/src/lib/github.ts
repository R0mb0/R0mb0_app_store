import { StoreApp } from '@/types/repo';
import {
  extractThumbnailFromReadme,
  extractThumbnailFromRepoTree,
  RepoTreeEntry,
} from './readmeParser';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const REPOS_QUERY = `
  query GetUserRepos($username: String!, $cursor: String) {
    user(login: $username) {
      repositories(
        first: 50
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
                object {
                  ... on Tree {
                    entries {
                      name
                      type
                    }
                  }
                }
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
    entries?: RepoTreeEntry[];
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

export async function fetchGitHubCatalog(): Promise<StoreApp[]> {
  const username = process.env.GITHUB_USERNAME || 'R0mb0';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('Variabile GITHUB_TOKEN mancante');
  }

  const allApps: StoreApp[] = [];
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

      const defaultBranch = node.defaultBranchRef?.name || 'main';
      const readme = node.readmeUpper?.text || node.readmeLower?.text || '';
      const topics = node.repositoryTopics.nodes.map((t) =>
        t.topic.name.toLowerCase()
      );

      // 1. Prima cerca nel README (escludendo i badge)
      // 2. Se non trova nulla, cerca nelle cartelle readme_imgs / Readme_images / images
      const thumbnail =
        extractThumbnailFromReadme(readme, username, node.name, defaultBranch) ||
        extractThumbnailFromRepoTree(
          node.rootTree?.entries,
          username,
          node.name,
          defaultBranch
        );

      const languages = (node.languages?.nodes || []).map((l) => ({
        name: l.name,
        color: l.color || '#64748b',
      }));

      allApps.push({
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
      });
    }

    hasNextPage = reposData.pageInfo.hasNextPage;
    cursor = reposData.pageInfo.endCursor;
  }

  return allApps;
}