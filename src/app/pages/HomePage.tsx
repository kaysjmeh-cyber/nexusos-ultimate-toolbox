/**
 * Page d'accueil — hub navigation (aucun outil).
 */
export function HomePage() {
  return (
    <section className="nx-page">
      <h1>NexusOS Ultimate Toolbox</h1>
      <p className="nx-muted">
        Fondations chargées — {import.meta.env.MODE}. Les modules seront activés
        dans une phase ultérieure.
      </p>
    </section>
  );
}
