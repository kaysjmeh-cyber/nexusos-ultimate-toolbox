import type { WidgetInstance, WidgetManifest } from '@nexus-types/widget';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';

/**
 * Registre des types de widgets + instances (flottants / dashboard).
 */
export class WidgetRegistry {
  private manifests = new Map<string, WidgetManifest>();
  private instances = new Map<string, WidgetInstance>();

  register(manifest: WidgetManifest): void {
    this.manifests.set(manifest.id, manifest);
  }

  createInstance(widgetId: string, position: Partial<WidgetInstance>): WidgetInstance {
    const manifest = this.manifests.get(widgetId);
    if (!manifest) throw new Error(`Widget inconnu: ${widgetId}`);

    const instance: WidgetInstance = {
      instanceId: `wi-${Date.now()}`,
      widgetId,
      x: position.x ?? 0,
      y: position.y ?? 0,
      w: position.w ?? manifest.defaultSize.w,
      h: position.h ?? manifest.defaultSize.h,
      zIndex: position.zIndex ?? 1,
      pinned: position.pinned ?? false,
    };
    this.instances.set(instance.instanceId, instance);
    return instance;
  }

  async persistInstances(): Promise<void> {
    const all = Object.fromEntries(this.instances);
    await storageManager.idb.put(IDB_STORES.widgets, 'instances', all);
  }

  listManifests(): WidgetManifest[] {
    return [...this.manifests.values()];
  }
}

export const widgetRegistry = new WidgetRegistry();
