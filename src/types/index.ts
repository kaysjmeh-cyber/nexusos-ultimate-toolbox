/**
 * Types globaux NexusOS — contrats partagés entre tous les sous-systèmes.
 * Aucune logique métier : définitions uniquement.
 */

export type NexusOSId = string;

/** Catégories officielles pour 250+ modules */
export type ModuleCategory =
  | 'productivity'
  | 'development'
  | 'security'
  | 'finance'
  | 'multimedia'
  | 'ai-local'
  | 'customization'
  | 'system';

export type PermissionScope =
  | 'storage:read'
  | 'storage:write'
  | 'network'
  | 'clipboard'
  | 'filesystem'
  | 'camera'
  | 'microphone'
  | 'notifications'
  | 'ai:local'
  | 'ai:remote'
  | 'plugins:install'
  | 'themes:install'
  | 'export'
  | 'import';

export type StorageLayer = 'localStorage' | 'indexedDB' | 'session';

export interface NexusTimestamp {
  createdAt: number;
  updatedAt: number;
}
