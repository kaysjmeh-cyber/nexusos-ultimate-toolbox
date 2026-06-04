import type { WidgetManifest } from '@nexus-types/widget';

export const passwordVaultWidget: WidgetManifest = {
  id: 'widget-password-vault',
  name: 'Password Vault (widget)',
  moduleId: 'password-vault',
  defaultSize: { w: 4, h: 2 },
  minSize: { w: 2, h: 1 },
  resizable: false,
  floating: false,
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};

export default passwordVaultWidget;
