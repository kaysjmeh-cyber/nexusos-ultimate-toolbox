import { storageManager } from '@core/storage/storage-manager';
import { profileManager } from '@core/profiles/profile-manager';
import { offlineManager } from '@core/offline/offline-manager';
import { bootstrapModules } from '@modules/registry';
import { registerCoreCommands } from '@app/commands/core-commands';
import { eventBus } from '@core/bus/event-bus';

/**
 * Séquence d'initialisation NexusOS — aucun outil métier.
 */
export async function bootstrapNexusOS(): Promise<void> {
  await storageManager.init();
  await profileManager.init();
  offlineManager.init();
  bootstrapModules();
  // Charger les runtimes des modules activés (ex: widgets, hooks)
  try {
    const { moduleRegistry } = await import('@modules/registry');
    const modules = moduleRegistry.list();
    for (const m of modules) {
      if (!m.enabled) continue;
      try {
        // path: @modules/categories/<category>/<id>
        const path = `@modules/categories/${m.category}/${m.id}`;
        // dynamic import — modules may export registerRuntime
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = await import(path as any);
        if (mod?.registerRuntime) await mod.registerRuntime();
      } catch (e) {
        // ignore missing runtime
        void e;
      }
    }
  } catch (e) {
    void e;
  }
  registerCoreCommands();
  eventBus.emit('app:ready', undefined);
}
