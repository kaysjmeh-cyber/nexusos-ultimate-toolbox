import type { NexusOSId } from './index';

/** Commande palette Ctrl+K — actions globales sans UI d'outil */
export interface CommandDefinition {
  id: NexusOSId;
  label: string;
  group: 'navigation' | 'module' | 'system' | 'ai' | 'plugin';
  shortcut?: string;
  keywords: string[];
  /** Handler réservé — non branché en phase fondations */
  execute?: () => void | Promise<void>;
}
