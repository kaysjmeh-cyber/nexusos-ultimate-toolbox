import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomColors = {
  '--nx-accent'?: string;
  '--nx-bg'?: string;
  '--nx-surface'?: string;
};

interface CustomThemeState {
  colors: CustomColors;
  setColor: (key: keyof CustomColors, value: string) => void;
  resetColors: () => void;
}

export const useCustomThemeStore = create<CustomThemeState>()(
  persist(
    (set) => ({
      colors: {},
      setColor: (key, value) => set((state) => {
        const newColors = { ...state.colors, [key]: value };
        applyCustomColors(newColors);
        return { colors: newColors };
      }),
      resetColors: () => set(() => {
        applyCustomColors({});
        return { colors: {} };
      }),
    }),
    {
      name: 'nx-custom-colors',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyCustomColors(state.colors);
        }
      },
    }
  )
);

export function applyCustomColors(colors: CustomColors) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  root.style.removeProperty('--nx-accent');
  root.style.removeProperty('--nx-bg');
  root.style.removeProperty('--nx-surface');
  
  Object.entries(colors).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
}

if (typeof document !== 'undefined') {
  try {
    const stored = localStorage.getItem('nx-custom-colors');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.colors) {
        applyCustomColors(parsed.state.colors);
      }
    }
  } catch {
    // ignore
  }
}
