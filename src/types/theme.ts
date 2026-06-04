import type { NexusOSId, NexusTimestamp } from './index';

/** Thème visuel — marketplace prévu */
export interface ThemeManifest {
  id: NexusOSId;
  name: string;
  description?: string;
  version: string;
  author: string;
  variables: Record<string, string>;
  dark: boolean;
  marketplace?: {
    verified: boolean;
    previewUrl?: string;
  };
  meta: NexusTimestamp;
}
