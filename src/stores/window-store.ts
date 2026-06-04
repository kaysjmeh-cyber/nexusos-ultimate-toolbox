import { create } from 'zustand';
import type { WindowDescriptor } from '@nexus-types/window';
import { eventBus } from '@core/bus/event-bus';

interface WindowState {
  windows: WindowDescriptor[];
  open: (descriptor: Omit<WindowDescriptor, 'zIndex'> & { zIndex?: number }) => void;
  close: (id: string) => void;
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  open: (descriptor) => {
    const zIndex =
      descriptor.zIndex ??
      Math.max(0, ...get().windows.map((w) => w.zIndex)) + 1;
    const win: WindowDescriptor = { ...descriptor, zIndex };
    set((s) => ({ windows: [...s.windows, win] }));
    eventBus.emit('window:open', { windowId: win.id });
  },
  close: (id) => {
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
    eventBus.emit('window:close', { windowId: id });
  },
}));
