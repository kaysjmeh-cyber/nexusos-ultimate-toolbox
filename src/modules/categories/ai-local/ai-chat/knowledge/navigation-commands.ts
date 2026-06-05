export interface NavigationCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

export const NAVIGATION_COMMANDS: NavigationCommand[] = [
  {
    keywords: ['ouvre le marketplace', 'ouvrir marketplace', 'marketplace', 'plugins'],
    action: () => {
      window.location.href = '/marketplace/plugins';
    },
    description: 'Ouvre le marketplace des plugins',
  },
  {
    keywords: ['ouvre les plugins', 'ouvrir plugins', 'liste plugins'],
    action: () => {
      window.location.href = '/marketplace/plugins';
    },
    description: 'Ouvre la liste des plugins',
  },
  {
    keywords: ['ouvre les thèmes', 'ouvrir thèmes', 'liste thèmes', 'themes'],
    action: () => {
      window.location.href = '/marketplace/themes';
    },
    description: 'Ouvre la liste des thèmes',
  },
  {
    keywords: ['ouvre les paramètres', 'ouvrir paramètres', 'settings', 'paramètres'],
    action: () => {
      window.location.href = '/settings';
    },
    description: 'Ouvre les paramètres',
  },
  {
    keywords: ['ouvre le dashboard', 'ouvrir dashboard', 'accueil', 'home'],
    action: () => {
      window.location.href = '/dashboard';
    },
    description: 'Ouvre le dashboard',
  },
  {
    keywords: ['ouvre le password vault', 'ouvrir password vault', 'coffre fort', 'mots de passe'],
    action: () => {
      window.location.href = '/modules/security/password-vault';
    },
    description: 'Ouvre le coffre fort de mots de passe',
  },
  {
    keywords: ['ouvre les tâches', 'ouvrir tâches', 'todo', 'tasks'],
    action: () => {
      window.location.href = '/modules/productivity/tasks';
    },
    description: 'Ouvre le gestionnaire de tâches',
  },
  {
    keywords: ['ouvre les notes', 'ouvrir notes', 'markdown'],
    action: () => {
      window.location.href = '/modules/productivity/notes';
    },
    description: 'Ouvre les notes Markdown',
  },
  {
    keywords: ['ouvre l\'éditeur de thème', 'ouvrir éditeur thème', 'theme editor'],
    action: () => {
      window.location.href = '/modules/customization/theme-editor';
    },
    description: 'Ouvre l\'éditeur de thème',
  },
  {
    keywords: ['ouvre le générateur de mot de passe', 'ouvrir générateur mdp', 'password generator'],
    action: () => {
      window.location.href = '/modules/security/password-generator';
    },
    description: 'Ouvre le générateur de mot de passe',
  },
];

export function detectNavigationCommand(input: string): NavigationCommand | null {
  const normalized = input.toLowerCase().trim();
  
  for (const command of NAVIGATION_COMMANDS) {
    for (const keyword of command.keywords) {
      if (normalized.includes(keyword)) {
        return command;
      }
    }
  }
  
  return null;
}
