import { useCommandPaletteContext } from '@features/command-palette/command-palette-context';

export function AppTopBar() {
  const { setOpen } = useCommandPaletteContext();
  return (
    <header className="nx-topbar">
      <button type="button" className="nx-btn" onClick={() => setOpen(true)}>
        Command Palette (Ctrl+K)
      </button>
    </header>
  );
}
