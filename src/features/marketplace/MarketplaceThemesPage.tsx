import { themeRegistry } from '@themes/registry/theme-registry';

/** Marketplace thèmes */
export function MarketplaceThemesPage() {
  const themes = themeRegistry.list();
  return (
    <section className="nx-page">
      <h1>Marketplace — Thèmes</h1>
      <ul>
        {themes.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </section>
  );
}
