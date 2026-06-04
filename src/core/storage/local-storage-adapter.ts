import type { StorageNamespace, StorageRecord } from '@nexus-types/storage';

/**
 * Adaptateur LocalStorage — données légères (préférences, flags, cache court).
 * Namespacing obligatoire : nexusos:{owner}:{key}
 */
export class LocalStorageAdapter {
  private buildKey(ns: StorageNamespace, key: string): string {
    return `nexusos:${ns.owner}:${ns.prefix}:${key}`;
  }

  get<T>(ns: StorageNamespace, key: string): StorageRecord<T> | null {
    const raw = localStorage.getItem(this.buildKey(ns, key));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StorageRecord<T>;
    } catch {
      return null;
    }
  }

  set<T>(ns: StorageNamespace, key: string, value: T, version = 1): void {
    const record: StorageRecord<T> = {
      key,
      value,
      layer: 'localStorage',
      version,
      updatedAt: Date.now(),
    };
    localStorage.setItem(this.buildKey(ns, key), JSON.stringify(record));
  }

  remove(ns: StorageNamespace, key: string): void {
    localStorage.removeItem(this.buildKey(ns, key));
  }

  listKeys(ns: StorageNamespace): string[] {
    const prefix = `nexusos:${ns.owner}:${ns.prefix}:`;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) keys.push(k.slice(prefix.length));
    }
    return keys;
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
