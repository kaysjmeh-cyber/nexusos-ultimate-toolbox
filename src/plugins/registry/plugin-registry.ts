import type { PluginManifest, PluginState } from '@nexus-types/plugin';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';

/**
 * Registre central des plugins — installation, activation, marketplace.
 */
export class PluginRegistry {
  private plugins = new Map<string, { manifest: PluginManifest; state: PluginState }>();

  register(manifest: PluginManifest): void {
    this.plugins.set(manifest.id, {
      manifest,
      state: 'registered',
    });
  }

  async install(pluginId: string): Promise<void> {
    const entry = this.plugins.get(pluginId);
    if (!entry) return;
    entry.state = 'installed';
    await storageManager.idb.put(IDB_STORES.plugins, pluginId, entry);
  }

  async enable(pluginId: string): Promise<void> {
    const entry = this.plugins.get(pluginId);
    if (!entry) return;
    entry.state = 'enabled';
    await storageManager.idb.put(IDB_STORES.plugins, pluginId, entry);
  }

  list(): PluginManifest[] {
    return [...this.plugins.values()].map((p) => p.manifest);
  }

  getState(pluginId: string): PluginState | undefined {
    return this.plugins.get(pluginId)?.state;
  }
}

export const pluginRegistry = new PluginRegistry();
