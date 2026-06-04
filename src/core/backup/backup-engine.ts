import type { BackupScope, BackupSnapshot } from '@nexus-types/backup';
import { eventBus } from '@core/bus/event-bus';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';

/**
 * Sauvegardes automatiques + snapshots.
 * Planification via Service Worker (sync en arrière-plan — futur).
 */
export class BackupEngine {
  private autoBackupEnabled = false;
  private intervalMs = 86_400_000; // 24h — configurable

  configure(options: { enabled: boolean; intervalMs?: number }): void {
    this.autoBackupEnabled = options.enabled;
    if (options.intervalMs) this.intervalMs = options.intervalMs;
  }

  async createSnapshot(
    label: string,
    scopes: BackupScope[],
  ): Promise<BackupSnapshot> {
    const payload = await this.collectScopes(scopes);
    const id = `backup-${Date.now()}`;
    const snapshot: BackupSnapshot = {
      id,
      label,
      createdAt: Date.now(),
      sizeBytes: JSON.stringify(payload).length,
      includes: scopes,
    };
    await storageManager.idb.put(IDB_STORES.backups, id, { snapshot, payload });
    eventBus.emit('backup:completed', { snapshotId: id });
    return snapshot;
  }

  private async collectScopes(
    scopes: BackupScope[],
  ): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const scope of scopes) {
      out[scope] = { placeholder: true, scope };
    }
    return out;
  }

  scheduleAutoBackup(): void {
    if (!this.autoBackupEnabled) return;
    // Réservé : navigator.serviceWorker + periodic sync
    void this.intervalMs;
  }
}

export const backupEngine = new BackupEngine();
