import { useState, useCallback } from 'react';
import { Code2, Copy, Trash2, Download, Upload, AlertCircle, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from '@stores/toast-store';
import DOMPurify from 'dompurify';

type ViewMode = 'pretty' | 'minified' | 'raw';

const SAMPLE = `{
  "name": "NexusOS",
  "version": "0.1.0",
  "modules": [
    { "id": "notes", "enabled": true },
    { "id": "tasks", "enabled": false }
  ],
  "meta": {
    "author": "NexusOS Team",
    "created": "2026-06-04"
  }
}`;

function prettifyJSON(raw: string, indent = 2): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(raw);
    return { output: JSON.stringify(parsed, null, indent), error: null };
  } catch (e) {
    return { output: raw, error: (e as Error).message };
  }
}

function minifyJSON(raw: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(raw);
    return { output: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { output: raw, error: (e as Error).message };
  }
}

/**
 * Very simple JSON syntax highlighter — returns HTML string.
 * Only used for the pretty view.
 */
function highlightJSON(json: string): string {
  const highlighted = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'nx-json-number';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'nx-json-key' : 'nx-json-string';
        } else if (/true|false/.test(match)) {
          cls = 'nx-json-bool';
        } else if (/null/.test(match)) {
          cls = 'nx-json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
  // Sanitize the HTML to prevent XSS
  return DOMPurify.sanitize(highlighted, { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] });
}

export function JSONFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>('pretty');

  const { output: prettyOutput, error } = prettifyJSON(input, indent);
  const { output: minifiedOutput } = minifyJSON(input);

  const displayOutput = viewMode === 'pretty' ? prettyOutput
    : viewMode === 'minified' ? minifiedOutput
    : input;

  const isValid = error === null && input.trim().length > 0;

  async function copyOutput() {
    await navigator.clipboard.writeText(displayOutput);
    toast.success('Copié dans le presse-papier !');
  }

  function clearAll() {
    setInput('');
  }

  function downloadOutput() {
    const blob = new Blob([displayOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fichier téléchargé');
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string ?? '');
      toast.success('Fichier chargé', file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  return (
    <div style={{ height: '100%' }}>
      {/* Header */}
      <div className="nx-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', marginBottom: 'var(--nx-space-2)' }}>
          <Code2 size={24} style={{ color: 'var(--nx-cyan)', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.7))' }} />
          <h1 style={{ margin: 0 }}>JSON Formatter</h1>
          <span className={`nx-badge ${isValid ? 'nx-badge-green' : 'nx-badge-red'}`}>
            {isValid ? <><CheckCircle2 size={10} /> Valide</> : <><AlertCircle size={10} /> Erreur</>}
          </span>
        </div>
        <p className="nx-muted nx-text-sm">Formatez, minifiez et validez vos données JSON.</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--nx-space-2)', flexWrap: 'wrap', marginBottom: 'var(--nx-space-4)', alignItems: 'center' }}>
        {/* View mode */}
        <div style={{ display: 'flex', background: 'rgba(10,14,23,0.6)', border: '1px solid var(--nx-border)', borderRadius: 'var(--nx-radius)', overflow: 'hidden' }}>
          {(['pretty', 'minified', 'raw'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className="nx-btn nx-btn-sm"
              style={{
                background: viewMode === mode ? 'rgba(0,245,255,0.1)' : 'transparent',
                color: viewMode === mode ? 'var(--nx-cyan)' : 'var(--nx-muted)',
                border: 'none',
                borderRadius: 0,
              }}
              onClick={() => setViewMode(mode)}
            >
              {mode === 'pretty' ? <><Maximize2 size={12} /> Formaté</> : mode === 'minified' ? <><Minimize2 size={12} /> Minifié</> : 'Brut'}
            </button>
          ))}
        </div>

        {/* Indent */}
        {viewMode === 'pretty' && (
          <select
            className="nx-input"
            style={{ width: 110 }}
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
          >
            <option value={2}>Indent 2</option>
            <option value={4}>Indent 4</option>
            <option value={8}>Indent 8</option>
          </select>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--nx-space-2)' }}>
          <label className="nx-btn nx-btn-secondary nx-btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={12} />
            Charger
            <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
          <button type="button" className="nx-btn nx-btn-secondary nx-btn-sm" onClick={copyOutput} disabled={!isValid}>
            <Copy size={12} />
            Copier
          </button>
          <button type="button" className="nx-btn nx-btn-secondary nx-btn-sm" onClick={downloadOutput} disabled={!isValid}>
            <Download size={12} />
            Télécharger
          </button>
          <button type="button" className="nx-btn nx-btn-ghost nx-btn-sm" onClick={clearAll}>
            <Trash2 size={12} />
            Vider
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && input.trim() && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--nx-space-3)',
          padding: 'var(--nx-space-3) var(--nx-space-4)',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.25)',
          borderRadius: 'var(--nx-radius)',
          marginBottom: 'var(--nx-space-4)',
          color: 'var(--nx-red)',
          fontSize: 'var(--nx-font-size-sm)',
          fontFamily: 'var(--nx-font-mono)',
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Editor / Output split */}
      <div
        className="nx-grid nx-grid-2"
        style={{ gap: 'var(--nx-space-4)', alignItems: 'start' }}
      >
        {/* Input */}
        <div>
          <div className="nx-label" style={{ marginBottom: 'var(--nx-space-2)' }}>Entrée JSON</div>
          <textarea
            className="nx-textarea"
            style={{
              fontFamily: 'var(--nx-font-mono)',
              fontSize: 13,
              minHeight: 420,
              resize: 'vertical',
              lineHeight: 1.6,
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Collez votre JSON ici…"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="nx-label" style={{ marginBottom: 'var(--nx-space-2)' }}>Sortie</div>
          {viewMode === 'pretty' && isValid ? (
            <pre
              style={{
                fontFamily: 'var(--nx-font-mono)',
                fontSize: 13,
                minHeight: 420,
                background: 'rgba(10,14,23,0.6)',
                border: '1px solid var(--nx-border)',
                borderRadius: 'var(--nx-radius)',
                padding: 'var(--nx-space-3)',
                overflow: 'auto',
                lineHeight: 1.6,
                color: 'var(--nx-text)',
              }}
              dangerouslySetInnerHTML={{ __html: highlightJSON(prettyOutput) }}
            />
          ) : (
            <textarea
              className="nx-textarea"
              style={{
                fontFamily: 'var(--nx-font-mono)',
                fontSize: 13,
                minHeight: 420,
                resize: 'vertical',
                lineHeight: 1.6,
                color: viewMode === 'raw' ? 'var(--nx-text)' : isValid ? 'var(--nx-text)' : 'var(--nx-red)',
              }}
              readOnly
              value={displayOutput}
            />
          )}
        </div>
      </div>

      {/* Stats */}
      {isValid && (
        <div style={{ display: 'flex', gap: 'var(--nx-space-5)', marginTop: 'var(--nx-space-4)', fontSize: 'var(--nx-font-size-xs)', color: 'var(--nx-muted)', fontFamily: 'var(--nx-font-mono)' }}>
          <span>Brut: {input.length} chars</span>
          <span>Formaté: {prettyOutput.length} chars</span>
          <span>Minifié: {minifiedOutput.length} chars</span>
          <span>Réduction: {input.length > 0 ? Math.round((1 - minifiedOutput.length / prettyOutput.length) * 100) : 0}%</span>
        </div>
      )}

      {/* Highlight styles injected inline */}
      <style>{`
        .nx-json-key    { color: var(--nx-cyan); }
        .nx-json-string { color: var(--nx-green); }
        .nx-json-number { color: var(--nx-orange); }
        .nx-json-bool   { color: var(--nx-purple); }
        .nx-json-null   { color: var(--nx-muted); }
      `}</style>
    </div>
  );
}
