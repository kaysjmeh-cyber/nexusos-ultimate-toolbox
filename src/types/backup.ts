/** Export / import et sauvegardes automatiques */
export interface BackupSnapshot {
  id: string;
  label: string;
  createdAt: number;
  sizeBytes: number;
  includes: BackupScope[];
}

export type BackupScope =
  | 'profiles'
  | 'settings'
  | 'modules'
  | 'plugins'
  | 'themes'
  | 'widgets'
  | 'dashboard'
  | 'storage';

export interface ExportBundle {
  version: string;
  exportedAt: number;
  scopes: BackupScope[];
  payload: Record<string, unknown>;
}
