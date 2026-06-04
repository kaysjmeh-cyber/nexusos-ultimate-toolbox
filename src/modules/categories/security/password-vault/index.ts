export { moduleManifest } from './module.manifest';
export * from './routes';
export async function registerRuntime(): Promise<void> {
	try {
		const { passwordVaultWidget } = await import('./widget.manifest');
		const { widgetRegistry } = await import('@widgets/registry/widget-registry');
		widgetRegistry.register(passwordVaultWidget as any);
	} catch (e) {
		void e;
	}
	// index existing entries
	try {
		const { getAllEntries } = await import('./vault-store');
		const { globalSearchEngine } = await import('@core/search/global-search-engine');
		const notes = await getAllEntries();
		const docs = notes.map((n) => ({
			id: `vault:${n.id}`,
			title: n.title,
			subtitle: n.username ?? n.url ?? '',
			category: 'security',
			route: '/modules/security/password-vault',
			keywords: [n.title, n.username ?? '', ...(n.tags ?? []), n.category ?? ''].filter(Boolean),
		} as any));
		globalSearchEngine.registerMany(docs);
	} catch (e) {
		void e;
	}
}
