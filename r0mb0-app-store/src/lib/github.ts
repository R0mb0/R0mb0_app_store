import { StoreApp } from '@/types/repo';
import { extractThumbnailFromReadme } from './readmeParser';

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
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
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
  repositoryTopics: {
    nodes: Array<{ topic: { name: string } }>;
  };
  readmeUpper: { text?: string } | null;
  readmeLower: { text?: string } | null;
}

export async function fetchGitHubCatalog(): Promise<StoreApp[]> {
  const username = process.env.GITHUB_USERNAME || 'R0mb0';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('Variabile GITHUB_TOKEN mancante in .env.local');
  }

  const allApps: StoreApp[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: REPOS_QUERY,
        variables: { username, cursor },
      }),
      // Cache lato server Next.js: 1 ora
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Errore GitHub API: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(`Errore GraphQL: ${json.errors[0]?.message}`);
    }

    const reposData = json.data?.user?.repositories;
    if (!reposData) break;

    for (const node of reposData.nodes as GraphQLRepoNode[]) {
      // Salta fork, repo archiviate e la repo del profilo stesso (es. R0mb0/R0mb0)
      if (node.isFork || node.isArchived || node.name.toLowerCase() === username.toLowerCase()) {
        continue;
      }

      const defaultBranch = node.defaultBranchRef?.name || 'main';
      const readme = node.readmeUpper?.text || node.readmeLower?.text || '';
      const topics = node.repositoryTopics.nodes.map((t) => t.topic.name.toLowerCase());
      const thumbnail = extractThumbnailFromReadme(readme, username, node.name, defaultBranch);

      allApps.push({
        id: node.id,
        name: node.name,
        description: node.description || '',
        repoUrl: node.url,
        liveUrl: node.homepageUrl && node.homepageUrl.trim() !== '' ? node.homepageUrl : null,
        stars: node.stargazerCount,
        updatedAt: node.updatedAt,
        defaultBranch,
        language: node.primaryLanguage,
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