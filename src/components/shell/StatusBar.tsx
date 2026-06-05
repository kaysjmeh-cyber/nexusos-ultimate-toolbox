import { useAppStore } from '@stores/app-store';

export function StatusBar() {
  const online = useAppStore((s) => s.online);

  return (
    <footer className="nx-statusbar">
      <div className="nx-statusbar-item">
        <span className={`nx-statusbar-dot${online ? '' : ' offline'}`} />
        <span>{online ? 'Connecté' : 'Hors ligne'}</span>
      </div>
      <div className="nx-statusbar-item">
        <span>NexusOS Ultimate Toolbox</span>
      </div>
      <div className="nx-statusbar-item" style={{ marginLeft: 'auto' }}>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}
