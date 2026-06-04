import { useEffect, useState } from 'react';
import { commandRegistry } from './command-registry';

/**
 * Hook Ctrl+K — ouvre la palette et filtre les commandes.
 * UI dans features/command-palette (shell vide).
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands = commandRegistry.filter(query);

  return {
    open,
    setOpen,
    query,
    setQuery,
    commands,
    execute: commandRegistry.execute.bind(commandRegistry),
  };
}
