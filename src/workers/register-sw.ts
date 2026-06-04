/**
 * Enregistrement PWA / Service Worker — mode hors ligne.
 */
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const { registerSW } = await import('virtual:pwa-register');
  registerSW({
    immediate: true,
    onRegisteredSW() {
      console.info('[NexusOS] Service Worker enregistré');
    },
    onOfflineReady() {
      console.info('[NexusOS] Prêt pour le mode hors ligne');
    },
  });
}
