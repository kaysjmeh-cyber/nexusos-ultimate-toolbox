import { useEffect, useState, type FormEvent } from 'react';
import type { Task } from './tasks-types';
import { getAllTasks, saveTask, deleteTask, searchTasks, exportTasks, importTasks } from './tasks-store';

function downloadJSON(obj: unknown, filename = 'tasks-export.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(ts?: number) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function statusLabel(status: Task['status']) {
  switch (status) {
    case 'done':
      return 'Terminée';
    case 'in-progress':
      return 'En cours';
    default:
      return 'À faire';
  }
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Partial<Task> & { dueDateInput?: string } | null>(null);

  async function load() {
    setTasks(await getAllTasks());
  }

  useEffect(() => { void load(); }, []);

  async function handleSave() {
    if (!editing) return;
    if (!editing.title?.trim() && !editing.description?.trim()) return;
    await saveTask({ ...editing, dueDateInput: editing.dueDateInput });
    setEditing(null);
    await load();
    setQuery('');
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette tâche ?')) return;
    await deleteTask(id);
    await load();
  }

  async function handleSearch(e?: FormEvent) {
    if (e) e.preventDefault();
    setTasks(await searchTasks(query));
  }

  async function handleExport() {
    const all = await exportTasks();
    downloadJSON(all, 'tasks-export.json');
  }

  async function handleImport(file?: File) {
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        await importTasks(parsed);
        await load();
      } else {
        alert('Format invalide');
      }
    } catch (error) {
      alert('Erreur import: ' + String(error));
    }
  }

  return (
    <section className="nx-page">
      <h1>Tâches</h1>

      <div className="nx-note-editor">
        <button className="nx-btn" onClick={() => setEditing({ status: 'todo', priority: 'medium' })}>Nouvelle tâche</button>
        <button className="nx-btn" onClick={handleExport}>Exporter JSON</button>
        <label className="nx-btn">
          Importer JSON
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => handleImport(e.target.files?.[0])} />
        </label>
      </div>

      {editing && (
        <div className="nx-editor">
          <input placeholder="Titre" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <textarea placeholder="Description" value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <div>
            <label>
              Statut
              <select value={editing.status ?? 'todo'} onChange={(e) => setEditing({ ...editing, status: e.target.value as Task['status'] })}>
                <option value="todo">À faire</option>
                <option value="in-progress">En cours</option>
                <option value="done">Terminée</option>
              </select>
            </label>
            <label>
              Priorité
              <select value={editing.priority ?? 'medium'} onChange={(e) => setEditing({ ...editing, priority: e.target.value as Task['priority'] })}>
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </label>
            <label>
              Échéance
              <input type="date" value={editing.dueDateInput ?? formatDate(editing.dueDate)} onChange={(e) => setEditing({ ...editing, dueDateInput: e.target.value })} />
            </label>
          </div>
          <div>
            <button className="nx-btn" onClick={handleSave}>{editing.id ? 'Mettre à jour' : 'Enregistrer'}</button>
            <button className="nx-btn" onClick={() => setEditing(null)}>Annuler</button>
          </div>
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
        {tasks.map((task) => (
          <li key={task.id} className="nx-list-item">
            <div className="nx-list-item-main">
              <strong>{task.title}</strong>
              <div className="nx-muted">{statusLabel(task.status)}{task.priority ? ` · ${task.priority}` : ''}{task.dueDate ? ` · ${formatDate(task.dueDate)}` : ''}</div>
              <p>{task.description}</p>
            </div>
            <div className="nx-list-item-actions">
              <button className="nx-btn" onClick={() => setEditing({ ...task, dueDateInput: task.dueDate ? formatDate(task.dueDate) : '' })}>Éditer</button>
              <button className="nx-btn" onClick={() => handleDelete(task.id)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
