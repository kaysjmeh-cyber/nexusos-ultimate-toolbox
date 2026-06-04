import type { UserProfile } from '@nexus-types/profile';
import { storageManager } from '@core/storage/storage-manager';
import { IDB_STORES } from '@nexus-types/storage';

/**
 * Gestion multi-profils — un profil actif à la fois.
 * Persistance IndexedDB ; métadonnées légères en LocalStorage.
 */
export class ProfileManager {
  private activeProfileId: string | null = null;

  async init(): Promise<void> {
    await storageManager.init();
    const cached = storageManager.local.get<{ profileId: string }>(
      storageManager.systemNamespace,
      'activeProfileId',
    );
    this.activeProfileId = cached?.value.profileId ?? null;
  }

  getActiveProfileId(): string | null {
    return this.activeProfileId;
  }

  async listProfiles(): Promise<UserProfile[]> {
    const keys = await storageManager.idb.getAllKeys(IDB_STORES.profiles);
    const profiles: UserProfile[] = [];
    for (const key of keys) {
      const p = await storageManager.idb.get<UserProfile>(
        IDB_STORES.profiles,
        key,
      );
      if (p) profiles.push(p);
    }
    return profiles;
  }

  async setActiveProfile(profileId: string): Promise<void> {
    this.activeProfileId = profileId;
    storageManager.local.set(storageManager.systemNamespace, 'activeProfileId', {
      profileId,
    });
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await storageManager.idb.put(IDB_STORES.profiles, profile.id, profile);
  }
}

export const profileManager = new ProfileManager();
