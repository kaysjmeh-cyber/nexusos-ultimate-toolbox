import { useUIStore } from '@stores/ui-store';
import { useCustomThemeStore } from './useCustomThemeStore';
import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  cssFile: string;
  category: 'default' | 'modern' | 'retro' | 'minimal';
}

const THEMES: Theme[] = [
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

export function ThemeEditorPage() {
  const { colorScheme, toggleColorScheme } = useUIStore();
  const { colors, setColor, resetColors } = useCustomThemeStore();
  const [selectedTheme, setSelectedTheme] = useState('cyberpunk');

  const isDark = colorScheme === 'dark';

  // Apply theme CSS file when theme changes
  useEffect(() => {
    const theme = THEMES.find((t) => t.id === selectedTheme);
    if (theme && theme.cssFile) {
      // Remove existing theme CSS
      const existingLink = document.getElementById('theme-css');
      if (existingLink) {
        existingLink.remove();
      }
      
      // Add new theme CSS
      const link = document.createElement('link');
      link.id = 'theme-css';
      link.rel = 'stylesheet';
      link.href = theme.cssFile;
      document.head.appendChild(link);
    } else {
      // Remove theme CSS for default theme
      const existingLink = document.getElementById('theme-css');
      if (existingLink) {
        existingLink.remove();
      }
    }

    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Éditeur de Thème</h1>
        <p className="nx-muted">Personnalisez l'apparence de NexusOS en temps réel.</p>
      </div>

      <div className="nx-settings-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Thèmes Prédéfinis</h2>
        <div className="nx-grid nx-grid-3" style={{ marginBottom: '1rem' }}>
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className="nx-card"
              style={{
                cursor: 'pointer',
                padding: '1rem',
                border: selectedTheme === theme.id ? '2px solid var(--nx-cyan)' : '1px solid var(--nx-border)',
                background: theme.preview,
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <span style={{ 
                color: theme.id === 'minimalist' ? '#0f172a' : '#ffffff',
                fontWeight: 600,
                textShadow: theme.id === 'minimalist' ? 'none' : '0 0 10px rgba(0,0,0,0.5)'
              }}>
                {theme.name}
              </span>
            </div>
          ))}
        </div>

        <h2>Préférences Générales</h2>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            checked={isDark} 
            onChange={toggleColorScheme} 
          />
          Mode Sombre
        </label>

        <h2>Couleurs Personnalisées</h2>
        <p className="nx-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
          Ces couleurs surchargeront le thème actuel ({isDark ? 'Sombre' : 'Clair'}).
        </p>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Couleur d'Accent
          <input 
            type="color" 
            value={colors['--nx-accent'] || (isDark ? '#00f5ff' : '#00f5ff')} 
            onChange={(e) => setColor('--nx-accent', e.target.value)} 
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Fond Principal
          <input 
            type="color" 
            value={colors['--nx-bg'] || (isDark ? '#0a0e17' : '#f0f4ff')} 
            onChange={(e) => setColor('--nx-bg', e.target.value)} 
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Surface (Panneaux)
          <input 
            type="color" 
            value={colors['--nx-surface'] || (isDark ? '#111827' : '#ffffff')} 
            onChange={(e) => setColor('--nx-surface', e.target.value)} 
          />
        </label>

        <button 
          type="button" 
          className="nx-btn" 
          onClick={resetColors}
          style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
        >
          Réinitialiser les couleurs
        </button>
      </div>
    </section>
  );
}
