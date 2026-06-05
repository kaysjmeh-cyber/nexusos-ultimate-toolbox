import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Terminal, Navigation, Settings2, Zap } from 'lucide-react';
import { useCommandPalette } from '@core/command-palette/use-command-palette';
import type { CommandDefinition } from '@nexus-types/command-palette';

type CommandPaletteContextValue = ReturnType<typeof useCommandPalette>;

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

const GROUP_ICONS: Record<string, React.ReactNode> = {
  navigation: <Navigation size={12} />,
  system:     <Settings2 size={12} />,
  plugin:     <Zap size={12} />,
  ai:         <Terminal size={12} />,
};

const ROUTE_MAP: Record<string, string> = {
  'cmd-home':                 '/',
  'cmd-dashboard':            '/dashboard',
  'cmd-modules':              '/modules',
  'cmd-marketplace-plugins':  '/marketplace/plugins',
  'cmd-marketplace-themes':   '/marketplace/themes',
  'cmd-settings':             '/settings',
  'cmd-notes':                '/modules/productivity/notes',
  'cmd-tasks':                '/modules/productivity/tasks',
  'cmd-vault':                '/modules/security/password-vault',
  'cmd-pw-gen':               '/modules/security/password-generator',
  'cmd-converter':            '/modules/development/unit-converter',
  'cmd-json':                 '/modules/development/json-formatter',
  'cmd-ai':                   '/modules/ai-local/ai-chat',
};

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const value = useCommandPalette();
  const { open, setOpen, query, setQuery, commands } = value;
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Reset selection when list changes
  useEffect(() => { setSelectedIndex(0); }, [query, open]);

  function executeCommand(cmd: CommandDefinition) {
    const route = ROUTE_MAP[cmd.id];
    if (route) {
      navigate(route);
    } else {
      void value.execute(cmd.id);
    }
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, commands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = commands[selectedIndex];
      if (cmd) executeCommand(cmd);
    }
  }

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {open && (
        <div
          className="nx-palette-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Palette de commandes"
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery(''); } }}
          onKeyDown={handleKeyDown}
        >
          <div className="nx-palette">
            {/* Search row */}
            <div className="nx-palette-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Rechercher une commande…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Results */}
            <ul className="nx-palette-list" ref={listRef}>
              {commands.length === 0 && (
                <li style={{ padding: 'var(--nx-space-4)', color: 'var(--nx-muted)', fontSize: 'var(--nx-font-size-sm)', textAlign: 'center' }}>
                  Aucun résultat
                </li>
              )}
              {commands.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="nx-palette-item"
                    data-selected={i === selectedIndex ? 'true' : 'false'}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: '1px solid transparent', cursor: 'pointer', fontFamily: 'var(--nx-font)' }}
                    onClick={() => executeCommand(c)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="nx-palette-item-icon">
                      {GROUP_ICONS[c.group] ?? <Terminal size={12} />}
                    </span>
                    <span className="nx-palette-item-label">{c.label}</span>
                    {c.shortcut && (
                      <span className="nx-palette-item-kbd">{c.shortcut}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer hints */}
            <div className="nx-palette-footer">
              <span><kbd>↑↓</kbd> naviguer</span>
              <span><kbd>Enter</kbd> exécuter</span>
              <span><kbd>Esc</kbd> fermer</span>
            </div>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPaletteContext hors CommandPaletteProvider');
  }
  return ctx;
}
