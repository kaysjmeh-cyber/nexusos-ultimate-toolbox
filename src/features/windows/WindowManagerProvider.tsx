import type { ReactNode } from 'react';
import { useWindowStore } from '@stores/window-store';

/**
 * Multi-fenêtres — gestion du stack de fenêtres modales / flottantes.
 */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {children}
      <div className="nx-window-layer" aria-hidden={windows.length === 0}>
        {windows.map((w) => (
          <div
            key={w.id}
            className="nx-window"
            style={{
              left: w.x,
              top: w.y,
              width: w.width,
              height: w.height,
              zIndex: w.zIndex,
            }}
          >
            <header>{w.title}</header>
          </div>
        ))}
      </div>
    </>
  );
}
