import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'password-vault',
  name: 'Password Vault',
  description: 'Module password-vault â€” Ã  implÃ©menter',
  category: 'security',
  version: '0.0.0',
  routePath: '/modules/security/password-vault',
  permissions: ['storage:read'],
  keywords: ['password-vault'],
  enabled: true,
};

