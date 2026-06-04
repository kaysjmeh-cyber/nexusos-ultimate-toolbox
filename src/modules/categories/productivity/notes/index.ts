export { moduleManifest } from './module.manifest';
export * from './routes';
export async function registerRuntime(): Promise<void> {
	// Register runtime artifacts (widget, background hooks)
	try {
		const { notesWidgetManifest } = await import('./widget.manifest');
		const { widgetRegistry } = await import('@widgets/registry/widget-registry');
		widgetRegistry.register(notesWidgetManifest as any);
	} catch (e) {
		// silent fallback
		void e;
	}
	// Load existing notes and index them into global search
	try {
		const { getAllNotes } = await import('./notes-store');
		const { globalSearchEngine } = await import('@core/search/global-search-engine');
		const notes = await getAllNotes();
		const docs = notes.map((n) => ({
			id: `note:${n.id}`,
			title: n.title || '(sans titre)',
			subtitle: n.body.slice(0, 200),
			category: 'productivity',
			route: `/modules/productivity/notes`,
			keywords: [n.title, ...n.body.split(/\s+/)].filter(Boolean),
		} as any));
		globalSearchEngine.registerMany(docs);
	} catch (e) {
		void e;
	}
}
