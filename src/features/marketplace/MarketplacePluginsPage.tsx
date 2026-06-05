import { useMemo } from 'react';
import { pluginRegistry } from '@plugins/registry/plugin-registry';
import { moduleRegistry } from '@modules/registry';

/** Marketplace plugins — catalogue local combinant plugins et modules */
export function MarketplacePluginsPage() {
  const plugins = useMemo(() => pluginRegistry.list(), []);
  const modules = useMemo(() => moduleRegistry.list(), []);

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Marketplace — Plugins</h1>
        <p className="nx-muted">{plugins.length + modules.length} éléments enregistrés localement</p>
      </div>

      <div className="nx-settings-panel">
        <h2>📦 Modules</h2>
        <p className="nx-muted">Modules de fonctionnalités intégrés à NexusOS</p>
        
        {modules.length === 0 ? (
          <p className="nx-muted">Aucun module disponible</p>
        ) : (
          <ul className="nx-module-list">
            {modules.map((module) => (
              <li key={module.id}>
                <div>
                  <strong>{module.name}</strong>
                  <p className="nx-muted">{module.description}</p>
                  <p className="nx-muted" style={{ fontSize: '0.75rem' }}>
                    Catégorie: {module.category} | État: {module.enabled ? '✅ Actif' : '❌ Inactif'}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="nx-btn"
                    onClick={() => moduleRegistry.setEnabled(module.id, !module.enabled)}
                  >
                    {module.enabled ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="nx-settings-panel" style={{ marginTop: '1rem' }}>
        <h2>🔌 Plugins</h2>
        <p className="nx-muted">Plugins installés depuis le marketplace</p>
        
        {plugins.length === 0 ? (
          <p className="nx-muted">Aucun plugin installé</p>
        ) : (
          <ul className="nx-module-list">
            {plugins.map((plugin) => (
              <li key={plugin.id}>
                <div>
                  <strong>{plugin.name}</strong>
                  <p className="nx-muted">{plugin.description}</p>
                  <p className="nx-muted" style={{ fontSize: '0.75rem' }}>
                    Version: {plugin.version} | État: {pluginRegistry.getState(plugin.id)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
