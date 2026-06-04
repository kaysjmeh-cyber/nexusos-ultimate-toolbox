import { useEffect, useState, useCallback } from 'react';
import { getAllNotes, saveNote, deleteNote, searchNotes } from './notes-store';
import type { Note } from './notes-types';

function downloadJSON(obj: unknown, filename = 'notes-export.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadAll() {
    const all = await getAllNotes();
    setNotes(all);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const openNoteById = useCallback(async (rawId?: string | null) => {
    if (!rawId) return;
    const id = rawId.startsWith('note:') ? rawId.replace(/^note:/, '') : rawId;
    const all = notes.length ? notes : await getAllNotes();
    const target = all.find((n) => n.id === id);
    if (!target) {
      // handle not found gracefully
      // keep UX minimal: inform user and return
      // avoid throwing
      // eslint-disable-next-line no-alert
      alert('Note introuvable : ' + id);
      return;
    }
    // populate editor with the note and scroll into view
    setEditingId(target.id);
    setTitle(target.title);
    setBody(target.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [notes]);

  // On mount, if URL has hash, try to open that note
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (hash) void openNoteById(hash);
    const handler = () => {
      const h = window.location.hash.replace('#', '');
      void openNoteById(h);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [openNoteById]);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const res = query.trim() ? await searchNotes(query) : await getAllNotes();
    setNotes(res);
  }

  async function handleSave() {
    if (!title.trim() && !body.trim()) return;
    const note: Note = {
      id: editingId ?? `n-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNote(note);
    setTitle('');
    setBody('');
    setEditingId(null);
    await loadAll();
  }

  function startEdit(n: Note) {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette note ?')) return;
    await deleteNote(id);
    await loadAll();
  }

  return (
    <section className="nx-page">
      <h1>Notes</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="nx-note-editor">
        <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Corps" value={body} onChange={(e) => setBody(e.target.value)} />
        <div>
          <button type="button" className="nx-btn" onClick={handleSave}>{editingId ? 'Mettre à jour' : 'Créer'}</button>
          <button type="button" className="nx-btn" onClick={() => { setTitle(''); setBody(''); setEditingId(null); }}>Annuler</button>
          <button type="button" className="nx-btn" onClick={() => downloadJSON(notes, 'notes-export.json')}>Exporter JSON</button>
        </div>
      </form>

      <div className="nx-tools">
        <form onSubmit={handleSearch}>
          <input placeholder="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="nx-btn">Rechercher</button>
          <button type="button" className="nx-btn" onClick={async () => { setQuery(''); await loadAll(); }}>Réinitialiser</button>
        </form>
      </div>

      <ul className="nx-list">
        {notes.map((n) => (
          <li key={n.id} className="nx-list-item">
            <div className="nx-list-item-main">
              <strong>{n.title || '(sans titre)'}</strong>
              <div className="nx-muted">{new Date(n.updatedAt).toLocaleString()}</div>
              <p>{n.body}</p>
            </div>
            <div className="nx-list-item-actions">
              <button className="nx-btn" onClick={() => startEdit(n)}>Éditer</button>
              <button className="nx-btn" onClick={() => handleDelete(n.id)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
