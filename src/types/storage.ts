import type { StorageLayer } from './index';

/** Clés namespacées — évite les collisions entre modules */
export interface StorageNamespace {
  owner: string;
  prefix: string;
}

export interface StorageRecord<T = unknown> {
  key: string;
  value: T;
  layer: StorageLayer;
  version: number;
  updatedAt: number;
}

/** Schémas IndexedDB (stores réservés) */
export const IDB_STORES = {
  profiles: 'profiles',
  modules: 'modules_state',
  plugins: 'plugins',
  widgets: 'widgets',
  themes: 'themes',
  backups: 'backups',
  searchIndex: 'search_index',
  aiCache: 'ai_cache',
  marketplace: 'marketplace_cache',
} as const;

export type IDBStoreName = (typeof IDB_STORES)[keyof typeof IDB_STORES];
