import { fetchGitHubCatalog } from '@/lib/github';

export default async function Home() {
  const apps = await fetchGitHubCatalog();

  // Calcola i 15 tag più frequenti per iniziare a vedere il "tronco" del tuo albero
  const tagCounts: Record<string, number> = {};
  apps.forEach((app) => {
    app.topics.forEach((topic) => {
      tagCounts[topic] = (tagCounts[topic] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-2">R0mb0 Store — Test Iterazione 1</h1>
      <p className="text-gray-500 mb-6">
        Repository trovate: <strong>{apps.length}</strong>
      </p>

      <section className="mb-8 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold mb-3">Top 15 Tag rilevati:</h2>
        <div className="flex flex-wrap gap-2">
          {topTags.map(([tag, count]) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag} ({count})
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.slice(0, 12).map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
          >
            <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              {app.thumbnail ? (
                <img
                  src={app.thumbnail}
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">Nessuna immagine nel README</span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg truncate">{app.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 mb-3">
                {app.description || 'Nessuna descrizione'}
              </p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {app.topics.slice(0, 4).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}