import { eventBus } from '@core/bus/event-bus';

/**
 * Mode hors ligne — écoute navigator.onLine + cache SW.
 */
export class OfflineManager {
  private online = typeof navigator !== 'undefined' ? navigator.onLine : true;

  init(): void {
    if (typeof window === 'undefined') return;
    const handler = () => {
      this.online = navigator.onLine;
      eventBus.emit('offline:status', { online: this.online });
    };
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
  }

  isOnline(): boolean {
    return this.online;
  }
}

export const offlineManager = new OfflineManager();
