export interface RepoLanguage {
  name: string;
  color: string;
}

export interface StoreApp {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string | null;
  stars: number;
  updatedAt: string;
  defaultBranch: string;
  language: RepoLanguage | null;
  languages: RepoLanguage[];
  topics: string[];
  thumbnail: string | null;
  readme: string;
}

export interface CatalogResponse {
  username: string;
  totalCount: number;
  generatedAt: string;
  apps: StoreApp[];
}