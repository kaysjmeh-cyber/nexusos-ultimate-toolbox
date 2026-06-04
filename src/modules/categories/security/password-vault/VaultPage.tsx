import { useEffect, useState } from 'react';
import type { VaultEntry } from './vault-types';
import { getAllEntries, saveEntry, deleteEntry, searchEntries, decryptSecretForEntry, exportAll, importAll } from './vault-store';

function generatePassword(length = 16, opts = { lower: true, upper: true, numbers: true, symbols: true }) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  let chars = '';
  if (opts.lower) chars += lower;
  if (opts.upper) chars += upper;
  if (opts.numbers) chars += numbers;
  if (opts.symbols) chars += symbols;
  const pool = chars || (lower + numbers);
  let out = '';
  const cryptoArr = new Uint32Array(length);
  crypto.getRandomValues(cryptoArr);
  const n = pool.length;
  for (let i = 0; i < length; i++) {
    const idx = (cryptoArr[i]!) % n;
    out += pool.charAt(idx);
  }
  return out;
}

function passwordStrength(pw = '') {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 6);
}

export function VaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Partial<VaultEntry> & { secretPlain?: string } | null>(null);
  const [secretView, setSecretView] = useState<Record<string, string>>({});

  async function load() {
    setEntries(await getAllEntries());
  }

  useEffect(() => { void load(); }, []);

  async function handleSave() {
    if (!editing) return;
    const secretPlain = (editing as any).secretPlain as string | undefined;
    await saveEntry({ ...(editing as VaultEntry), secretPlain });
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet élément ?')) return;
    await deleteEntry(id);
    await load();
  }

  async function handleDecrypt(id: string) {
    const val = await decryptSecretForEntry(id);
    setSecretView((s) => ({ ...s, [id]: val }));
  }

  async function handleSearch(e?: Event) {
    if (e) e.preventDefault();
    setEntries(await searchEntries(query));
  }

  async function handleExport(encrypted = true) {
    // Export encrypted by default for safety; pass false to get plaintext export
    const all = await exportAll(!encrypted ? true : false);
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = encrypted ? 'password-vault-export-encrypted.json' : 'password-vault-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file?: File) {
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        // incoming export files are plaintext (exportAll(true)),
        // so import should treat them as NOT already encrypted.
        await importAll(parsed, false);
        await load();
      } else alert('Format invalide');
    } catch (e) {
      alert('Erreur import: ' + String(e));
    }
  }

  return (
    <section className="nx-page">
      <h1>Password Vault</h1>

      <div className="nx-note-editor">
        <button className="nx-btn" onClick={() => setEditing({ title: '', tags: [], category: '' })}>Nouvel élément</button>
        <button className="nx-btn" onClick={() => void handleExport(true)}>Exporter (chiffré)</button>
        <button className="nx-btn" onClick={() => void handleExport(false)}>Exporter (en clair)</button>
        <label className="nx-btn">
          Importer JSON
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => handleImport(e.target.files?.[0])} />
        </label>
      </div>

      {editing && (
        <div className="nx-editor">
          <input placeholder="Titre" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input placeholder="Username" value={editing.username ?? ''} onChange={(e) => setEditing({ ...editing, username: e.target.value })} />
          <input placeholder="URL" value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
          <input placeholder="Category" value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <input placeholder="Tags (comma)" value={(editing.tags ?? []).join(',')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
          <textarea placeholder="Notes" value={editing.notes ?? ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
          <input placeholder="Secret" value={(editing as any).secretPlain ?? ''} onChange={(e) => setEditing({ ...editing, secretPlain: e.target.value })} />
          <div>
            <button className="nx-btn" onClick={() => setEditing({ ...editing, secretPlain: generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }) })}>Générer mot de passe</button>
            <button className="nx-btn" onClick={handleSave}>Enregistrer</button>
            <button className="nx-btn" onClick={() => setEditing(null)}>Annuler</button>
          </div>
          <div className="nx-muted">Robustesse: {passwordStrength(editing?.secretPlain ?? '')} / 6</div>
        </div>
      )}

      <div className="nx-tools">
        <form onSubmit={(e) => { e.preventDefault(); void handleSearch(); }}>
          <input placeholder="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="nx-btn" type="submit">Rechercher</button>
          <button className="nx-btn" type="button" onClick={async () => { setQuery(''); await load(); }}>Réinitialiser</button>
        </form>
      </div>

      <ul className="nx-list">
        {entries.map((e) => (
          <li key={e.id} className="nx-list-item">
            <div className="nx-list-item-main">
              <strong>{e.title}</strong>
              <div className="nx-muted">{e.username} {e.url ? `— ${e.url}` : ''}</div>
              <div className="nx-muted">{(e.tags ?? []).join(', ')}</div>
            </div>
            <div className="nx-list-item-actions">
              <button className="nx-btn" onClick={async () => { setEditing(e); }}>Éditer</button>
              <button className="nx-btn" onClick={() => handleDelete(e.id)}>Supprimer</button>
              <button className="nx-btn" onClick={() => void handleDecrypt(e.id)}>Voir secret</button>
              <div style={{ marginTop: 8 }}>{secretView[e.id] ? <code>{secretView[e.id]}</code> : null}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
