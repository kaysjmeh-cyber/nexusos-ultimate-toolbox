/**
 * Theme Registry
 * Manages available themes and their metadata
 */

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  cssFile: string;
  category: 'default' | 'modern' | 'retro' | 'minimal';
}

export const THEMES: Theme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon aesthetic with cyan and purple accents',
    preview: 'linear-gradient(135deg, #0a0e17 0%, #1a1f3a 100%)',
    cssFile: '',
    category: 'default',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright vibrant colors with strong glow effects',
    preview: 'linear-gradient(135deg, #050505 0%, #00ff88 100%)',
    cssFile: '/themes/neon.css',
    category: 'modern',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, professional design',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    cssFile: '/themes/minimalist.css',
    category: 'minimal',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Heavy glass effects with soft gradient backgrounds',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cssFile: '/themes/glassmorphism.css',
    category: 'modern',
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro 80s aesthetic with vibrant purples and pinks',
    preview: 'linear-gradient(135deg, #1a0b2e 0%, #ff0080 100%)',
    cssFile: '/themes/synthwave.css',
    category: 'retro',
  },
];

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((theme) => theme.id === id);
}

export function getThemesByCategory(category: Theme['category']): Theme[] {
  return THEMES.filter((theme) => theme.category === category);
}

export function getAllThemes(): Theme[] {
  return THEMES;
}
