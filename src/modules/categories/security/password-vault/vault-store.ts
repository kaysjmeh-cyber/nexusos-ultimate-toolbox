import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';
import type { VaultEntry, ExportEntry } from './vault-types';
import { globalSearchEngine } from '@core/search/global-search-engine';
import type { SearchDocument } from '@nexus-types/search';

const STORE = IDB_STORES.modules;
const KEY = 'password-vault';
const KEY_KEY = 'password-vault-key';

function bufToBase64(b: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(b)));
}

function base64ToBuf(s: string) {
  const bin = atob(s);
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

async function getOrCreateKey(): Promise<CryptoKey> {
  // try to load raw key from IDB
  const raw = await storageManager.idb.get<string | undefined>(STORE, KEY_KEY);
  if (raw) {
    try {
      const keyBuf = base64ToBuf(raw as string);
      return await crypto.subtle.importKey('raw', keyBuf, 'AES-GCM', true, ['encrypt', 'decrypt']);
    } catch {
      // fallthrough to create new
    }
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const exported = await crypto.subtle.exportKey('raw', key);
  const b64 = bufToBase64(exported);
  await storageManager.idb.put(STORE, KEY_KEY, b64);
  return key;
}

async function encryptSecret(plaintext: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plaintext);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
  // store iv + cipher as base64 joined
  return `${bufToBase64(iv.buffer)}:${bufToBase64(cipher)}`;
}

async function decryptSecret(stored: string): Promise<string> {
  const [ivB64, cipherB64] = stored.split(':');
  if (!ivB64 || !cipherB64) return '';
  const iv = new Uint8Array(base64ToBuf(ivB64));
  const cipher = base64ToBuf(cipherB64);
  const key = await getOrCreateKey();
  try {
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    return new TextDecoder().decode(plainBuf);
  } catch {
    return '';
  }
}

export async function getAllEntries(): Promise<VaultEntry[]> {
  const raw = await storageManager.idb.get<Record<string, VaultEntry> | undefined>(STORE, KEY);
  if (!raw) return [];
  return Object.values(raw).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveEntry(e: Partial<VaultEntry> & { secretPlain?: string }): Promise<VaultEntry> {
  const map = (await storageManager.idb.get<Record<string, VaultEntry> | undefined>(STORE, KEY)) || {};
  const now = Date.now();
  const id = e.id ?? `pv-${now}-${Math.floor(Math.random() * 10000)}`;
  const secret = e.secretPlain ? await encryptSecret(e.secretPlain) : (e.secret as string) || '';
  const entry: VaultEntry = {
    id,
    title: e.title ?? 'Sans titre',
    username: e.username,
    url: e.url,
    category: e.category,
    tags: e.tags ?? [],
    notes: e.notes,
    secret,
    createdAt: (e as any).createdAt ?? now,
    updatedAt: now,
  };
  map[id] = entry;
  await storageManager.idb.put(STORE, KEY, map);
  // index in global search
  const doc: SearchDocument = {
    id: `vault:${entry.id}`,
    title: entry.title,
    subtitle: entry.username ?? entry.url ?? '',
    category: 'security',
    route: '/modules/security/password-vault',
    keywords: [entry.title, entry.username ?? '', ...(entry.tags ?? []), entry.category ?? ''].filter(Boolean),
  };
  globalSearchEngine.register(doc);
  return entry;
}

export async function deleteEntry(id: string): Promise<void> {
  const map = (await storageManager.idb.get<Record<string, VaultEntry> | undefined>(STORE, KEY)) || {};
  delete map[id];
  await storageManager.idb.put(STORE, KEY, map);
  globalSearchEngine.remove(`vault:${id}`);
}

export async function searchEntries(q: string): Promise<VaultEntry[]> {
  if (!q.trim()) return getAllEntries();
  const all = await getAllEntries();
  const lq = q.toLowerCase();
  return all.filter((e) => (e.title ?? '').toLowerCase().includes(lq) || (e.username ?? '').toLowerCase().includes(lq) || (e.tags ?? []).some((t) => t.toLowerCase().includes(lq)));
}

export async function exportAll(decrypted = true): Promise<ExportEntry[]> {
  const all = await getAllEntries();
  const out: ExportEntry[] = [];
  for (const e of all) {
    out.push({
      id: e.id,
      title: e.title,
      username: e.username,
      url: e.url,
      category: e.category,
      tags: e.tags,
      notes: e.notes,
      secret: decrypted ? await decryptSecret(e.secret) : e.secret,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    });
  }
  return out;
}

export async function importAll(entries: ExportEntry[], assumeEncrypted = false): Promise<void> {
  const map = (await storageManager.idb.get<Record<string, VaultEntry> | undefined>(STORE, KEY)) || {};
  for (const e of entries) {
    const id = e.id ?? `pv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const secret = assumeEncrypted ? (e.secret as string) : await encryptSecret(e.secret ?? '');
    const entry: VaultEntry = {
      id,
      title: e.title,
      username: e.username,
      url: e.url,
      category: e.category,
      tags: e.tags ?? [],
      notes: e.notes,
      secret,
      createdAt: e.createdAt ?? Date.now(),
      updatedAt: e.updatedAt ?? Date.now(),
    };
    map[id] = entry;
    // index
    globalSearchEngine.register({
      id: `vault:${entry.id}`,
      title: entry.title,
      subtitle: entry.username ?? entry.url ?? '',
      category: 'security',
      route: '/modules/security/password-vault',
      keywords: [entry.title, entry.username ?? '', ...(entry.tags ?? []), entry.category ?? ''].filter(Boolean),
    });
  }
  await storageManager.idb.put(STORE, KEY, map);
}

export async function decryptSecretForEntry(id: string): Promise<string> {
  const map = (await storageManager.idb.get<Record<string, VaultEntry> | undefined>(STORE, KEY)) || {};
  const e = map[id];
  if (!e) return '';
  return decryptSecret(e.secret);
}
