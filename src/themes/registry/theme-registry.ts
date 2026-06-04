import type { ThemeManifest } from '@nexus-types/theme';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';

/**
 * Registre des thèmes — variables CSS injectées sur :root.
 */
export class ThemeRegistry {
  private themes = new Map<string, ThemeManifest>();
  private activeId: string | null = null;

  register(theme: ThemeManifest): void {
    this.themes.set(theme.id, theme);
  }

  async setActive(themeId: string): Promise<void> {
    const theme = this.themes.get(themeId);
    if (!theme) return;
    this.activeId = themeId;
    this.applyVariables(theme);
    await storageManager.idb.put(IDB_STORES.themes, 'active', themeId);
    document.documentElement.dataset.theme = themeId;
  }

  private applyVariables(theme: ThemeManifest): void {
    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.classList.toggle('dark', theme.dark);
  }

  getActive(): ThemeManifest | undefined {
    return this.activeId ? this.themes.get(this.activeId) : undefined;
  }

  list(): ThemeManifest[] {
    return [...this.themes.values()];
  }
}

export const themeRegistry = new ThemeRegistry();
