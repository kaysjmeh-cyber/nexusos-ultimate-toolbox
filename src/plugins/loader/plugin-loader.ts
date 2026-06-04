import type { NexusPluginModule } from '@plugins/types/plugin-api';
import type { PluginManifest } from '@nexus-types/plugin';
import { pluginRegistry } from '@plugins/registry/plugin-registry';

/**
 * Chargeur dynamique de plugins — import() sandboxé (futur).
 */
export class PluginLoader {
  private loaded = new Map<string, NexusPluginModule>();

  async load(manifest: PluginManifest): Promise<NexusPluginModule | null> {
    // Réservé : import dynamique depuis marketplace / bundle local
    void manifest.entry;
    return null;
  }

  async unload(pluginId: string): Promise<void> {
    const mod = this.loaded.get(pluginId);
    await mod?.deactivate?.();
    this.loaded.delete(pluginId);
  }

  async installFromMarketplace(pluginId: string): Promise<void> {
    await pluginRegistry.install(pluginId);
  }
}

export const pluginLoader = new PluginLoader();
