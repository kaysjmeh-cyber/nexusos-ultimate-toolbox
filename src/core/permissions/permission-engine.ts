import type { PermissionScope } from '@nexus-types/index';
import type { RolePermissions, UserProfile } from '@nexus-types/profile';

/**
 * Moteur de permissions — RBAC local par profil.
 * Vérifie grants/denies avant chargement module/plugin.
 */
export class PermissionEngine {
  private roleMatrix: RolePermissions[] = [
    {
      role: 'owner',
      grants: [
        'storage:read',
        'storage:write',
        'network',
        'clipboard',
        'filesystem',
        'notifications',
        'ai:local',
        'ai:remote',
        'plugins:install',
        'themes:install',
        'export',
        'import',
      ],
      denies: [],
    },
    {
      role: 'standard',
      grants: ['storage:read', 'storage:write', 'network', 'ai:local', 'export'],
      denies: ['plugins:install', 'import'],
    },
    {
      role: 'guest',
      grants: ['storage:read'],
      denies: ['storage:write', 'plugins:install', 'themes:install', 'export', 'import'],
    },
  ];

  can(profile: UserProfile, scope: PermissionScope): boolean {
    const matrix = this.roleMatrix.find((r) => r.role === profile.role);
    if (!matrix) return false;
    if (matrix.denies.includes(scope)) return false;
    return matrix.grants.includes(scope);
  }

  assert(profile: UserProfile, scope: PermissionScope): void {
    if (!this.can(profile, scope)) {
      throw new Error(`Permission refusée: ${scope} pour le rôle ${profile.role}`);
    }
  }
}

export const permissionEngine = new PermissionEngine();
