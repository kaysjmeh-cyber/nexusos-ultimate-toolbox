import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setPrompt(null);
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!prompt || dismissed || installed) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  }

  return (
    <div className="nx-pwa-banner">
      <Download size={14} />
      <span>Installer NexusOS comme application</span>
      <button
        type="button"
        className="nx-btn nx-btn-sm"
        style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--nx-magenta)', borderColor: 'rgba(168,85,247,0.3)', marginLeft: 'auto' }}
        onClick={() => void handleInstall()}
      >
        Installer
      </button>
      <button
        type="button"
        className="nx-btn-icon"
        style={{ border: 'none', opacity: 0.6 }}
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}
