#!/usr/bin/env node
/**
 * Génère l'arborescence d'un module NexusOS à partir du template.
 * Usage: node scripts/generate-module.mjs --id my-tool --category development --name "My Tool"
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const templateDir = path.join(root, 'src/modules/_template');

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--id') out.id = argv[++i];
    else if (argv[i] === '--category') out.category = argv[++i];
    else if (argv[i] === '--name') out.name = argv[++i];
  }
  return out;
}

const { id, category, name } = parseArgs(process.argv);
if (!id || !category) {
  console.error('Usage: --id <id> --category <category> [--name "Display Name"]');
  process.exit(1);
}

const targetDir = path.join(root, 'src/modules/categories', category, id);
if (fs.existsSync(targetDir)) {
  console.error(`Existe déjà: ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const manifest = `import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: '${id}',
  name: '${name ?? id}',
  description: 'Module ${id} — à implémenter',
  category: '${category}',
  version: '0.0.0',
  routePath: '/modules/${category}/${id}',
  permissions: ['storage:read'],
  keywords: ['${id}'],
  enabled: false,
};
`;

const routes = `export const ${id.replace(/-/g, '_')}Routes = {
  path: '${id}',
} as const;
`;

const index = `export { moduleManifest } from './module.manifest';
export * from './routes';
`;

fs.writeFileSync(path.join(targetDir, 'module.manifest.ts'), manifest);
fs.writeFileSync(path.join(targetDir, 'routes.ts'), routes);
fs.writeFileSync(path.join(targetDir, 'index.ts'), index);
console.log(`Module créé: ${targetDir}`);
