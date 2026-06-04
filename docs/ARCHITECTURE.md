# NexusOS Ultimate Toolbox — Architecture

> **Phase actuelle : fondations uniquement.** Aucun outil métier n'est implémenté.

## Vision

Plateforme web modulaire (PWA) accueillant **250+ modules** répartis en 8 catégories :

| Catégorie | ID | Modules prévus (indicatif) |
|-----------|-----|---------------------------|
| Productivité | `productivity` | 30+ |
| Développement | `development` | 40+ |
| Sécurité | `security` | 25+ |
| Finances | `finance` | 20+ |
| Multimédia | `multimedia` | 30+ |
| IA locale | `ai-local` | 35+ |
| Personnalisation | `customization` | 20+ |
| Système | `system` | 30+ |

## Stack technique

- **React 19** + **TypeScript** + **Vite 6**
- **React Router 7** — routage shell + modules
- **Zustand** — état UI léger
- **idb** — IndexedDB typé
- **vite-plugin-pwa** + **Workbox** — Service Worker, mode hors ligne
- **LocalStorage** — préférences / flags (namespacés)

## Arborescence

```
nexusos-ultimate-toolbox/
├── docs/ARCHITECTURE.md
├── public/
│   ├── manifest.webmanifest    # PWA
│   └── icons/
├── scripts/
│   ├── generate-module.mjs     # Nouveau module
│   └── generate-all-slots.mjs
├── src/
│   ├── app/                    # Bootstrap, pages, commandes
│   ├── core/                   # Noyau (storage, search, permissions…)
│   ├── features/               # Dashboard, fenêtres, marketplace, palette
│   ├── modules/
│   │   ├── _template/          # Modèle de module
│   │   ├── catalog/            # MODULE_SLOTS (extensible → 250+)
│   │   ├── categories/         # Dossiers physiques par module
│   │   └── registry/           # ModuleRegistry
│   ├── plugins/                  # Système plugins + sandbox
│   ├── widgets/                # Widgets flottants + dashboard
│   ├── themes/                 # Thèmes + marketplace
│   ├── routes/
│   ├── layouts/
│   ├── components/
│   ├── stores/
│   ├── types/
│   ├── workers/sw/             # Service Worker
│   └── styles/
└── package.json
```

## Sous-systèmes (fondations)

### 1. ModuleRegistry (`src/modules/registry/`)

- Enregistrement déclaratif via `ModuleManifest`
- Indexation automatique dans la **recherche globale** et la **command palette**
- Route : `/modules/:category/:moduleId`
- Génération : `npm run generate:module -- --id X --category Y`

### 2. PluginRegistry (`src/plugins/`)

- Manifest plugins, états `registered → installed → enabled`
- `PluginLoader` + `PluginSandbox` (isolation future)
- Marketplace : `features/marketplace/MarketplacePluginsPage`

### 3. WidgetRegistry (`src/widgets/`)

- Manifests + instances (position, z-index)
- `FloatingWidgetEngine` pour overlays
- Dashboard : zone `data-droppable` (drag & drop à brancher)

### 4. ThemeRegistry (`src/themes/`)

- Variables CSS sur `:root`
- Marketplace thèmes

### 5. StorageManager (`src/core/storage/`)

| Couche | Usage |
|--------|--------|
| **LocalStorage** | Préférences, profil actif, flags |
| **IndexedDB** | Profils, plugins, widgets, backups, index recherche, cache IA |

Stores IDB : voir `IDB_STORES` dans `src/types/storage.ts`.

### 6. ProfileManager + PermissionEngine

- Multi-profils locaux (`owner`, `standard`, `guest`)
- RBAC par `PermissionScope`

### 7. GlobalSearchEngine

- Index en mémoire (phase 1) → migration vers store `search_index`

### 8. CommandRegistry + Ctrl+K

- `CommandPaletteProvider` (contexte React partagé)

### 9. BackupEngine + BundleManager

- Snapshots IDB, export `.nexusbundle.json`
- Sauvegardes auto (planification SW — réservé)

### 10. AIBridge

- Hook uniforme `ai:request` pour tous les modules (sans modèle)

### 11. OfflineManager + Service Worker

- `src/workers/sw/sw.ts` — precache, NetworkFirst pages
- `register-sw.ts` — enregistrement PWA

### 12. Multi-fenêtres

- `WindowManagerProvider` + `useWindowStore`

### 13. EventBus

- Découplage inter-modules : `src/core/bus/event-bus.ts`

## Flux de démarrage

```
main.tsx
  → bootstrapNexusOS()
      → storageManager.init()
      → profileManager.init()
      → bootstrapModules()
      → themeRegistry.setActive()
      → registerCoreCommands()
  → registerServiceWorker()
  → RouterProvider
```

## Extensibilité 250+ modules

1. Ajouter un slot dans `src/modules/catalog/module-slots.ts`
2. `node scripts/generate-module.mjs --id … --category …`
3. Le registre charge les manifests au boot (aucun import lazy requis en phase fondations)
4. Implémenter plus tard `loadPanel()` + chunk dynamique

## Prévisions (non codées)

- [ ] react-grid-layout sur le dashboard
- [ ] Marketplace distant (API)
- [ ] WebLLM / workers IA
- [ ] Periodic Background Sync pour backups
- [ ] Plugin iframe sandbox

## Principes

- **Modularité** : chaque module = 1 dossier, 1 manifest, 0 couplage
- **Sécurité** : permissions avant `loadPanel` / `PluginLoader`
- **Offline-first** : SW + IDB + indicateur UI
- **Pas d'outil** : uniquement shells et contrats TypeScript
