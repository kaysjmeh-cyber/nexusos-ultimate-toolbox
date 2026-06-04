/**
 * Bus d'événements global — découplage entre modules, plugins, widgets, IA.
 * Phase fondations : API uniquement, pas d'émission métier.
 */

export type NexusEventMap = {
  'app:ready': void;
  'profile:changed': { profileId: string };
  'theme:changed': { themeId: string };
  'module:registered': { moduleId: string };
  'plugin:installed': { pluginId: string };
  'widget:updated': { instanceId: string };
  'search:query': { q: string };
  'command:execute': { commandId: string };
  'backup:completed': { snapshotId: string };
  'offline:status': { online: boolean };
  'ai:request': { context: string };
  'window:open': { windowId: string };
  'window:close': { windowId: string };
};

type Handler<T> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<keyof NexusEventMap, Set<Handler<unknown>>>();

  on<K extends keyof NexusEventMap>(
    event: K,
    handler: Handler<NexusEventMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as Handler<unknown>);
    return () => this.off(event, handler);
  }

  off<K extends keyof NexusEventMap>(
    event: K,
    handler: Handler<NexusEventMap[K]>,
  ): void {
    this.listeners.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof NexusEventMap>(
    event: K,
    payload: NexusEventMap[K],
  ): void {
    this.listeners.get(event)?.forEach((h) => h(payload));
  }
}

export const eventBus = new EventBus();
