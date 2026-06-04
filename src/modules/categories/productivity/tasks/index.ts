export { moduleManifest } from './module.manifest';
export * from './routes';
export async function registerRuntime(): Promise<void> {
	try {
		const { tasksWidgetManifest } = await import('./widget.manifest');
		const { widgetRegistry } = await import('@widgets/registry/widget-registry');
		widgetRegistry.register(tasksWidgetManifest as any);
	} catch (e) {
		void e;
	}

	try {
		const { getAllTasks } = await import('./tasks-store');
		const { globalSearchEngine } = await import('@core/search/global-search-engine');
		const tasks = await getAllTasks();
		const docs = tasks.map((task) => ({
			id: `task:${task.id}`,
			title: task.title,
			subtitle: `${task.status} ${task.priority ? `· ${task.priority}` : ''}`.trim(),
			category: 'productivity',
			route: '/modules/productivity/tasks',
			keywords: [task.title, task.description, task.status, task.priority ?? ''].filter(Boolean),
		}) as any);
		globalSearchEngine.registerMany(docs);
	} catch (e) {
		void e;
	}
}
