import { MODULE_SLOTS } from '@modules/catalog/module-slots';
import { moduleRegistry } from './module-registry';
import type { ModuleManifest } from '@nexus-types/module';

/**
 * Enregistre un slot catalogue comme un module générique.
 */
function slotToManifest(slot: (typeof MODULE_SLOTS)[0]): ModuleManifest {
  return {
    id: slot.id,
    name: slot.name,
    description: slot.description,
    category: slot.category,
    version: '0.0.0',
    routePath: `/modules/${slot.category}/${slot.id}`,
    permissions: ['storage:read'],
    keywords: slot.keywords,
    enabled: false,
  };
}

export function bootstrapModules(): void {
  moduleRegistry.loadEnabledStates();

  const moduleManifests = import.meta.glob('../categories/**/module.manifest.ts', {
    eager: true,
  }) as Record<string, { moduleManifest: ModuleManifest }>;

  const loadedManifests = Object.values(moduleManifests).map((entry) => entry.moduleManifest);
  const loadedIds = new Set(loadedManifests.map((manifest) => manifest.id));
  const fallbackManifests = MODULE_SLOTS.filter((slot) => !loadedIds.has(slot.id)).map(slotToManifest);

  moduleRegistry.registerMany([...loadedManifests, ...fallbackManifests]);
}
