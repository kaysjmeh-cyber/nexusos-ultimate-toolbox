export interface VaultEntry {
  id: string;
  title: string;
  username?: string;
  url?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  // encrypted secret stored as base64
  secret: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExportEntry {
  id: string;
  title: string;
  username?: string;
  url?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  secret?: string; // decrypted when exporting
  createdAt: number;
  updatedAt: number;
}

/** Interface pour l'édition avec secret en clair temporaire */
export interface VaultEntryEdit extends Partial<VaultEntry> {
  secretPlain?: string;
}
