# NexusOS Ultimate Toolbox

Plateforme web modulaire — **fondations uniquement** (aucun outil métier).

## Démarrage

```bash
cd C:\Users\ordin\Projects\nexusos-ultimate-toolbox
npm install
npm run dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production + PWA |
| `npm run generate:module` | Créer un nouveau module |

Exemple :

```bash
node scripts/generate-module.mjs --id my-tool --category development --name "My Tool"
node scripts/generate-all-slots.mjs
```

## Documentation

Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) pour l'architecture complète.

## Raccourcis

- **Ctrl+K** — Command palette
- **PWA** — installable, mode hors ligne via Service Worker

## Licence

Projet privé — usage personnel.
