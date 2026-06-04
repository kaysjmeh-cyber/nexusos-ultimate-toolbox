import type { Task } from './tasks-types';
import { IDB_STORES } from '@nexus-types/storage';
import { storageManager } from '@core/storage/storage-manager';
import { globalSearchEngine } from '@core/search/global-search-engine';
import type { SearchDocument } from '@nexus-types/search';

const STORE = IDB_STORES.modules;
const KEY = 'tasks';

export async function getAllTasks(): Promise<Task[]> {
  const raw = await storageManager.idb.get<Record<string, Task> | undefined>(STORE, KEY);
  if (!raw) return [];
  return Object.values(raw).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveTask(task: Partial<Task> & { dueDateInput?: string }): Promise<Task> {
  const map = (await storageManager.idb.get<Record<string, Task> | undefined>(STORE, KEY)) || {};
  const now = Date.now();
  const id = task.id ?? `t-${now}-${Math.floor(Math.random() * 10000)}`;
  const parsedDueDate = task.dueDateInput ? Date.parse(task.dueDateInput) : task.dueDate;
  const entry: Task = {
    id,
    title: task.title?.trim() || 'Sans titre',
    description: task.description?.trim() || '',
    status: task.status ?? 'todo',
    priority: task.priority,
    dueDate: Number.isFinite(parsedDueDate) ? parsedDueDate : undefined,
    createdAt: task.createdAt ?? now,
    updatedAt: now,
  };
  map[id] = entry;
  await storageManager.idb.put(STORE, KEY, map);
  const doc: SearchDocument = {
    id: `task:${entry.id}`,
    title: entry.title,
    subtitle: `${entry.status} ${entry.priority ? `· ${entry.priority}` : ''}`.trim(),
    category: 'productivity',
    route: '/modules/productivity/tasks',
    keywords: [entry.title, entry.description, entry.status, entry.priority ?? ''].filter(Boolean),
  };
  globalSearchEngine.register(doc);
  return entry;
}

export async function deleteTask(id: string): Promise<void> {
  const map = (await storageManager.idb.get<Record<string, Task> | undefined>(STORE, KEY)) || {};
  delete map[id];
  await storageManager.idb.put(STORE, KEY, map);
  globalSearchEngine.remove(`task:${id}`);
}

export async function searchTasks(query: string): Promise<Task[]> {
  if (!query.trim()) return getAllTasks();
  const all = await getAllTasks();
  const lowered = query.toLowerCase();
  return all.filter(
    (task) =>
      task.title.toLowerCase().includes(lowered) ||
      task.description.toLowerCase().includes(lowered) ||
      task.status.toLowerCase().includes(lowered) ||
      (task.priority?.toLowerCase().includes(lowered) ?? false),
  );
}

export async function exportTasks(): Promise<Task[]> {
  return getAllTasks();
}

export async function importTasks(tasks: Task[]): Promise<void> {
  const map = (await storageManager.idb.get<Record<string, Task> | undefined>(STORE, KEY)) || {};
  for (const task of tasks) {
    const id = task.id ?? `t-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const entry: Task = {
      id,
      title: task.title,
      description: task.description,
      status: task.status ?? 'todo',
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt ?? Date.now(),
      updatedAt: task.updatedAt ?? Date.now(),
    };
    map[id] = entry;
    globalSearchEngine.register({
      id: `task:${entry.id}`,
      title: entry.title,
      subtitle: `${entry.status} ${entry.priority ? `· ${entry.priority}` : ''}`.trim(),
      category: 'productivity',
      route: '/modules/productivity/tasks',
      keywords: [entry.title, entry.description, entry.status, entry.priority ?? ''].filter(Boolean),
    });
  }
  await storageManager.idb.put(STORE, KEY, map);
}
