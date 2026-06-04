import type { ThemeManifest } from '@nexus-types/theme';

export const lightTheme: ThemeManifest = {
  id: 'theme-nexusos-light',
  name: 'NexusOS Light',
  version: '0.1.0',
  author: 'NexusOS',
  dark: false,
  variables: {
    '--nx-bg': '#f8fafc',
    '--nx-surface': '#ffffff',
    '--nx-border': '#cbd5e1',
    '--nx-text': '#111827',
    '--nx-muted': '#6b7280',
    '--nx-accent': '#2563eb',
    '--nx-accent-hover': '#3b82f6',
    '--nx-radius': '8px',
    '--nx-font': 'system-ui, sans-serif',
  },
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};
