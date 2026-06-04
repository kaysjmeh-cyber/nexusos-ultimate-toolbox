import { useState } from 'react';
import { globalSearchEngine } from '@core/search/global-search-engine';

/** Barre de recherche globale — résultats déclaratifs uniquement */
export function GlobalSearchBar() {
  const [q, setQ] = useState('');
  const results = globalSearchEngine.search({ q, limit: 8 });

  return (
    <div className="nx-global-search">
      <input
        type="search"
        placeholder="Recherche globale…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q && (
        <ul className="nx-search-results">
          {results.map((r) => (
            <li key={r.document.id}>{r.document.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
