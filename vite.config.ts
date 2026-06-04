import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Configuration Vite — NexusOS Ultimate Toolbox
 * PWA + Service Worker via vite-plugin-pwa (Workbox).
 * Aucun outil métier : build et HMR uniquement.
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // enregistrement manuel dans src/workers/register-sw.ts
      strategies: 'injectManifest',
      srcDir: 'src/workers/sw',
      filename: 'sw.ts',
      manifest: false, // manifest dédié : public/manifest.webmanifest
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@plugins': path.resolve(__dirname, 'src/plugins'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@themes': path.resolve(__dirname, 'src/themes'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@nexus-types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@workers': path.resolve(__dirname, 'src/workers'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/modules/')) return 'modules';
          if (id.includes('src/plugins/')) return 'plugins';
          if (id.includes('src/core/')) return 'core';
        },
      },
    },
  },
});
