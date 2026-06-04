import type { SearchDocument, SearchQuery, SearchResult } from '@nexus-types/search';
import { eventBus } from '@core/bus/event-bus';

/**
 * Moteur de recherche global — index unifié modules, plugins, thèmes, commandes.
 * Implémentation future : index inversé dans IndexedDB (search_index store).
 */
export class GlobalSearchEngine {
  private documents: SearchDocument[] = [];

  register(doc: SearchDocument): void {
    // replace existing document with same id or push
    const idx = this.documents.findIndex((d) => d.id === doc.id);
    if (idx >= 0) this.documents[idx] = doc;
    else this.documents.push(doc);
  }

  registerMany(docs: SearchDocument[]): void {
    docs.forEach((d) => this.register(d));
  }

  remove(id: SearchDocument['id']): void {
    this.documents = this.documents.filter((d) => d.id !== id);
  }

  /** Recherche naïve par mots-clés — remplacée par index full-text */
  search(query: SearchQuery): SearchResult[] {
    eventBus.emit('search:query', { q: query.q });
    const q = query.q.trim().toLowerCase();
    if (!q) return [];

    return this.documents
      .filter((doc) => {
        if (query.filters?.length && !query.filters.includes(doc.category)) {
          return false;
        }
        const haystack = [doc.title, doc.subtitle ?? '', ...doc.keywords]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, query.limit ?? 50)
      .map((document) => ({ document }));
  }

  clear(): void {
    this.documents = [];
  }
}

export const globalSearchEngine = new GlobalSearchEngine();
