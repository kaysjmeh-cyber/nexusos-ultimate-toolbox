import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { IDB_STORES, type IDBStoreName } from '@nexus-types/storage';

/**
 * Schéma IndexedDB NexusOS — persistance lourde (profils, index recherche, backups).
 * Stores créés à l'init ; aucune donnée métier en phase fondations.
 */

interface NexusDBSchema extends DBSchema {
  [IDB_STORES.profiles]: { key: string; value: unknown };
  [IDB_STORES.modules]: { key: string; value: unknown };
  [IDB_STORES.plugins]: { key: string; value: unknown };
  [IDB_STORES.widgets]: { key: string; value: unknown };
  [IDB_STORES.themes]: { key: string; value: unknown };
  [IDB_STORES.backups]: { key: string; value: unknown };
  [IDB_STORES.searchIndex]: { key: string; value: unknown };
  [IDB_STORES.aiCache]: { key: string; value: unknown };
  [IDB_STORES.marketplace]: { key: string; value: unknown };
}

const DB_NAME = 'nexusos-toolbox';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NexusDBSchema>> | null = null;

export function getIndexedDB(): Promise<IDBPDatabase<NexusDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<NexusDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        (Object.values(IDB_STORES) as IDBStoreName[]).forEach((store) => {
          if (!database.objectStoreNames.contains(store)) {
            database.createObjectStore(store);
          }
        });
      },
    });
  }
  return dbPromise;
}

/** Façade CRUD générique — à spécialiser par domaine plus tard */
export class IndexedDBAdapter {
  async get<T>(store: IDBStoreName, key: string): Promise<T | undefined> {
    const db = await getIndexedDB();
    return db.get(store, key) as Promise<T | undefined>;
  }

  async put<T>(store: IDBStoreName, key: string, value: T): Promise<void> {
    const db = await getIndexedDB();
    await db.put(store, value, key);
  }

  async delete(store: IDBStoreName, key: string): Promise<void> {
    const db = await getIndexedDB();
    await db.delete(store, key);
  }

  async getAllKeys(store: IDBStoreName): Promise<string[]> {
    const db = await getIndexedDB();
    return db.getAllKeys(store) as Promise<string[]>;
  }
}

export const indexedDBAdapter = new IndexedDBAdapter();
