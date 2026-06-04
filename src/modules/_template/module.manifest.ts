import type { ModuleManifest } from '@nexus-types/module';

/**
 * TEMPLATE — Dupliquer ce dossier pour chaque nouveau module.
 * Génération : npm run generate:module -- --id mon-module --category development
 */
export const moduleManifest: ModuleManifest = {
  id: 'template-module',
  name: 'Template Module',
  description: 'Modèle de module NexusOS — remplacer par votre outil',
  category: 'development',
  version: '0.0.0',
  routePath: '/modules/development/template-module',
  permissions: ['storage:read'],
  keywords: ['template'],
  enabled: false,
};
