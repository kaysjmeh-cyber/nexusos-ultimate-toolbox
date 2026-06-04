import { useAppStore } from '@stores/app-store';

export function OfflineIndicator() {
  const online = useAppStore((s) => s.online);
  if (online) return null;
  return <div className="nx-offline-banner">Mode hors ligne</div>;
}
