import type { ModuleCategory } from '@nexus-types/index';

/**
 * Catalogue de slots modules — extensible jusqu'à 250+ entrées.
 * Chaque slot génère un dossier via scripts/generate-module.mjs
 */
export interface ModuleSlotDefinition {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string;
  keywords: string[];
}

/** Slots initiaux (échantillon représentatif — le registre accepte l'infini) */
export const MODULE_SLOTS: ModuleSlotDefinition[] = [
  // Productivity (30+ prévus)
  { id: 'notes', name: 'Notes', category: 'productivity', description: 'Bloc-notes', keywords: ['notes', 'texte'] },
  { id: 'tasks', name: 'Tâches', category: 'productivity', description: 'Gestion des tâches', keywords: ['todo', 'kanban'] },
  { id: 'calendar', name: 'Calendrier', category: 'productivity', description: 'Agenda', keywords: ['calendrier', 'rdv'] },
  { id: 'pomodoro', name: 'Pomodoro', category: 'productivity', description: 'Minuteur focus', keywords: ['timer', 'focus'] },
  // Development (40+ prévus)
  { id: 'json-editor', name: 'JSON Editor', category: 'development', description: 'Éditeur JSON', keywords: ['json', 'dev'] },
  { id: 'regex-lab', name: 'Regex Lab', category: 'development', description: 'Testeur regex', keywords: ['regex'] },
  { id: 'api-client', name: 'API Client', category: 'development', description: 'Client HTTP', keywords: ['api', 'rest'] },
  { id: 'git-tools', name: 'Git Tools', category: 'development', description: 'Utilitaires Git', keywords: ['git'] },
  // Security (25+ prévus)
  { id: 'password-vault', name: 'Password Vault', category: 'security', description: 'Coffre mots de passe', keywords: ['password'] },
  { id: 'hash-tools', name: 'Hash Tools', category: 'security', description: 'Hachage', keywords: ['hash', 'sha'] },
  { id: 'pgp-tools', name: 'PGP Tools', category: 'security', description: 'Chiffrement PGP', keywords: ['pgp', 'gpg'] },
  // Finance (20+ prévus)
  { id: 'budget', name: 'Budget', category: 'finance', description: 'Budget personnel', keywords: ['budget', 'argent'] },
  { id: 'crypto-tracker', name: 'Crypto Tracker', category: 'finance', description: 'Suivi crypto', keywords: ['crypto'] },
  // Multimedia (30+ prévus)
  { id: 'image-tools', name: 'Image Tools', category: 'multimedia', description: 'Outils image', keywords: ['image', 'png'] },
  { id: 'audio-tools', name: 'Audio Tools', category: 'multimedia', description: 'Outils audio', keywords: ['audio', 'mp3'] },
  { id: 'video-tools', name: 'Video Tools', category: 'multimedia', description: 'Outils vidéo', keywords: ['video'] },
  // AI Local (35+ prévus)
  { id: 'ai-chat', name: 'AI Chat', category: 'ai-local', description: 'Chat IA locale', keywords: ['ai', 'llm'] },
  { id: 'ai-prompts', name: 'AI Prompts', category: 'ai-local', description: 'Bibliothèque prompts', keywords: ['prompt'] },
  { id: 'ai-embeddings', name: 'Embeddings', category: 'ai-local', description: 'Vecteurs', keywords: ['embedding'] },
  // Customization (20+ prévus)
  { id: 'theme-editor', name: 'Theme Editor', category: 'customization', description: 'Éditeur thème', keywords: ['theme'] },
  { id: 'shortcut-editor', name: 'Shortcuts', category: 'customization', description: 'Raccourcis', keywords: ['shortcut'] },
  // System (30+ prévus)
  { id: 'settings', name: 'Paramètres', category: 'system', description: 'Configuration', keywords: ['settings'] },
  { id: 'storage-inspector', name: 'Storage Inspector', category: 'system', description: 'Inspecteur stockage', keywords: ['storage', 'idb'] },
  { id: 'backup-manager', name: 'Backup Manager', category: 'system', description: 'Sauvegardes', keywords: ['backup'] },
];

/** Capacité cible documentée */
export const TARGET_MODULE_COUNT = 250;
