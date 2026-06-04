/**
 * Sandbox plugins — isolation (iframe / worker) à implémenter.
 * Phase fondations : documentation du périmètre de sécurité.
 */
export const PLUGIN_SANDBOX_POLICY = {
  allowDOM: false,
  allowNetwork: 'permission-gated',
  allowStorage: 'namespaced-only',
  maxExecutionMs: 30_000,
} as const;

export class PluginSandbox {
  // Futur : créer iframe, postMessage bridge, révoquer à la désactivation
  createIsolatedContext(_pluginId: string): null {
    return null;
  }
}

export const pluginSandbox = new PluginSandbox();
