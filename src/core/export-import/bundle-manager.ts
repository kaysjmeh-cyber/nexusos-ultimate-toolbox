import type { BackupScope, ExportBundle } from '@nexus-types/backup';
import { backupEngine } from '@core/backup/backup-engine';

/**
 * Export / import complet de l'environnement NexusOS (.nexusbundle JSON).
 */
export class BundleManager {
  readonly formatVersion = '1.0.0';

  async exportAll(scopes: BackupScope[]): Promise<ExportBundle> {
    const snapshot = await backupEngine.createSnapshot('export-manual', scopes);
    return {
      version: this.formatVersion,
      exportedAt: Date.now(),
      scopes,
      payload: { snapshotId: snapshot.id },
    };
  }

  async importBundle(bundle: ExportBundle): Promise<void> {
    if (bundle.version !== this.formatVersion) {
      throw new Error(`Version bundle incompatible: ${bundle.version}`);
    }
    // Réservé : validation, merge, rollback
    void bundle;
  }

  downloadAsFile(bundle: ExportBundle, filename?: string): void {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? `nexusos-export-${Date.now()}.nexusbundle.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const bundleManager = new BundleManager();
