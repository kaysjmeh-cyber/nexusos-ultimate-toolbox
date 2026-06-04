import { createContext, useContext, type ReactNode } from 'react';
import { useCommandPalette } from '@core/command-palette/use-command-palette';

type CommandPaletteContextValue = ReturnType<typeof useCommandPalette>;

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const value = useCommandPalette();
  const { open, setOpen, query, setQuery, commands } = value;

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {open && (
        <div className="nx-palette-overlay" role="dialog" aria-label="Command palette">
          <div className="nx-palette">
            <input
              type="search"
              placeholder="Rechercher une commande… (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <ul>
              {commands.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => setOpen(false)}>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
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
