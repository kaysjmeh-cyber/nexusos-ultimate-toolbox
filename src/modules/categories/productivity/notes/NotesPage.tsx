import { useEffect, useState, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { FileText, Plus, Save, X, Trash2, Search, Download, Eye, Edit3, RefreshCw } from 'lucide-react';
import { getAllNotes, saveNote, deleteNote, searchNotes } from './notes-store';
import type { Note } from './notes-types';
import { toast } from '@stores/toast-store';

// Configure marked
marked.setOptions({ breaks: true, gfm: true });

function sanitizeMarkdown(md: string): string {
  const html = marked.parse(md) as string;
  return DOMPurify.sanitize(html);
}

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
  const [previewMode, setPreviewMode] = useState(false);

  async function loadAll() {
    const all = await getAllNotes();
    setNotes(all);
  }

  useEffect(() => { void loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNoteById = useCallback(async (rawId?: string | null) => {
    if (!rawId) return;
    const id = rawId.startsWith('note:') ? rawId.replace(/^note:/, '') : rawId;
    const all = notes.length ? notes : await getAllNotes();
    const target = all.find((n) => n.id === id);
    if (!target) {
      toast.error('Note introuvable', id);
      return;
    }
    setEditingId(target.id);
    setTitle(target.title);
    setBody(target.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [notes]);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (hash) void openNoteById(hash);
    const handler = () => {
      const h = window.location.hash.replace('#', '');
      void openNoteById(h);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [openNoteById]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const res = query.trim() ? await searchNotes(query) : await getAllNotes();
    setNotes(res);
  }

  async function handleSave() {
    if (!title.trim() && !body.trim()) {
      toast.warning('Note vide', 'Veuillez saisir un titre ou un contenu.');
      return;
    }
    const note: Note = {
      id: editingId ?? `n-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNote(note);
    toast.success(editingId ? 'Note mise à jour' : 'Note créée', title.trim() || '(sans titre)');
    setTitle('');
    setBody('');
    setEditingId(null);
    setPreviewMode(false);
    await loadAll();
  }

  function handleNew() {
    setEditingId(null);
    setTitle('');
    setBody('');
    setPreviewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startEdit(n: Note) {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
    setPreviewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette note ?')) return;
    await deleteNote(id);
    toast.info('Note supprimée');
    await loadAll();
  }

  return (
    <div className="nx-page">
      {/* Header */}
      <div className="nx-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', marginBottom: 'var(--nx-space-2)' }}>
          <FileText size={24} style={{ color: 'var(--nx-cyan)', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.7))' }} />
          <h1 style={{ margin: 0 }}>Notes Markdown</h1>
        </div>
        <p className="nx-muted nx-text-sm">Créez et gérez vos notes avec support Markdown complet.</p>
      </div>

      {/* Editor */}
      <div className="nx-note-editor">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--nx-space-2)' }}>
          <span style={{ fontSize: 'var(--nx-font-size-sm)', fontWeight: 600, color: 'var(--nx-text-secondary)' }}>
            {editingId ? 'Édition de la note' : 'Nouvelle note'}
          </span>
          <div style={{ display: 'flex', gap: 'var(--nx-space-2)' }}>
            <button
              type="button"
              className="nx-btn-icon"
              onClick={() => setPreviewMode((v) => !v)}
              title={previewMode ? 'Éditer' : 'Aperçu Markdown'}
            >
              {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <input
          className="nx-input"
          placeholder="Titre de la note…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {previewMode ? (
          <div
            className="nx-markdown-preview"
            style={{
              minHeight: 140,
              padding: 'var(--nx-space-3)',
              background: 'rgba(10,14,23,0.6)',
              border: '1px solid var(--nx-border)',
              borderRadius: 'var(--nx-radius)',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeMarkdown(body) }}
          />
        ) : (
          <textarea
            className="nx-textarea"
            style={{ fontFamily: 'var(--nx-font-mono)', fontSize: 'var(--nx-font-size-sm)' }}
            placeholder={`Corps (Markdown supporté)\n\n## Titre\n**gras**, *italique*, \`code\`\n\n- liste\n- items`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
          />
        )}

        <div className="nx-note-editor-actions">
          <button type="button" className="nx-btn" onClick={handleSave}>
            <Save size={14} />
            {editingId ? 'Mettre à jour' : 'Créer'}
          </button>
          <button type="button" className="nx-btn nx-btn-secondary" onClick={handleNew}>
            <Plus size={14} />
            Nouvelle
          </button>
          {editingId && (
            <button type="button" className="nx-btn nx-btn-ghost" onClick={handleNew}>
              <X size={14} />
              Annuler
            </button>
          )}
          <button
            type="button"
            className="nx-btn nx-btn-secondary"
            onClick={() => { downloadJSON(notes, 'notes-export.json'); toast.success('Export réussi', `${notes.length} note(s) exportée(s)`); }}
            style={{ marginLeft: 'auto' }}
          >
            <Download size={14} />
            Exporter
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="nx-tools">
        <form onSubmit={(e) => { e.preventDefault(); void handleSearch(); }} style={{ flex: 1, display: 'flex', gap: 'var(--nx-space-2)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--nx-muted)', pointerEvents: 'none' }} />
            <input
              className="nx-input"
              style={{ paddingLeft: 32 }}
              placeholder="Rechercher dans les notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="nx-btn nx-btn-secondary">
            <Search size={14} />
          </button>
          <button
            type="button"
            className="nx-btn nx-btn-ghost"
            onClick={async () => { setQuery(''); await loadAll(); }}
            title="Réinitialiser"
          >
            <RefreshCw size={14} />
          </button>
        </form>
      </div>

      {/* Notes list */}
      <ul className="nx-list">
        {notes.length === 0 && (
          <li style={{ padding: 'var(--nx-space-8)', textAlign: 'center', color: 'var(--nx-muted)' }}>
            <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>Aucune note. Créez votre première note ci-dessus.</p>
          </li>
        )}
        {notes.map((n) => (
          <li key={n.id} className="nx-list-item">
            <div className="nx-list-item-main">
              <strong style={{ fontSize: 'var(--nx-font-size-sm)', color: 'var(--nx-text)' }}>
                {n.title || '(sans titre)'}
              </strong>
              <div className="nx-muted nx-text-xs" style={{ margin: '4px 0' }}>
                {new Date(n.updatedAt).toLocaleString('fr-FR')}
              </div>
              {/* Markdown preview snippet */}
              <div
                className="nx-markdown-preview"
                style={{ fontSize: 'var(--nx-font-size-xs)', color: 'var(--nx-text-secondary)', maxHeight: 60, overflow: 'hidden', opacity: 0.8 }}
                dangerouslySetInnerHTML={{ __html: sanitizeMarkdown(n.body.slice(0, 200)) }}
              />
            </div>
            <div className="nx-list-item-actions">
              <button className="nx-btn-icon" title="Éditer" onClick={() => startEdit(n)}>
                <Edit3 size={14} />
              </button>
              <button className="nx-btn-icon" title="Supprimer" onClick={() => void handleDelete(n.id)} style={{ color: 'var(--nx-red)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
