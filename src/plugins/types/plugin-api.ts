import type { PluginManifest } from '@nexus-types/plugin';
import type { PermissionScope } from '@nexus-types/index';

/**
 * API exposée aux plugins (sandbox) — contrat stable.
 * Les plugins n'accèdent pas au DOM directement en production.
 */
export interface NexusPluginContext {
  manifest: PluginManifest;
  requestPermission(scope: PermissionScope): Promise<boolean>;
  storage: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
  };
  events: {
    emit(event: string, payload: unknown): void;
    on(event: string, handler: (payload: unknown) => void): () => void;
  };
}

export interface NexusPluginModule {
  activate(ctx: NexusPluginContext): void | Promise<void>;
  deactivate?(): void | Promise<void>;
}
