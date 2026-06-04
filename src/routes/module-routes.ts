import type { ModuleManifest } from '@nexus-types/module';
import { moduleRegistry } from '@modules/registry';

/**
 * Agrégation des routes modules — lazy loading futur.
 * Génère la table de routage à partir du registre.
 */
export function buildModuleRouteTable(): Array<{
  path: string;
  manifest: ModuleManifest;
}> {
  return moduleRegistry.list().map((manifest) => ({
    path: manifest.routePath,
    manifest,
  }));
}
