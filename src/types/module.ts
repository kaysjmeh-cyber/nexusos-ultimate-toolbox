import type { ComponentType } from 'react';
import type { ModuleCategory, NexusOSId, PermissionScope } from './index';

/**
 * Métadonnées d'un module NexusOS (sans implémentation d'outil).
 * Chaque module futur expose uniquement ce contrat + routes lazy.
 */
export interface ModuleManifest {
  id: NexusOSId;
  name: string;
  description: string;
  category: ModuleCategory;
  version: string;
  icon?: string;
  /** Route relative sous /modules/:category/:id */
  routePath: string;
  permissions: PermissionScope[];
  keywords: string[];
  /** Réservé : chargement dynamique du panneau (non implémenté) */
  loadPanel?: () => Promise<{ default: ComponentType }>;
  enabled: boolean;
}
