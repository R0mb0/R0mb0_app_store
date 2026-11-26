import { NextResponse } from 'next/server';
import { fetchGitHubCatalog } from '@/lib/github';
import { CatalogResponse } from '@/types/repo';

export const revalidate = 3600; // Rigenera al massimo ogni ora

export async function GET() {
  try {
    const apps = await fetchGitHubCatalog();
    const payload: CatalogResponse = {
      username: process.env.GITHUB_USERNAME || 'R0mb0',
      totalCount: apps.length,
      generatedAt: new Date().toISOString(),
      apps,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore sconosciuto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}