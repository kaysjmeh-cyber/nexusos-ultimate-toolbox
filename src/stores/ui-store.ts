import { create } from 'zustand';

type ColorScheme = 'dark' | 'light';

interface UIState {
  colorScheme: ColorScheme;
  sidebarCollapsed: boolean;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

function applyColorScheme(scheme: ColorScheme): void {
  document.documentElement.setAttribute('data-color-scheme', scheme);
  try {
    localStorage.setItem('nx-color-scheme', scheme);
  } catch {
    // ignore
  }
}

function getInitialScheme(): ColorScheme {
  try {
    const stored = localStorage.getItem('nx-color-scheme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const initialScheme = typeof window !== 'undefined' ? getInitialScheme() : 'dark';
if (typeof document !== 'undefined') applyColorScheme(initialScheme);

export const useUIStore = create<UIState>((set) => ({
  colorScheme: initialScheme,
  sidebarCollapsed: false,
  toggleColorScheme: () =>
    set((state) => {
      const next: ColorScheme = state.colorScheme === 'dark' ? 'light' : 'dark';
      applyColorScheme(next);
      return { colorScheme: next };
    }),
  setColorScheme: (scheme) =>
    set(() => {
      applyColorScheme(scheme);
      return { colorScheme: scheme };
    }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}));
