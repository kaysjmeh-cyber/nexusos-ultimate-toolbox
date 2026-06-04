import type { Note } from './notes-types';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';
import { globalSearchEngine } from '@core/search/global-search-engine';
import type { SearchDocument } from '@nexus-types/search';

const STORE = IDB_STORES.modules;
const KEY = 'notes';

export async function getAllNotes(): Promise<Note[]> {
  const raw = await storageManager.idb.get<Record<string, Note> | undefined>(
    STORE,
    KEY,
  );
  if (!raw) return [];
  return Object.values(raw).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveNote(note: Note): Promise<Note> {
  const map =
    (await storageManager.idb.get<Record<string, Note> | undefined>(STORE, KEY)) || {};
  const now = Date.now();
  const n: Note = {
    ...note,
    updatedAt: now,
    createdAt: note.createdAt ?? now,
  };
  map[n.id] = n;
  await storageManager.idb.put(STORE, KEY, map);
  // index/update note in global search
  const doc: SearchDocument = {
    id: `note:${n.id}`,
    title: n.title || '(sans titre)',
    subtitle: n.body.slice(0, 200),
    category: 'productivity',
    route: `/modules/productivity/notes`,
    keywords: [n.title, ...n.body.split(/\s+/)].filter(Boolean),
  };
  globalSearchEngine.register(doc);
  return n;
}

export async function deleteNote(id: string): Promise<void> {
  const map =
    (await storageManager.idb.get<Record<string, Note> | undefined>(STORE, KEY)) || {};
  delete map[id];
  await storageManager.idb.put(STORE, KEY, map);
  globalSearchEngine.remove(`note:${id}`);
}

export async function searchNotes(q: string): Promise<Note[]> {
  if (!q.trim()) return getAllNotes();
  const all = await getAllNotes();
  const lq = q.toLowerCase();
  return all.filter(
    (n) => n.title.toLowerCase().includes(lq) || n.body.toLowerCase().includes(lq),
  );
}
