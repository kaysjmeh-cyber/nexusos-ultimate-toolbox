import { Search, Sun, Moon, Monitor } from 'lucide-react';
import { useCommandPaletteContext } from '@features/command-palette/command-palette-context';
import { useUIStore } from '@stores/ui-store';
import { useAppStore } from '@stores/app-store';

export function AppTopBar() {
  const { setOpen } = useCommandPaletteContext();
  const { colorScheme, toggleColorScheme } = useUIStore();
  const online = useAppStore((s) => s.online);

  return (
    <header className="nx-topbar">
      {/* Command palette trigger */}
      <button
        type="button"
        className="nx-cmd-trigger"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la palette de commandes"
      >
        <Search size={14} />
        <span>Rechercher ou exécuter…</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="nx-topbar-spacer" />

      <div className="nx-topbar-actions">
        {/* Online dot */}
        <div
          className="nx-statusbar-item"
          style={{ fontSize: 11, fontFamily: 'var(--nx-font-mono)', color: online ? 'var(--nx-green)' : 'var(--nx-red)' }}
          title={online ? 'En ligne' : 'Hors ligne'}
        >
          <span className={`nx-statusbar-dot${online ? '' : ' offline'}`} />
          {online ? 'En ligne' : 'Hors ligne'}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          className="nx-theme-toggle"
          onClick={toggleColorScheme}
          aria-label={colorScheme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
          title={colorScheme === 'dark' ? 'Thème clair' : 'Thème sombre'}
        >
          {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* System info */}
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--nx-font-mono)',
            color: 'var(--nx-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Monitor size={12} />
          <span>NexusOS v0.1</span>
        </div>
      </div>
    </header>
  );
}
