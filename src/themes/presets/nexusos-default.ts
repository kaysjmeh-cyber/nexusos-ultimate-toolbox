import type { ThemeManifest } from '@nexus-types/theme';

/** Thème système par défaut — fondations visuelles */
export const nexusosDefaultTheme: ThemeManifest = {
  id: 'theme-nexusos-default',
  name: 'NexusOS Default',
  version: '0.1.0',
  author: 'NexusOS',
  dark: true,
  variables: {
    '--nx-bg': '#0a0e17',
    '--nx-surface': '#111827',
    '--nx-border': '#1f2937',
    '--nx-text': '#f9fafb',
    '--nx-muted': '#9ca3af',
    '--nx-accent': '#3b82f6',
    '--nx-accent-hover': '#60a5fa',
    '--nx-radius': '8px',
    '--nx-font': 'system-ui, sans-serif',
  },
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};
