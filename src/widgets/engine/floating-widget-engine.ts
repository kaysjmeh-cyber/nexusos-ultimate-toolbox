import type { WidgetInstance } from '@nexus-types/widget';
import { eventBus } from '@core/bus/event-bus';

/**
 * Moteur widgets flottants — z-index, drag, snap (UI non implémentée).
 */
export class FloatingWidgetEngine {
  private stack: WidgetInstance[] = [];

  push(instance: WidgetInstance): void {
    this.stack.push(instance);
    eventBus.emit('widget:updated', { instanceId: instance.instanceId });
  }

  bringToFront(instanceId: string): void {
    const idx = this.stack.findIndex((i) => i.instanceId === instanceId);
    if (idx < 0) return;
    const [item] = this.stack.splice(idx, 1);
    if (item) {
      item.zIndex = Math.max(...this.stack.map((s) => s.zIndex), 0) + 1;
      this.stack.push(item);
    }
  }

  getStack(): WidgetInstance[] {
    return [...this.stack];
  }
}

export const floatingWidgetEngine = new FloatingWidgetEngine();
