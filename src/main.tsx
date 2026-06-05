import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@app/providers/AppProviders';
import { bootstrapNexusOS } from '@app/bootstrap';
import { router } from '@routes/index';
import { registerServiceWorker } from '@workers/register-sw';
import { useAppStore } from '@stores/app-store';
import '@styles/global.css';
import '@modules/categories/customization/theme-editor/useCustomThemeStore';

async function main() {
  await bootstrapNexusOS();
  useAppStore.getState().setBootstrapped(true);
  await registerServiceWorker();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
}

main().catch(console.error);
