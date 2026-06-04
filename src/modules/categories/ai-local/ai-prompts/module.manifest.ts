import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'ai-prompts',
  name: 'AI Prompts',
  description: 'Module ai-prompts — à implémenter',
  category: 'ai-local',
  version: '0.0.0',
  routePath: '/modules/ai-local/ai-prompts',
  permissions: ['storage:read'],
  keywords: ['ai-prompts'],
  enabled: false,
};
