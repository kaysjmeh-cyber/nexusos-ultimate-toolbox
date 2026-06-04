import type { NexusOSId, NexusTimestamp, PermissionScope } from './index';

/** Plugin tiers — extension du noyau (marketplace prévu) */
export interface PluginManifest {
  id: NexusOSId;
  name: string;
  version: string;
  author: string;
  description: string;
  entry: string;
  permissions: PermissionScope[];
  minNexusVersion: string;
  marketplace?: {
    verified: boolean;
    downloadUrl?: string;
  };
  meta: NexusTimestamp;
}

export type PluginState = 'registered' | 'installed' | 'enabled' | 'disabled' | 'error';
