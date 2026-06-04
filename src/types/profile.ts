import type { NexusOSId, NexusTimestamp } from './index';
import type { PermissionScope } from './index';

/** Profil utilisateur local (multi-profils sur un même appareil) */
export interface UserProfile {
  id: NexusOSId;
  displayName: string;
  avatar?: string;
  role: 'owner' | 'standard' | 'guest';
  preferences: ProfilePreferences;
  meta: NexusTimestamp;
}

export interface ProfilePreferences {
  locale: string;
  themeId: NexusOSId;
  dashboardLayoutId?: NexusOSId;
  shortcuts: Record<string, string>;
}

export interface RolePermissions {
  role: UserProfile['role'];
  grants: PermissionScope[];
  denies: PermissionScope[];
}
