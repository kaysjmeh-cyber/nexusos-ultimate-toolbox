import { useMemo, useState } from 'react';
import { themeRegistry } from '@themes/registry/theme-registry';
import type { ThemeManifest } from '@nexus-types/theme';

export function ThemeEditorPage() {
  const [name, setName] = useState('Mon thème');
  const [accent, setAccent] = useState('#3b82f6');
  const [background, setBackground] = useState('#0a0e17');
  const [text, setText] = useState('#f9fafb');
  const [darkMode, setDarkMode] = useState(true);

  const themes = useMemo(() => themeRegistry.list(), []);

  const createTheme = () => {
    const id = `theme-custom-${Date.now()}`;
    const theme: ThemeManifest = {
      id,
      name,
      version: '0.1.0',
      author: 'Utilisateur',
      dark: darkMode,
      variables: {
        '--nx-bg': background,
        '--nx-surface': darkMode ? '#111827' : '#f8fafc',
        '--nx-border': darkMode ? '#1f2937' : '#cbd5e1',
        '--nx-text': text,
        '--nx-muted': darkMode ? '#9ca3af' : '#6b7280',
        '--nx-accent': accent,
        '--nx-accent-hover': accent,
        '--nx-radius': '8px',
        '--nx-font': 'system-ui, sans-serif',
      },
      meta: { createdAt: Date.now(), updatedAt: Date.now() },
    };
    themeRegistry.register(theme);
    themeRegistry.setActive(id);
  };

  const activateTheme = async (themeId: string) => {
    await themeRegistry.setActive(themeId);
  };

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Theme Editor</h1>
        <p className="nx-muted">Créer et activer un thème personnalisé rapidement.</p>
      </div>

      <div className="nx-settings-panel">
        <h2>Créer un nouveau thème</h2>
        <label>
          Nom du thème
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Accent
          <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
        </label>
        <label>
          Fond
          <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
        </label>
        <label>
          Texte
          <input type="color" value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <label>
          Mode sombre
          <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
        </label>
        <button type="button" className="nx-btn" onClick={createTheme}>
          Enregistrer et activer
        </button>
      </div>

      <div className="nx-settings-panel" style={{ marginTop: '1rem' }}>
        <h2>Thèmes disponibles</h2>
        <ul className="nx-module-list">
          {themes.map((theme) => (
            <li key={theme.id}>
              <div>
                <strong>{theme.name}</strong>
                <p className="nx-muted">ID : {theme.id}</p>
              </div>
              <button type="button" className="nx-btn" onClick={() => activateTheme(theme.id)}>
                Activer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
