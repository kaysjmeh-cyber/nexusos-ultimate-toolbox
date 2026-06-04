import type { StorageNamespace } from '@nexus-types/storage';
import { indexedDBAdapter } from './indexed-db';
import { localStorageAdapter } from './local-storage-adapter';

/**
 * StorageManager — point d'entrée unique pour LocalStorage + IndexedDB.
 * Règle : préférences / flags → local ; volumes / index / backups → IDB.
 */
export class StorageManager {
  readonly local = localStorageAdapter;
  readonly idb = indexedDBAdapter;

  /** Namespace système réservé au noyau NexusOS */
  readonly systemNamespace: StorageNamespace = {
    owner: 'nexusos-core',
    prefix: 'v1',
  };

  async init(): Promise<void> {
    await import('./indexed-db').then((m) => m.getIndexedDB());
  }

  // Méthodes de migration / sync inter-couches — stubs
  async migrateLocalToIndexedDB(
    _ns: StorageNamespace,
    _key: string,
  ): Promise<void> {
    /* réservé */
  }
}

export const storageManager = new StorageManager();
