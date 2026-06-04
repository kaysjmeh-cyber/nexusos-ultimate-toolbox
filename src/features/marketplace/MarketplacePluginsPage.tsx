import { pluginRegistry } from '@plugins/registry/plugin-registry';

/** Marketplace plugins — catalogue distant (non connecté) */
export function MarketplacePluginsPage() {
  const plugins = pluginRegistry.list();
  return (
    <section className="nx-page">
      <h1>Marketplace — Plugins</h1>
      <p className="nx-muted">{plugins.length} plugins enregistrés localement</p>
    </section>
  );
}
