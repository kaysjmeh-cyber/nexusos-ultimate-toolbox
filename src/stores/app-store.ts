import { create } from 'zustand';
import { eventBus } from '@core/bus/event-bus';

interface AppState {
  online: boolean;
  bootstrapped: boolean;
  setOnline: (online: boolean) => void;
  setBootstrapped: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => {
  eventBus.on('offline:status', ({ online }) => set({ online }));
  return {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    bootstrapped: false,
    setOnline: (online) => set({ online }),
    setBootstrapped: (bootstrapped) => set({ bootstrapped }),
  };
});
