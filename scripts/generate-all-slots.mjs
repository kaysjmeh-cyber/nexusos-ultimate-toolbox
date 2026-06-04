#!/usr/bin/env node
/** Génère les dossiers physiques pour tous les MODULE_SLOTS du catalogue */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
// Import dynamique du catalogue TS non trivial — liste inline synchronisée avec module-slots.ts
const slots = [
  ['notes', 'productivity', 'Notes'],
  ['tasks', 'productivity', 'Tâches'],
  ['calendar', 'productivity', 'Calendrier'],
  ['pomodoro', 'productivity', 'Pomodoro'],
  ['json-editor', 'development', 'JSON Editor'],
  ['regex-lab', 'development', 'Regex Lab'],
  ['api-client', 'development', 'API Client'],
  ['git-tools', 'development', 'Git Tools'],
  ['password-vault', 'security', 'Password Vault'],
  ['hash-tools', 'security', 'Hash Tools'],
  ['pgp-tools', 'security', 'PGP Tools'],
  ['budget', 'finance', 'Budget'],
  ['crypto-tracker', 'finance', 'Crypto Tracker'],
  ['image-tools', 'multimedia', 'Image Tools'],
  ['audio-tools', 'multimedia', 'Audio Tools'],
  ['video-tools', 'multimedia', 'Video Tools'],
  ['ai-chat', 'ai-local', 'AI Chat'],
  ['ai-prompts', 'ai-local', 'AI Prompts'],
  ['ai-embeddings', 'ai-local', 'Embeddings'],
  ['theme-editor', 'customization', 'Theme Editor'],
  ['shortcut-editor', 'customization', 'Shortcuts'],
  ['settings', 'system', 'Paramètres'],
  ['storage-inspector', 'system', 'Storage Inspector'],
  ['backup-manager', 'system', 'Backup Manager'],
];

for (const [id, category, name] of slots) {
  try {
    execSync(
      `node scripts/generate-module.mjs --id ${id} --category ${category} --name "${name}"`,
      { cwd: root, stdio: 'inherit' },
    );
  } catch {
    /* déjà existant */
  }
}
console.log('Génération des slots terminée.');
