import type { ModuleManifest } from '@nexus-types/module';
import { storageManager } from '@core/storage/storage-manager';
import { globalSearchEngine } from '@core/search/global-search-engine';
import { commandRegistry } from '@core/command-palette/command-registry';

/**
 * Registre central — enregistre 250+ modules sans couplage.
 */
export class ModuleRegistry {
  private modules = new Map<string, ModuleManifest>();
  private enabledStates = new Map<string, boolean>();

  loadEnabledStates(): void {
    const record = storageManager.local.get<Record<string, boolean>>(storageManager.systemNamespace, 'moduleEnabledStates');
    if (!record?.value) return;
    Object.entries(record.value).forEach(([moduleId, enabled]) => {
      this.enabledStates.set(moduleId, Boolean(enabled));
    });
  }

  private persistEnabledStates(): void {
    storageManager.local.set(storageManager.systemNamespace, 'moduleEnabledStates', {
      ...Object.fromEntries(this.enabledStates.entries()),
    });
  }

  register(manifest: ModuleManifest): void {
    const persistedEnabled = this.enabledStates.get(manifest.id);
    if (persistedEnabled !== undefined) {
      manifest.enabled = persistedEnabled;
    }

    this.modules.set(manifest.id, manifest);
    globalSearchEngine.register({
      id: manifest.id,
      title: manifest.name,
      subtitle: manifest.description,
      category: manifest.category,
      route: manifest.routePath,
      keywords: manifest.keywords,
    });
    commandRegistry.register({
      id: `cmd-open-${manifest.id}`,
      label: `Ouvrir ${manifest.name}`,
      group: 'module',
      keywords: [manifest.name, ...manifest.keywords],
    });
  }

  registerMany(manifests: ModuleManifest[]): void {
    manifests.forEach((m) => this.register(m));
  }

  setEnabled(moduleId: string, enabled: boolean): void {
    const manifest = this.modules.get(moduleId);
    if (!manifest) return;
    manifest.enabled = enabled;
    this.enabledStates.set(moduleId, enabled);
    this.persistEnabledStates();
  }

  getEnabledState(moduleId: string): boolean {
    return this.modules.get(moduleId)?.enabled ?? false;
  }

  getEnabledStates(): Record<string, boolean> {
    return Object.fromEntries(this.enabledStates.entries());
  }

  get(id: string): ModuleManifest | undefined {
    return this.modules.get(id);
  }

  list(): ModuleManifest[] {
    return [...this.modules.values()];
  }

  listByCategory(category: ModuleManifest['category']): ModuleManifest[] {
    return this.list().filter((m) => m.category === category);
  }

  count(): number {
    return this.modules.size;
  }
}

export const moduleRegistry = new ModuleRegistry();
