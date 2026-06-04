import type { ThemeManifest } from '@nexus-types/theme';

export const solarTheme: ThemeManifest = {
  id: 'theme-nexusos-solar',
  name: 'NexusOS Solar',
  version: '0.1.0',
  author: 'NexusOS',
  dark: false,
  variables: {
    '--nx-bg': '#fdf6e3',
    '--nx-surface': '#fff8e7',
    '--nx-border': '#f1d99f',
    '--nx-text': '#334155',
    '--nx-muted': '#64748b',
    '--nx-accent': '#f97316',
    '--nx-accent-hover': '#fb923c',
    '--nx-radius': '8px',
    '--nx-font': 'system-ui, sans-serif',
  },
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};
