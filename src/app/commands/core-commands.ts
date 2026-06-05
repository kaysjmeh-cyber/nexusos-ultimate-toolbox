import { commandRegistry } from '@core/command-palette/command-registry';

/** Commandes système de base — palette Ctrl+K */
export function registerCoreCommands(): void {
  commandRegistry.registerMany([
    {
      id: 'cmd-home',
      label: 'Accueil',
      group: 'navigation',
      keywords: ['home', 'accueil'],
      shortcut: 'G H',
    },
    {
      id: 'cmd-dashboard',
      label: 'Tableau de bord',
      group: 'navigation',
      keywords: ['dashboard', 'accueil', 'stats'],
    },
    {
      id: 'cmd-modules',
      label: 'Hub modules',
      group: 'navigation',
      keywords: ['modules', 'outils', 'catalogue'],
    },
    {
      id: 'cmd-notes',
      label: 'Notes Markdown',
      group: 'module',
      keywords: ['notes', 'markdown', 'texte', 'édition'],
    },
    {
      id: 'cmd-tasks',
      label: 'Tâches',
      group: 'module',
      keywords: ['tasks', 'tâches', 'todo', 'kanban'],
    },
    {
      id: 'cmd-vault',
      label: 'Coffre-fort mots de passe',
      group: 'module',
      keywords: ['vault', 'password', 'coffre', 'sécurité'],
    },
    {
      id: 'cmd-pw-gen',
      label: 'Générateur de mots de passe',
      group: 'module',
      keywords: ['password', 'generator', 'mot de passe', 'sécurité'],
    },
    {
      id: 'cmd-converter',
      label: 'Convertisseur d\'unités',
      group: 'module',
      keywords: ['converter', 'convertisseur', 'unités', 'mesure'],
    },
    {
      id: 'cmd-json',
      label: 'JSON Formatter',
      group: 'module',
      keywords: ['json', 'formatter', 'prettify', 'dev'],
    },
    {
      id: 'cmd-marketplace-plugins',
      label: 'Marketplace plugins',
      group: 'plugin',
      keywords: ['plugins', 'marketplace', 'extensions'],
    },
    {
      id: 'cmd-marketplace-themes',
      label: 'Marketplace thèmes',
      group: 'plugin',
      keywords: ['themes', 'marketplace', 'apparence'],
    },
    {
      id: 'cmd-settings',
      label: 'Paramètres',
      group: 'system',
      keywords: ['settings', 'paramètres', 'config', 'préférences'],
    },
    {
      id: 'cmd-export',
      label: 'Exporter configuration',
      group: 'system',
      keywords: ['export', 'backup', 'sauvegarde'],
    },
    {
      id: 'cmd-ai',
      label: 'Assistant IA (global)',
      group: 'ai',
      keywords: ['ai', 'ia', 'assistant', 'chat', 'llm'],
    },
  ]);
}
