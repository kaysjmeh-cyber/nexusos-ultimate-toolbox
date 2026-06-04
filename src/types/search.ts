import type { ModuleCategory, NexusOSId } from './index';

/** Entrée indexée pour le moteur de recherche global */
export interface SearchDocument {
  id: NexusOSId;
  title: string;
  subtitle?: string;
  category: ModuleCategory | 'plugin' | 'theme' | 'command' | 'setting';
  route?: string;
  keywords: string[];
  score?: number;
}

export interface SearchQuery {
  q: string;
  filters?: SearchDocument['category'][];
  limit?: number;
}

export interface SearchResult {
  document: SearchDocument;
  highlights?: string[];
}
